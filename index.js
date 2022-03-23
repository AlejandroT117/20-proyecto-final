const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const path = require('path')
const PORT = process.env.PORT || 8080

const {HOSTNAME, SCHEMA, DATABASE, DBPORT, OPTIONS} = require('./config')
const prodsRouter = require('./routes/productos')
const homeRouter = require('./routes/home')
const carritoRouter = require('./routes/carrito')
const adminMiddleware = require('./middlewares/admin')

/* Mongo */
mongoose.connect(`${SCHEMA}://${HOSTNAME}:${DBPORT}/${DATABASE}?${OPTIONS}`)
  .then(()=>{
    console.log('Corriendo mongo')
  })
  .catch((err)=>{
    console.log(`Error en mongo: ${err}`)
  })

/* express */
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use("/static", express.static(path.join(__dirname, '/public')))

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === 'OPTIONS') {
      res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE, GET");
      return res.status(200).json({});
  }
  next();
});

app.use("/", homeRouter)
app.use('/api/productos', adminMiddleware, prodsRouter)
app.use('/api/carrito', carritoRouter)

app.use((err, req, res, next)=>{
  console.log(err.stack)
  res.status(500).send({ error: err })
  next(err);
})

app.get('*', function(req, res){
  res.status(400).send(({status:404,title:"Not Found",msg:"Route not found"}))
});
app.listen(
  PORT, ()=>console.log(`Escuchando en: http://localhost:${PORT}`)
)