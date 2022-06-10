const { verifyToken } = require("../auth/jwt");
const logger = require('../log')

module.exports = (req,res,next)=>{
  const header = req.headers.authorization

  if(!header){
    return res.status(401).send({
      error:'unauthorized'
    })
  }

  const token = header.split(" ")[1]
  logger.log(`Token JWT: ${token}`)

  if(!verifyToken(token)){
    return res.status(401).send({
      error:'unauthorized'
    })
  }

  next()
}