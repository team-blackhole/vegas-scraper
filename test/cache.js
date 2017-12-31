'use strict'

const assert = require('assert')

const cache = require('../cache')

/*
  cache :
    [
      {
        'timestamp': '123', // timestamp in seconds
        'price': '1234',
        'qty': '0.00123'
      },
      {
        'timestamp': '124', // timestamp in seconds
        'price': '1234',
        'qty': '0.00123'
      }
    ]
 */

describe('Cache Test Suite', () => {
  const btcCache = new cache.CompleteOrdersCache()

  it('update', () => {

    let orders = [{
      'timestamp': '1',
      'price': '123',
      'qty': '0.1'
    }]

    let result = btcCache.update(orders)

    console.log(result)

    assert.equal(result.before, 0)
    assert.equal(result.duplicated, 0)
    assert.equal(result.after, 1)
    assert.equal(result.cacheSizeBefore, 0)
    assert.equal(result.orderSize, 1)
    assert.equal(result.check, true)

    result = btcCache.update(orders)

    console.log(result)

    assert.equal(result.before, 0)
    assert.equal(result.duplicated, 1)
    assert.equal(result.after, 0)
    assert.equal(result.cacheSizeBefore, 1)
    assert.equal(result.orderSize, 1)
    assert.equal(result.check, true)
  })
})
