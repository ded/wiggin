var Ender = require('ender')
  , cwd = process.cwd()
  , debug = require('debug')('dexter:task')

/**
 * Ender must be run in root of its packages
 * otherwise it conflicts with the main `package.json`
 * dependencies of the app. Therefore we `chdir()`
 */
process.chdir('./client/ender/')

Ender.exec('ender build . --output ../../public/js/ender/ender.js', function () {
  debug('compiled Ender build :)')
  // reset to the process to the original working directory
  process.chdir(cwd)
})
