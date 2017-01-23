'use strict'
const path = require('path')
const touch = require('touch')
const mkdirp = require('mkdirp')
const braces = require('braces')
const isglob = require('is-glob')
const async = require('async')

function _mkfile (inp, opts, cb) {
  mkdirp(path.dirname(inp), (err) => {
    if (err) return cb(err)
    return touch(inp, opts, cb)
  })
}

function _mkfileSync (inp, opts) {
  try {
    mkdirp.sync(path.dirname(inp))
    return touch.sync(inp, opts)
  } catch (er) {
    throw er
  }
}

function _mkpath (inp, opts, cb) {
  if (path.extname(inp) === '') {
    if (opts.noext) {
      return _mkfile(inp, opts, cb)
    } else {
      return mkdirp(inp, opts, cb)
    }
  } else {
    return _mkfile(inp, opts, cb)
  }
}

function _mkpathSync (inp, opts) {
  try {
    if (path.extname(inp) === '') {
      if (opts.noext) {
        return _mkfileSync(inp, opts)
      } else {
        return mkdirp.sync(inp, opts)
      }
    } else {
      return _mkfileSync(inp, opts)
    }
  } catch (er) {
    throw er
  }
}

function _mk (inp, opts, cb) {
  if (isglob(inp)) {
    async.each(braces.expand(inp), (xpath, callback) => {
      _mkpath(xpath, opts, (er) => {
        if (er) return callback(er)
        return callback()
      })
    }, (er) => {
      if (er) return cb(er)
      else return cb()
    })
  } else {
    return _mkpath(inp, opts, cb)
  }
}

function _mkSync (inp, opts) {
  try {
    if (isglob(inp)) {
      braces.expand(inp).forEach((xpath) => {
        _mkpathSync(xpath, opts)
      })
    } else {
      return _mkpathSync(inp, opts)
    }
  } catch (er) {
    throw er
  }
  return
}

function mkp (inp, opts, cb) {
  if (typeof opts === 'function') {
    cb = opts
    opts = {}
  }

  if (typeof inp === 'string') {
    _mk(inp, opts, (er) => {
      if (er) return cb(er)
      else return cb()
    })
  }

  if (Array.isArray(inp) && inp.length > 0) {
    async.each(inp, (i, callback) => {
      _mk(i, opts, (er) => {
        if (er) return callback(er)
        return callback()
      })
    }, (er) => {
      if (er) return cb(er)
      else return cb()
    })
  }
}

mkp.sync = function sync (inp, opts) {
  if (!opts) opts = {}
  try {
    if (typeof inp === 'string') {
      return _mkSync(inp, opts)
    }
    if (Array.isArray(inp) && inp.length > 0) {
      inp.forEach((i) => {
        _mkSync(i, opts)
      })
      return
    }
  } catch (er) {
    throw er
  }
}

module.exports = mkp
