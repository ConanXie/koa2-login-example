'use strict'

// require('babel-polyfill')
require('babel-core/register')({
  // presets: ['es2015', 'stage-0']
  plugins: ["transform-es2015-modules-commonjs"]
})
require('./app')
