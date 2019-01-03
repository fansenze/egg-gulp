const GulpCluster = require('./lib/cluster')

module.exports = agent => {
  const cluster = new GulpCluster({ agent })

  agent.beforeStart(async () => {
    cluster.start()
  })

  function exit () {
    cluster.kill()
    process.exit(0)
  }

  process.on('SIGINT', exit)
  process.on('exit', exit)
}
