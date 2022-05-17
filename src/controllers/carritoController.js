const cartModel = require("../models/carts");
const logger = require("../log");

module.exports = {
  loadData: async (req, res) => {
    try {
      const carritos = await cartModel.loadData("../database/carritos.json");
      res.status(200).send(`No. carritos registrados: ${carritos}`);
      logger.log(`Carritos cargados desde json ${carritos}`);
    } catch (e) {
      res.status(400).send("Error cargando datos");
      logger.error(`Error cargando datos ${e}`);
    }
  },
  save: async (req, res) => {
    const {
      userId,
      _id,
      nombre,
      precio,
      cantidad,
      img,
      stock,
      descripcion,
      codigo,
      descuento,
    } = req.body;
    const new_cart = {
      userId,
      productos: {
        _id,
        nombre,
        precio,
        cantidad,
        img,
        stock,
        descripcion,
        codigo,
        descuento,
      },
    };
    try {
      const cart = await cartModel.save(new_cart);

      res
        .status(201)
        .send(
          `Nuevo carrito ${cart.id} con productos: ${JSON.stringify(
            cart.productos
          )}`
        );
    } catch (e) {
      res.status(400).send("Error creando nuevo carrito");
      logger.error(`Error creando nuevo carrito: ${e}`);
    }
  },
  get: async (req, res) => {
    const { oBy, s } = req.query;
    try {
      const allCarts = await cartModel.getAll(oBy, s);
      res.status(200).send(allCarts);
      logger.log(`Carritos registrados: ${allCarts.length}`);
    } catch (e) {
      res.status(400).send("Error obteniendo carritos");
      logger.error(`Error en get All carts ${e}`);
    }
  },
  getByUserId: async (req, res) => {
    const { id } = req.params;
    try {
      const carrito = await cartModel.getByUserId(id);
      res.status(200).send(carrito);
    } catch (e) {
      res.status(400).send("Error encontrando carrito por Id");
      logger.error(`Error obteniendo carrito por Id: ${e}`);
    }
  },
  getById: async (req, res) => {
    const { id } = req.params;
    try {
      const carrito = await cartModel.getById(id);
      res.status(200).send(carrito);
    } catch (e) {
      res.status(400).send("Error encontrando carrito por Id");
      logger.error(`Error obteniendo carrito por Id: ${e}`);
    }
  },
  deleteAll: async (req, res) => {
    try {
      const borrado = await cartModel.deleteAll();
      res.status(200).send(`No. carritos borrados: ${borrado.deletedCount}`);
      logger.warn(`Carritos borrados ${borrado}`);
    } catch (e) {
      res.status(400).send("Error borrando carritos");
      logger.error(`Error borrando carritos: ${e}`);
    }
  },
  deleteById: async (req, res) => {
    const { id } = req.params;
    try {
      const borrado = await cartModel.deleteById(id);
      if (borrado.deletedCount) {
        res.status(200).send(`Un carrito borrado`);
      } else {
        res.status(500).send("No existe carrito con ese ID");
      }
      logger.warn(`Un carrito borrado: ${JSON.stringify(borrado)}`);
    } catch (e) {
      res.status(400).send("Error borrando carrito");
      logger.error(`Error borrando carrito: ${e}`);
    }
  },
  getProductsByIdCart: async (req, res) => {
    const { id } = req.params;
    try {
      const productos = await cartModel.getProductsByIdCart(id);

      if (productos.length) {
        res
          .status(200)
          .send(
            `Carrito con Id: ${id} tiene los productos: ${JSON.stringify(
              productos
            )} `
          );
      } else {
        res.send(`El carrito con Id: ${id} no tiene productos`);
      }
      logger.log("Obteniendo productos por id del carrito");
    } catch (e) {
      logger.error(`Error buscando productos del carrito ${id}: ${e}`);
    }
  },
  deleteProductById: async (req, res) => {
    const { id, id_prod } = req.params;
    try {
      const product = await cartModel.deleteProductById(id, id_prod);
      logger.warn(`Borrando producto: ${JSON.stringify(product)}`);
      res.status(200).send(`Producto borrado id:${id_prod} del carrito ${id}`);
    } catch (e) {
      logger.error(`Error al borrar producto por Id ${e}`);
    }
  },
  saveProdByIdCart: async (req, res) => {
    const { id } = req.params;
    const {
      _id,
      nombre,
      precio,
      img,
      cantidad,
      stock,
      descripcion,
      codigo,
      descuento,
    } = req.body;
    const new_product = {
      _id,
      nombre,
      cantidad,
      precio,
      img,
      stock,
      descripcion,
      codigo,
      descuento,
    };
    try {
      const productos = await cartModel.saveProdByIdCart(id, new_product);
      if(productos){
        res.status(201).send(`Se añadió al carrito ${id}, el producto ${nombre}`);
      }else{
        res.status(201).send(`En el carrito ${id}, ya se encuentra el producto ${nombre}`);
      }
      logger.log(`Se añadió al carrito ${id}, el producto ${nombre}`);
    } catch (e) {
      logger.error(`Error en save product by id Cart: ${e}`);
    }
  },
};
