'use strict'
var test = require('tap').test
var os = require('os')
var fs = require('fs')
var path = require('path')
var rm = require('rimraf')
var mkp = require('../mkp.js')

test('mkp -- files', (t) => {
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

  var filePatterns = {
    list: 'dat/file-{a,b,c}.js',
    listnoext: 'dat/file-{a,b,c}',
    sequence: 'dat/sub/file-{a..c}.js',
    sequencenoext: 'dat/sub/file-{a..c}',
    step: 'dat/{foo,bar}/file-{a..e..2}.js',
    nested: 'dat/sub/{foo,{1..3},bar}/f.js'
  }
  var fileXpand = {
    list: ['dat/file-a.js', 'dat/file-b.js', 'dat/file-c.js'],
    listnoext: ['dat/file-a', 'dat/file-b', 'dat/file-c'],
    sequence: ['dat/sub/file-a.js', 'dat/sub/file-b.js', 'dat/sub/file-c.js'],
    sequencenoext: ['dat/sub/file-a', 'dat/sub/file-b', 'dat/sub/file-c'],
    step: ['dat/foo/file-a.js', 'dat/foo/file-c.js', 'dat/foo/file-e.js', 'dat/bar/file-a.js', 'dat/bar/file-c.js', 'dat/bar/file-e.js'],
    nested: ['dat/sub/foo/f.js', 'dat/sub/1/f.js', 'dat/sub/2/f.js', 'dat/sub/3/f.js', 'dat/sub/bar/f.js']
  }
  var wantedFiles = {
    list: fileXpand.list.map((f) => { return path.join(TEST_DIR, f) }),
    listnoext: fileXpand.listnoext.map((f) => { return path.join(TEST_DIR, f) }),
    sequence: fileXpand.sequence.map((f) => { return path.join(TEST_DIR, f) }),
    sequencenoext: fileXpand.sequencenoext.map((f) => { return path.join(TEST_DIR, f) }),
    step: fileXpand.step.map((f) => { return path.join(TEST_DIR, f) }),
    nested: fileXpand.nested.map((f) => { return path.join(TEST_DIR, f) })
  }

  t.test('> inp is string', (t) => {
    t.test('# normal path', (t) => {
      var somefile = path.join(TEST_DIR, 'dat/some/nested/parent/somefile.js')
      mkp(somefile, (er) => {
        t.error(er)
        t.ok(fs.existsSync(somefile), 'file created (normal path)')
        t.ok(fs.statSync(somefile).isFile(), 'should be file')
        t.end()
      })
    })

    t.test('# braces-list', (t) => {
      var files = path.join(TEST_DIR, filePatterns.list)
      mkp(files, (er) => {
        t.error(er)
        wantedFiles.list.forEach((f) => {
          t.ok(fs.existsSync(f), 'file created (braces-list)')
          t.ok(fs.statSync(f).isFile(), 'should be file')
        })
        t.end()
      })
    })

    t.test('# braces-sequence', (t) => {
      var files = path.join(TEST_DIR, filePatterns.sequence)
      mkp(files, (er) => {
        t.error(er)
        wantedFiles.sequence.forEach((f) => {
          t.ok(fs.existsSync(f), 'file created (braces-sequence)')
          t.ok(fs.statSync(f).isFile(), 'should be file')
        })
        t.end()
      })
    })

    t.test('# braces-step', (t) => {
      var files = path.join(TEST_DIR, filePatterns.step)
      mkp(files, (er) => {
        t.error(er)
        wantedFiles.step.forEach((f) => {
          t.ok(fs.existsSync(f), 'file created (braces-step)')
          t.ok(fs.statSync(f).isFile(), 'should be file')
        })
        t.end()
      })
    })

    t.test('# braces-nested', (t) => {
      var files = path.join(TEST_DIR, filePatterns.nested)
      mkp(files, (er) => {
        t.error(er)
        wantedFiles.nested.forEach((f) => {
          t.ok(fs.existsSync(f), 'file created (braces-nested)')
          t.ok(fs.statSync(f).isFile(), 'should be file')
        })
        t.end()
      })
    })

    t.test('>> when opts.noext is true', (t) => {
      t.test('## normal path without extname, should make file instead of dir', (t) => {
        var filewithnoext = path.join(TEST_DIR, 'dat/some/nested/filewithnoext')
        mkp(filewithnoext, {noext: true}, (er) => {
          t.error(er)
          t.ok(fs.existsSync(filewithnoext), 'file created (normal path)')
          t.ok(fs.statSync(filewithnoext).isFile(), 'should be file')
          t.end()
        })
      })
      t.test('## braces-list pattern without extname, should make files instead of dirs', (t) => {
        var files = path.join(TEST_DIR, filePatterns.listnoext)
        mkp(files, {noext: true}, (er) => {
          t.error(er)
          wantedFiles.listnoext.forEach((f) => {
            t.ok(fs.existsSync(f), 'file created (braces-list)')
            t.ok(fs.statSync(f).isFile(), 'should be file')
          })
          t.end()
        })
      })
      t.test('## braces-sequence pattern without extname, should make files instead of dirs', (t) => {
        var files = path.join(TEST_DIR, filePatterns.sequencenoext)
        mkp(files, {noext: true}, (er) => {
          t.error(er)
          wantedFiles.sequencenoext.forEach((f) => {
            t.ok(fs.existsSync(f), 'file created (braces-sequence)')
            t.ok(fs.statSync(f).isFile(), 'should be file')
          })
          t.end()
        })
      })
      t.end()
    })
    t.end()
  })

  t.test('> inp is array', (t) => {
    t.test('# array elements are combination of normal path and braces patterns', (t) => {
      var files = [path.join(TEST_DIR, 'dat/some/file.js'), path.join(TEST_DIR, filePatterns.list), path.join(TEST_DIR, filePatterns.sequence)]
      mkp(files, (er) => {
        t.error(er)
        t.ok(fs.existsSync(files[0]), 'file created (normal path)')
        t.ok(fs.statSync(files[0]).isFile(), 'should be file')
        wantedFiles.list.forEach((f) => {
          t.ok(fs.existsSync(f), 'file created (braces-list)')
          t.ok(fs.statSync(f).isFile(), 'should be file')
        })
        wantedFiles.sequence.forEach((f) => {
          t.ok(fs.existsSync(f), 'file created (braces-sequence)')
          t.ok(fs.statSync(f).isFile(), 'should be file')
        })
        t.end()
      })
    })

    t.test('# array elements are all braces patterns', (t) => {
      var files = [path.join(TEST_DIR, filePatterns.list), path.join(TEST_DIR, filePatterns.sequence), path.join(TEST_DIR, filePatterns.step), path.join(TEST_DIR, filePatterns.nested)]
      mkp(files, (er) => {
        t.error(er)
        wantedFiles.list.forEach((f) => {
          t.ok(fs.existsSync(f), 'file created (braces-list)')
          t.ok(fs.statSync(f).isFile(), 'should be file')
        })
        wantedFiles.sequence.forEach((f) => {
          t.ok(fs.existsSync(f), 'file created (braces-sequence)')
          t.ok(fs.statSync(f).isFile(), 'should be file')
        })
        wantedFiles.step.forEach((f) => {
          t.ok(fs.existsSync(f), 'file created (braces-step)')
          t.ok(fs.statSync(f).isFile(), 'should be file')
        })
        wantedFiles.nested.forEach((f) => {
          t.ok(fs.existsSync(f), 'file created (braces-nested)')
          t.ok(fs.statSync(f).isFile(), 'should be file')
        })
        t.end()
      })
    })

    t.test('>> when opts.noext is true', (t) => {
      t.test('## normal path and braces without extname, should make files instead of dirs', (t) => {
        var files = [path.join(TEST_DIR, 'dat/some/filenoext'), path.join(TEST_DIR, filePatterns.listnoext), path.join(TEST_DIR, filePatterns.sequencenoext)]
        mkp(files, {noext: true}, (er) => {
          t.error(er)
          t.ok(fs.existsSync(files[0]), 'file created (normal path)')
          t.ok(fs.statSync(files[0]).isFile(), 'should be file')
          wantedFiles.listnoext.forEach((f) => {
            t.ok(fs.existsSync(f), 'file created (braces-list)')
            t.ok(fs.statSync(f).isFile(), 'should be file')
          })
          wantedFiles.sequencenoext.forEach((f) => {
            t.ok(fs.existsSync(f), 'file created (braces-sequence)')
            t.ok(fs.statSync(f).isFile(), 'should be file')
          })
          t.end()
        })
      })
      t.test('## all braces pattern combination of with and without extname, should make files instead of dirs', (t) => {
        var files = [path.join(TEST_DIR, filePatterns.listnoext), path.join(TEST_DIR, filePatterns.sequencenoext), path.join(TEST_DIR, filePatterns.step), path.join(TEST_DIR, filePatterns.nested)]
        mkp(files, {noext: true}, (er) => {
          t.error(er)
          wantedFiles.listnoext.forEach((f) => {
            t.ok(fs.existsSync(f), 'file created (braces-list)')
            t.ok(fs.statSync(f).isFile(), 'should be file')
          })
          wantedFiles.sequencenoext.forEach((f) => {
            t.ok(fs.existsSync(f), 'file created (braces-sequence)')
            t.ok(fs.statSync(f).isFile(), 'should be file')
          })
          wantedFiles.step.forEach((f) => {
            t.ok(fs.existsSync(f), 'file created (braces-step)')
            t.ok(fs.statSync(f).isFile(), 'should be file')
          })
          wantedFiles.nested.forEach((f) => {
            t.ok(fs.existsSync(f), 'file created (braces-nested)')
            t.ok(fs.statSync(f).isFile(), 'should be file')
          })
          t.end()
        })
      })
      t.end()
    })
    t.end()
  })
  t.end()
})
