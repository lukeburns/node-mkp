'use strict'
var test = require('tap').test
var os = require('os')
var fs = require('fs')
var path = require('path')
var rm = require('rimraf')
var mkp = require('../mkp.js')

test('mkp -- dirs', (t) => {
  var TEST_DIR = path.join(os.tmpdir(), 'test-mkp')
  t.beforeEach((done) => {
    rm.sync(TEST_DIR)
    mkp.sync(TEST_DIR)
    done()
  })
  t.afterEach((done) => {
    rm.sync(TEST_DIR)
    done()
  })

  var dirPatterns = {
    list: 'dat/dir-{a,b,c}',
    sequence: 'dat/sub/dir-{a..c}',
    step: 'dat/{foo,bar}/dir-{a..e..2}',
    nested: 'dat/sub/{foo,{1..3},bar}/dir'
  }

  var dirXpand = {
    list: ['dat/dir-a', 'dat/dir-b', 'dat/dir-c'],
    sequence: ['dat/sub/dir-a', 'dat/sub/dir-b', 'dat/sub/dir-c'],
    step: ['dat/foo/dir-a', 'dat/foo/dir-c', 'dat/foo/dir-e', 'dat/bar/dir-a', 'dat/bar/dir-c', 'dat/bar/dir-e'],
    nested: ['dat/sub/foo/dir', 'dat/sub/1/dir', 'dat/sub/2/dir', 'dat/sub/3/dir', 'dat/sub/bar/dir']
  }

  var wantedDirs = {
    list: dirXpand.list.map((dir) => { return path.join(TEST_DIR, dir) }),
    sequence: dirXpand.sequence.map((dir) => { return path.join(TEST_DIR, dir) }),
    step: dirXpand.step.map((dir) => { return path.join(TEST_DIR, dir) }),
    nested: dirXpand.nested.map((dir) => { return path.join(TEST_DIR, dir) })
  }

  t.test('> inp is string', (t) => {
    t.test('# normal path', (t) => {
      var somedir = path.join(TEST_DIR, 'dat/some/nested/parent/somedir')
      mkp(somedir, (er) => {
        t.error(er)
        t.ok(fs.existsSync(somedir), 'dir created (normal path)')
        t.ok(fs.statSync(somedir).isDirectory(), 'should be dir')
        t.end()
      })
    })

    t.test('# braces-list', (t) => {
      var dirs = path.join(TEST_DIR, dirPatterns.list)
      mkp(dirs, (er) => {
        t.error(er)
        wantedDirs.list.forEach((dir) => {
          t.ok(fs.existsSync(dir), 'dir created (braces-list)')
          t.ok(fs.statSync(dir).isDirectory(), 'should be dir')
        })
        t.end()
      })
    })

    t.test('# braces-sequence', (t) => {
      var dirs = path.join(TEST_DIR, dirPatterns.sequence)
      mkp(dirs, (er) => {
        t.error(er)
        wantedDirs.sequence.forEach((dir) => {
          t.ok(fs.existsSync(dir), 'dir created (braces-sequence)')
          t.ok(fs.statSync(dir).isDirectory(), 'should be dir')
        })
        t.end()
      })
    })

    t.test('# braces-step', (t) => {
      var dirs = path.join(TEST_DIR, dirPatterns.step)
      mkp(dirs, (er) => {
        t.error(er)
        wantedDirs.step.forEach((dir) => {
          t.ok(fs.existsSync(dir), 'dir created (braces-step)')
          t.ok(fs.statSync(dir).isDirectory(), 'should be dir')
        })
        t.end()
      })
    })

    t.test('# braces-nested', (t) => {
      var dirs = path.join(TEST_DIR, dirPatterns.nested)
      mkp(dirs, (er) => {
        t.error(er)
        wantedDirs.nested.forEach((dir) => {
          t.ok(fs.existsSync(dir), 'dir created (braces-nested)')
          t.ok(fs.statSync(dir).isDirectory(), 'should be dir')
        })
        t.end()
      })
    })
    t.end()
  })

  t.test('> inp is array', (t) => {
    t.test('# array elements are combination of normal path and braces patterns', (t) => {
      var dirs = [path.join(TEST_DIR, 'dat/some/dir'), path.join(TEST_DIR, dirPatterns.list), path.join(TEST_DIR, dirPatterns.sequence)]
      mkp(dirs, (er) => {
        t.error(er)

        t.ok(fs.existsSync(dirs[0]), 'dir created (normal path)')
        t.ok(fs.lstatSync(dirs[0]).isDirectory(), 'should be dir')
        wantedDirs.list.forEach((dir) => {
          t.ok(fs.existsSync(dir), 'dir created (braces-list)')
          t.ok(fs.statSync(dir).isDirectory(), 'should be dir')
        })
        wantedDirs.sequence.forEach((dir) => {
          t.ok(fs.existsSync(dir), 'dir created (braces-sequence)')
          t.ok(fs.statSync(dir).isDirectory(), 'should be dir')
        })
        t.end()
      })
    })

    t.test('# array elements are all braces patterns', (t) => {
      var dirs = [path.join(TEST_DIR, dirPatterns.list), path.join(TEST_DIR, dirPatterns.sequence), path.join(TEST_DIR, dirPatterns.step), path.join(TEST_DIR, dirPatterns.nested)]
      mkp(dirs, (er) => {
        t.error(er)

        wantedDirs.list.forEach((dir) => {
          t.ok(fs.existsSync(dir), 'dir created (braces-list)')
          t.ok(fs.statSync(dir).isDirectory(), 'should be dir')
        })
        wantedDirs.sequence.forEach((dir) => {
          t.ok(fs.existsSync(dir), 'dir created (braces-sequence)')
          t.ok(fs.statSync(dir).isDirectory(), 'should be dir')
        })
        wantedDirs.step.forEach((dir) => {
          t.ok(fs.existsSync(dir), 'dir created (braces-step)')
          t.ok(fs.statSync(dir).isDirectory(), 'should be dir')
        })
        wantedDirs.nested.forEach((dir) => {
          t.ok(fs.existsSync(dir), 'dir created (braces-nested)')
          t.ok(fs.statSync(dir).isDirectory(), 'should be dir')
        })
        t.end()
      })
    })
    t.end()
  })

  t.end()
})
