'use strict'

const request = require('request')
// noinspection JSUnresolvedVariable
const CronJob = require('cron').CronJob
const Datastore = require('@google-cloud/datastore')

const config = require('./config')
const cache = require('./cache')

const btcCache = new cache.CompleteOrdersCache()

const URL_BTC_COINONE_RECENT_COMPLETE_OREDERS = 'https://api.coinone.co.kr/trades/'

new CronJob('*/10 * * * * *', () => {
  request(URL_BTC_COINONE_RECENT_COMPLETE_OREDERS, (error, response, body) => {
    // error
    // response && response.statusCode
    // body

    // check how many entities are duplicated.
    const jsonBody = JSON.parse(body)
    const result = btcCache.update(jsonBody['completeOrders'])
    console.log(result)
  })
}, null, true, 'Asia/Seoul')
