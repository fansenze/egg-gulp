const { spawn } = require('child_process')

class GulpCluster {
  constructor ({ agent }) {
    this.workers = {}
    this.agent = agent
  }

  start () {
    const cp = spawn('npx', ['gulp', 'watch'])
    this.workers[cp.pid] = cp
    cp.stdout.on('data', (data) => {
      this.logger(`egg-gulp: ${data}`)
    })
    cp.stderr.on('data', (data) => {
      this.logger(`egg-gulp err: ${data}`)
    })
    cp.on('error', (err) => {
      this.kill(cp.pid)
      this.logger(`egg-gulp start up err: ${err}`, 'error')
    })
    cp.on('close', () => {
      this.kill(cp.pid)
    })
  }

  kill (pid) {
    const map = pid ? { [pid]: this.workers[pid] } : this.workers
    for (const id in map) {
      const cp = map[id]
      !cp.killed && cp.kill(2)
    }
  }

  logger (msg, level = 'info') {
    this.agent.coreLogger[level](msg)
  }
}

module.exports = GulpCluster
