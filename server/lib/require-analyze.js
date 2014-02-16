/**
 * @fileoverview builds a dependency tree based on file input
 * scanning for `require` statements
 */
var fs = require('fs')
  , path = require('path')
  , klass = require('klass')
  , v = require('valentine')
  , pwd = process.cwd()
  , pwdLen = pwd.length

var Init = klass(function init(input, root) {
  // change pwd to initial input
  if (root) process.chdir(root)
  this.dependencies = []
  this.getDependencyTree(input)
  // reset the process directory after getting a tree
  process.chdir(pwd)
})
  .methods({
    get: function () {
      var uniqDeps = v(this.dependencies).uniq()
        , last = uniqDeps.pop()
      uniqDeps.unshift(last)
      return uniqDeps
    }
  , getDependencyTree: function getDependencyTree(entry) {
      this.getDependenciesInFile(entry).forEach(function (dep) {
        this.getDependencyTree(dep)
      }, this)
    }
  , getDependenciesInFile: function getDependenciesInFile(file) {
      /**
       * the '*' convention denotes that this is a pre-built `public/` file
       */
      file = file.replace('*', 'public/js/')
      var ext = file.match(/(\.js(on)?)$/) ? '' : '.js'
        , fileToRead = path.normalize(process.cwd() + '/' + file + ext)
        , fileContents
      if (!fs.existsSync(fileToRead)) return []
      fileContents = fs.readFileSync(fileToRead, 'utf8')
      this.dependencies.unshift((process.cwd() + '/' + file).substring(pwdLen) + ext)
      return this.constructor.parse(fileContents)
    }
  })
  .statics({
    parse: function parse(text) {
      var finder = /\b(?:require\(['"])([\w\/\-\*\.]+?)(?:['"]\))/g
      return v((text
        .split(/\n/).filter(function (line) {
          // remove `// inline comments`
          return !line.match(/^\s*\/\//)
        })
        .join('\n')
        // remove `/* block comments */`
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .match(finder) || [])
        .map(function (m) {
          return m.split(finder)[1]
        }))
        .uniq()
    }
  })

module.exports.init = function (input, root) {
  return new Init(input, root)
}
module.exports.parse = Init.parse
