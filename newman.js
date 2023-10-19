const newman = require('newman')

const config = [{
  collection: 'postman_collection.json',
  environment: 'postman_environment.json'
}, {
  collection: 'postman_echo.json'
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
