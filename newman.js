const newman = require('newman')

const config = [{
  collection: 'collection_one.json',
  environment: 'env_one.json'
}, {
  collection: 'collection_two.json',
  environment: 'env_two.json'
}]

const runs = config.map((cfg, i) => {
  return new Promise((resolve, reject) => {
    newman.run(cfg, (err, summary) => {
      if (err) reject(err)
      else resolve(summary)
    })
  })
})

Promise.all(runs).then((results) => {
  console.log(results)
})
