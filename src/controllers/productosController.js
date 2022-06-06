const ModelFactory = require('../models/model.factory');
const prodModel = ModelFactory.getModel('productos');
const logger = require('../log')

module.exports = {
  loadData: async (req, res) => {
    try {
      const productos = await prodModel.loadData("../database/data.json");
      res.status(200).send(`No. productos registrados: ${productos}`);
      logger.log(`Productos cargados desde json ${productos}`);
    } catch (e) {
      res.status(400).send("Error cargando datos");
      logger.error(`Error cargando datos ${e}`);
    }
  },
  get: async (req, res) => {
    const { oBy, s } = req.query;
    try {
      const allProducts = await prodModel.getAll(oBy, s);
      res.status(200).send(allProducts);
    } catch (e) {
      res.status(400).send("Error obteniendo productos");
      logger.error(`Error en get All Products ${e}`);
    }
  },
  getById: async (req, res) => {
    const { id } = req.params;
    logger.log(`Producto con Id: ${id}`)
    try {
      const producto = await prodModel.getById(id);
      res.status(200).send(producto);
    } catch (e) {
      res.status(400).send("Error encontrando producto por Id");
      logger.error(`Error obteniendo producto por Id: ${e}`);
    }
  },
  save: async (req, res) => {
    const { nombre, precio, img, stock, descripcion, codigo, descuento } = req.body;
    const new_product = { nombre, precio, img, stock, descripcion, codigo, descuento };
    try {
      const product = await prodModel.save(new_product);
      if (product.nombre) {
        res.status(201).send(`Nuevo producto: ${product.nombre}, código ${product.codigo}`);
      }
      if (product.errors) {
        res.status(400).send(JSON.stringify(product.errors.codigo.message));
      }
      if (product.code == 11000) {
        res.status(400).send(`No se permite codigo duplicado`);
      }
    } catch (e) {
      res.status(400).send("Error creando nuevo producto");
      logger.error(`Error creando nuevo producto: ${e}`);
    }
  },
  editById: async (req, res) => {
    const { id } = req.params;
    const { nombre, precio, img, stock, descripcion, codigo, descuento } = req.body;
    const new_product = { nombre, precio, img, stock, descripcion, codigo, descuento};
    try {
      const producto = await prodModel.editById(id, new_product);
      res.status(200).send({
        "Productos encontrados": producto.matchedCount,
        "Productos modificados": producto.modifiedCount,
      });
      logger.log(`Producto encontrado por ID: ${JSON.stringify(producto)}`)
    } catch (e) {
      res.status(400).send("Error editando producto");
      logger.error(`Error editando producto: ${e}`);
    }
  },
  deleteById: async (req, res) => {
    const { id } = req.params;
    try {
      const borrado = await prodModel.deleteById(id);
      res.status(200).send(`Un producto borrado`);
      logger.log(`Un producto borrado: ${borrado}`)
    } catch (e) {
      res.status(400).send("Error borrando producto");
      logger.error(`Error borrando producto: ${e}`);
    }
  },
  deleteAll: async (req, res) => {
    try {
      const borrado = await prodModel.deleteAll();
      res.status(200).send(`No. productos borrados: ${borrado.deletedCount}`);
      logger.log(`Productos borrados ${borrado}`);
    } catch (e) {
      res.status(400).send("Error borrando productos");
      logger.error(`Error borrando productos: ${e}`);
    }
  }
};
