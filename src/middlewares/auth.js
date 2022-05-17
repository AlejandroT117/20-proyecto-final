module.exports = (req,res,next)=>{
  if(!req.isAuthenticated()){
    return res.send('log in previously')
  }

  next()
}