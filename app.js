'use strict'

const request = require('request')
// noinspection JSUnresolvedVariable
const CronJob = require('cron').CronJob
const Datastore = require('@google-cloud/datastore')

const config = require('./config')
const cache = require('./cache')

// noinspection JSUnresolvedFunction
const datastore = Datastore({
  projectId: config.get('GCLOUD_PROJECT')
})

const btcCache = new cache.CompleteOrdersCache('btc', datastore)

const URL_BTC_COINONE_RECENT_COMPLETE_ORDERS = 'https://api.coinone.co.kr/trades/'

new CronJob('*/30 * * * * *', () => {
  request(URL_BTC_COINONE_RECENT_COMPLETE_ORDERS, (error, response, body) => {
    // response && response.statusCode
    if (response.statusCode !== 200) {
      console.log('Error : response is not ok - status: ' + response.statusCode)
    }

    const jsonBody = JSON.parse(body)
    const result = btcCache.update(jsonBody['completeOrders'])

    if (result.cacheSizeBefore > 10000) {
      btcCache.emit()
    }
  })
}, null, true, 'Asia/Seoul')
