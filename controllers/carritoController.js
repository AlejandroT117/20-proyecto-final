const cartModel = require('../models/carts')

module.exports = {
  loadData: async (req, res) => {
    try {
      const carritos = await cartModel.loadData("../database/carritos.json");
      res.status(200).send(`No. carritos registrados: ${carritos}`);
      console.log(`Carritos cargados desde json ${carritos}`);
    } catch (e) {
      res.status(400).send("Error cargando datos");
      console.log(`Error cargando datos ${e}`);
    }
  },
  save: async(req, res)=>{
    const { _id, nombre, precio, cantidad, img, stock, descripcion, codigo, descuento } = req.body;
    const new_cart = {productos: { _id, nombre, precio, cantidad, img, stock, descripcion, codigo, descuento }};
    try{
      const cart = await cartModel.save(new_cart) 
      
      res.status(201).send(`Nuevo carrito ${cart.id} con productos: ${JSON.stringify(cart.productos)}`)
    }catch(e){
      res.status(400).send("Error creando nuevo carrito");
      console.log(`Error creando nuevo carrito: ${e}`);
    }
  },
  get: async (req, res)=>{
    const { oBy, s } = req.query;
    try{
      const allCarts = await cartModel.getAll(oBy, s);
      res.status(200).send(allCarts);
      console.log(`Carritos registrados: ${allCarts.length}`);
    }catch(e){
      res.status(400).send("Error obteniendo carritos");
      console.log(`Error en get All carts ${e}`);
    }
  },
  getById: async(req, res)=>{
    const {id} = req.params
    try{
      const carrito =  await cartModel.getById(id)
      res.status(200).send(carrito);
    }catch(e){
      res.status(400).send("Error encontrando carrito por Id");
      console.log(`Error obteniendo carrito por Id: ${e}`);
    }
  },
  deleteAll: async(req, res)=>{
    try{
      const borrado = await cartModel.deleteAll();
      res.status(200).send(`No. carritos borrados: ${borrado.deletedCount}`);
      console.log(`Carritos borrados ${borrado}`);
    } catch (e) {
      res.status(400).send("Error borrando carritos");
      console.log(`Error borrando carritos: ${e}`);
    }
  },
  deleteById: async(req, res)=>{
    const {id} = req.params
    try{
      const borrado = await cartModel.deleteById(id);
      if(borrado.deletedCount){
        res.status(200).send(`Un carrito borrado`);
      }else{
        res.status(500).send('No existe carrito con ese ID')
      }
      console.log(`Un carrito borrado: ${JSON.stringify(borrado)}`)
    } catch (e) {
      res.status(400).send("Error borrando carrito");
      console.log(`Error borrando carrito: ${e}`);
    }
  },
  getProductsByIdCart: async(req, res)=>{
    const {id} = req.params
    try{
      const productos = await cartModel.getProductsByIdCart(id)

      if(productos.length){
        res.status(200).send(`Carrito con Id: ${id} tiene los productos: ${JSON.stringify(productos)} `)
      }else{
        res.send(`El carrito con Id: ${id} no tiene productos`)
      }
      console.log('Obteniendo productos por id del carrito')
    }catch(e){
       console.log(`Error buscando productos del carrito ${id}: ${e}`)
    }
  },
  deleteProductById: async(req, res)=>{
    const {id, id_prod} = req.params
    try{
      const product = await cartModel.deleteProductById(id, id_prod)
      console.log(`Borrando producto: ${JSON.stringify(product)}`)
      res.status(200).send(`Producto borrado id:${id_prod} del carrito ${id}`)
      console.log('Borrando producto por id')
    }catch(e){
      console.log(`Error al borrar producto por Id ${e}`)
    }
  },
  saveProdByIdCart: async(req, res)=>{
    const {id} = req.params
    const { _id, nombre, precio, img, cantidad, stock, descripcion, codigo, descuento } = req.body;
    const new_product = { _id, nombre, cantidad, precio, img, stock, descripcion, codigo, descuento };
    try{
      const productos = await cartModel.saveProdByIdCart(id, new_product)
      res.status(201).send(`Se añadió al carrito ${id}, el producto ${nombre}`)
      console.log('Guardando nuuevo producto por id Cart')
    }catch(e){
      console.log(`Error en save product by id Cart: ${e}`)
    }
  }
}
