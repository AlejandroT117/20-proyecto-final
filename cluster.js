
const cluster = require("cluster")
const CPUs = require("os").cpus().length
/* Yargs */
const yargs = require('./src/config/yargs')
const app = require("./src/index")
/* logger */
const logger = require('./src/log')

const PORT = process.env.PORT || yargs().port;
const MODO = yargs().modo;

if(MODO==='cluster'){
  if (cluster.isPrimary) {
    for (let i = 0; i < CPUs; i++) {
      setTimeout(() => cluster.fork(), 1000 * i)
    }
  
    cluster.on("exit", (worker, code, signal) => {
      logger.log(`Worker ${worker.process.pid} died!!!`)
    })
  
    logger.log("soy el proceso primario", process.pid)
  } else {
    app.listen(PORT, () => logger.log(`Process ${process.pid} listening on: http://localhost:${PORT}\n`))
  }
}else{
  app.listen(PORT, () => logger.log(`Process ${process.pid} listening on: http://localhost:${PORT}\n`))
}