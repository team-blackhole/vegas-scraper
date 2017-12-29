'use strict'

const nconf = module.exports = require('nconf')
const path = require('path')

// check 1. command line args 2. env 3. config file 4. defaults
nconf
  .argv()
  .env([
    'DATA_BACKEND',
    'GCLOUD_PROJECT'
  ])
  .file({file: path.join(__dirname, 'config.json')})
  .defaults({})

// Check for required settings
checkConfig('GCLOUD_PROJECT')

function checkConfig (setting) {
  if (!nconf.get(setting)) {
    throw new Error('You must set ${setting} as an environment variable or in config.json!')
  }
}
