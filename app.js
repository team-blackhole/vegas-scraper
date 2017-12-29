'use strict'

const request = require('request')
// noinspection JSUnresolvedVariable
const CronJob = require('cron').CronJob
const Datastore = require('@google-cloud/datastore')

const config = require('./config')

new CronJob('1 * * * * *', () => {
  request('http://api.coinone.co.kr/ticker/?format=json&currency=iota', (error, response, body) => {
    console.log('error:', error) // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode) // Print the response status code if a response was received
    console.log('body:', body) // Print the HTML for the Google homepage.
  })
}, null, true, 'Asia/Seoul')

// Datastore test
const datastore = Datastore({
  projectId: config.get('GCLOUD_PROJECT')
})
const kind = 'CoinoneIota'

const key = datastore.key(kind)

function toDatastore (obj, nonIndexed) {
  nonIndexed = nonIndexed || []
  const results = []
  Object.keys(obj).forEach((k) => {
    if (obj[k] === undefined) {
      return
    }
    results.push({
      name: k,
      value: obj[k],
      excludeFromIndexes: nonIndexed.indexOf(k) !== -1
    })
  })
  return results
}

const data = {'test': '1234'}
const entity = {
  key: key,
  data: toDatastore(data, ['description'])
}

datastore.save(
  entity,
  (err) => {
    data.id = entity.key.id
    if (err) {
      console.log(err)
    } else {
      console.log(data)
      console.log('test success')
    }
  }
)
