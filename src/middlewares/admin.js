const isAdmin = true;

const isAuth =(req, res, next)=>{
  if(isAdmin){
    return next()
  }

  if(req.method=== 'POST' || req.method === 'PUT' || req.method === 'DELETE'){
    return res.status(403).send({
      error:-1,
      message:'El usuario no tiene autorización'
    })
  }

  next()
}

module.exports = isAuth