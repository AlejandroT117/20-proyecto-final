const express = require('express')
const {Router} = express
const path = require('path')
const ContenedorCart = require('../models/carts')
const container = new ContenedorCart('./database/carritos.json')

const router = Router()

//post 
router.post('/', (req, res)=>{
  container.create()
    .then((resp)=>{
      res.send(`Carrito con Id: ${resp}`)
    })
    .catch((err)=>{
      res.send(err)
    })

})

//delete by id
router.delete('/:id', (req,res)=>{
  const {id} = req.params
  const idNum = parseInt(id)

  container.deleteById(idNum)
  .then((resp)=>{
    res.send(`Carrito borrado id:${idNum}`)
  })
  .catch((err)=>{
    res.send(err)
  })
})

//get products by id cart
router.get('/:id/productos', (req,res)=>{
  const {id} = req.params
  const idNum = parseInt(id)

  container.getProductsByIdCart(idNum)
    .then((resp)=>{
      if(resp.length){
        res.send(`Carrito con Id: ${idNum} tiene los productos: ${JSON.stringify(resp)} `)
      }else{
        res.send(`El carrito con Id: ${idNum} no tiene productos`)
      }
    })
    .catch((err)=>{
      res.send(err)
    })
})

//POST
router.post('/:id/productos', (req,res)=>{
  const {id} = req.params
  const idNum = parseInt(id)
  const {nombre, precio, img, stock, descripcion, código} = req.body

  const new_product = {nombre, precio, img, stock, descripcion, código}

  container.saveProdByIdCart(idNum, new_product)
    .then((resp)=>{
      res.send(`Se añadió el producto ${JSON.stringify(resp)} al carrito ${idNum}`)
    })
    .catch((err)=>{
      res.send(err)
    })

})

router.delete('/:id/productos/:id_prod', (req,res)=>{
  const {id} = req.params
  const idNum = parseInt(id)
  const {id_prod} = req.params
  const id_prodNum = parseInt(id_prod)

  container.deleteProductById(idNum, id_prodNum)
    .then((resp)=>{
      res.send(`Producto borrado id:${id_prod} del carrito ${id}`)
    })
    .catch((err)=>{
      res.send(err)
    })

})

module.exports = router