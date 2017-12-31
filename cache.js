'use strict'

class CompleteOrdersCache {
  constructor () {
    this.cache = []
  }

  update (orders) {
    const matchingIndex = this._match(orders)

    let i = 0
    // check really matching
    if (matchingIndex >= 0) {
      for (i = 0; i < this.cache.length - matchingIndex; i++) {
        if (orders[i]['timestamp'] !== this.cache[i + matchingIndex]['timestamp']) {
          throw 'Matching Failed' // TODO catch this : maybe better to reset cache, emit(?) and log
        }
      }
    }

    const nBefore = (matchingIndex >= 0) ? matchingIndex : this.cache.length
    const cacheSizeBefore = this.cache.length
    const after = orders.slice(i)
    Array.prototype.push.apply(this.cache, after)

    return {
      'before': nBefore,
      'duplicated': i,
      'after': after.length,
      'cacheSizeBefore': cacheSizeBefore,
      'orderSize': orders.length,
      'check': nBefore + i + i + after.length === cacheSizeBefore + orders.length
    }
  }

  emit () {
    // to Datastore
  }

  _match (orders) {
    const timeFirstOrder = orders[0]['timestamp']

    const matchingIndexes = []

    for (let i = 0; i < this.cache.length; i++) {
      if (timeFirstOrder === this.cache[i]['timestamp']) {
        matchingIndexes.push(i)
      }
    }

    const LENGTH_TO_TEST = 10

    let order, cached
    for (let i = 0; i < matchingIndexes.length; i++) {
      let j
      for (j = 0; j < LENGTH_TO_TEST; j++) {
        order = orders[i + j]
        cached = this.cache[matchingIndexes[i] + j]
        if (!cached) {
          return i
        }
        if (order['timestamp'] !== cached['timestamp']
          || order['price'] !== cached['price']
          || order['qty'] !== cached['qty']) {
          break
        }
      }

      if (j === LENGTH_TO_TEST) {
        return i
      }
    }

    return undefined
  }
}

exports.CompleteOrdersCache = CompleteOrdersCache
