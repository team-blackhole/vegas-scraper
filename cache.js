'use strict'

class CompleteOrdersCache {
  constructor (kind, datastore) {
    this.cache = []
    this.datastore = datastore
    this.kind = kind
    this.key = datastore.key(kind)
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
      const cacheSizeBefore = this.cache.length
      const after = orders.slice(i)
      Array.prototype.push.apply(this.cache, after)
    }

    const nBefore = (matchingIndex >= 0) ? matchingIndex : this.cache.length

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
    // 이거 ojbect만 되는 건가?
    // TODO
    const data = {'test': '1234'}
    const entity = {
      key: this.key,
      data: toDatastore(data, ['description'])
    }

    this.datastore.save(
      entity,
      (err) => {
        data.id = entity.key.id

        if (err) {
          console.log(err)
        }
      }
    )

    const transaction = this.datastore.transaction();
    const taskKey = this.datastore.key([
      'Task',
      taskId
    ]);

    transaction.run()
      .then(() => transaction.get(taskKey))
      .then((results) => {
        const task = results[0];
        task.done = true;
        transaction.save({
          key: taskKey,
          data: task
        });
        return transaction.commit();
      })
      .then(() => {
        // The transaction completed successfully.
        console.log(`Task ${taskId} updated successfully.`);
      })
      .catch(() => transaction.rollback());

    // 청소
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

exports.CompleteOrdersCache = CompleteOrdersCache
