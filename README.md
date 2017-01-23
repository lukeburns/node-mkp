node-mkp
========

[![npm](https://img.shields.io/npm/v/mkp.svg?style=flat-square)](https://www.npmjs.com/package/mkp)
[![travis](https://travis-ci.org/manidlou/node-mkp.svg?branch=master)](https://travis-ci.org/manidlou/node-mkp)


`mkp` (mk path) is a [node.js](https://nodejs.org) module that recursively creates paths, both directory and file with brace expansion support. It means, you can do stuff like `mkdir -p /some/dir/{foo,bar}/baz`, but in node.js!

Install
-------

    npm i mkp

Usage
-----

### mkp(input[, options], cb)

- `input` `{String | Array<String>}` string or an array of strings of normal paths (file and dir) and/or [braces](https://github.com/jonschlinkert/braces#features) patterns.
- `options` `{Object}` *optional* (all options are `false` by default)
 - `noext` `{Boolean}`
   - the default behavior is if path doesn't have extname, it is created as a directory. If `{noext: true}` then paths without extname will be created as files and not dirs. It is basically used when you want to create file(s) without extname, like `/some/filenoext`.
 - plus all [mkdirp](https://github.com/substack/node-mkdirp) and [touch](https://github.com/isaacs/node-touch) options.

- return `cb(err)` with possible err or null.

Create files and/or dirs. `input` can be file, dir, things like `/some/foo-{1..3}/file.js` or an array of each or combination of all of them. It doesn't matter. Just put it there, you most likely get what you want. It couldn't be simpler than this. Please checkout examples down below.

### mkp.sync(input[, options])

create files and dirs sync. `input` and `options` are the same as async version. It throws err if any found.

```js
const mkp = require('mkp')

var dir = 'some/nested/dir'
try {
  mkp.sync(dir)
  console.log('done!')
} catch (er) {
  console.error(er)
}
```

Examples
--------

In all examples, it is assumed

```js
const mkp = require('mkp')
```
is declared before.

**_dirs (input is string)_**

```js
var dir = 'some/nested/dir'
mkp(dir, (er) => {
  if (er) console.error(er)
  else console.log('done!')
})
```

```js
var dirs = 'some/nested/dir-{a,b,c}'
mkp(dirs, (er) => {
  if (er) console.error(er)
  else console.log('done!')
  // all 'some/nested/dir-a', 'some/nested/dir-b', 'some/nested/dir-c' created!
})
```

```js
var dirs = 'some/nested/dir-{a..c}'
mkp(dirs, (er) => {
  if (er) console.error(er)
  else console.log('done!')
})
```

```js
var dirs = 'some/nested/{foo,bar}/dir-{a..e..2}'
mkp(dirs, (er) => {
  if (er) console.error(er)
  else console.log('done!')
})
```

```js
var dirs = 'some/nested/{foo,{1..3},bar}/dir'
mkp(dirs, (er) => {
  if (er) console.error(er)
  else console.log('done!')
})
```

**_files (input is string)_**

```js
var file = 'some/nested/file.js'
mkp(file, (er) => {
  if (er) console.error(er)
  else console.log('done!')
})
```

```js
var files = 'some/nested/file-{a,b,c}.js'
mkp(files, (er) => {
  if (er) console.error(er)
  else console.log('done!')
  // all 'some/nested/file-a.js', 'some/nested/file-b.js', 'some/nested/file-c.js' created!
})
```

```js
var files = 'some/nested/file-{a..c}.js'
mkp(files, (er) => {
  if (er) console.error(er)
  else console.log('done!')
})
```

```js
var files = 'some/nested/{foo,bar}/file-{a..e..2}.js'
mkp(files, (er) => {
  if (er) console.error(er)
  else console.log('done!')
})
```

```js
var files = 'some/nested/{foo,{1..3},bar}/file.js'
mkp(files, (er) => {
  if (er) console.error(er)
  else console.log('done!')
})
```
#####_`noext` option (useful when you want to create files with no extname)_

```js
var file = 'some/nested/filenoext'
// without {noext: true}, it will be created as dir
mkp(file, (er) => {
  if (er) console.error(er)
  else console.log('done!')
})
```

```js
var file = 'some/nested/filenoext'
// now it will be created as file
mkp(file, {noext: true}, (er) => {
  if (er) console.error(er)
  else console.log('done!')
})
```

**_input is array_**

```js
var dirs = ['some/nested/dir-{a,b,c}', 'some/other/nested/dir']
mkp(dirs, (er) => {
  if (er) console.error(er)
  else console.log('done!')
})
```

```js
var files = ['some/nested/file-{a,b,c}.js', 'some/other/nested/file.md']
mkp(files, (er) => {
  if (er) console.error(er)
  else console.log('done!')
})
```

```js
var paths = [
  'some/nested/dir-{a,b,c}',
  'some/nested/file-{a,b,c}.js',
  'some/other/nested/dir',
  'some/other/nested/file.js'
]

mkp(paths, (er) => {
  if (er) console.error(er)
  else console.log('done!')
})
```

License
-------

Licensed under MIT

