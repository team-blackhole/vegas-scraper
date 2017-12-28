const request = require('request')
// noinspection JSUnresolvedVariable
const CronJob = require('cron').CronJob

new CronJob('1 * * * * *', () => {
  request('http://api.coinone.co.kr/ticker/?format=json&currency=iota', (error, response, body) => {
    console.log('error:', error) // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode) // Print the response status code if a response was received
    console.log('body:', body) // Print the HTML for the Google homepage.
  })
}, null, true, 'Asia/Seoul')
