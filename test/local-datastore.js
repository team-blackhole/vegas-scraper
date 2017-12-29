const assert = require('assert')
const Datastore = require('@google-cloud/datastore')

const config = require('../config')

describe('Database', function () {
  describe('Datastore', function () {
    it('check connection to the local Datastore emulator', function (done) {

      const datastore = Datastore({
        projectId: config.get('GCLOUD_PROJECT')
      })
      const kind = 'test'

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
            assert.ok(false)
          } else {
            done()
          }
        }
      )
    })
  })
})
