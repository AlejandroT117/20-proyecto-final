const prodModelFb = require('../models/productsFirebase')


module.exports = {
  loadData: async (req, res) => {
    try {
      const productos = await prodModelFb.loadData("../database/data.json");

      res.status(200).send(`No. productos registrados: ${productos}`);
      console.log(`Productos cargados desde json ${productos}`);
    } catch (e) {
      res.status(400).send("Error cargando datos");
      console.log(`Error cargando datos ${e}`);
    }
  },
  get: async (req, res) => {
    const { oBy, s } = req.query;
    try {
      const allProducts = await prodModelFb.getAll(oBy, s);
      res.status(200).send(allProducts);
    } catch (e) {
      res.status(400).send("Error obteniendo productos");
      console.log(`Error en get All Products ${e}`);
    }
  },
  getById: async (req, res) => {
    const { id } = req.params;
    try {
      const producto = await prodModelFb.getById(id);
      res.status(200).send(producto);
      console.log(`Producto encontrado por Id: ${JSON.stringify(producto)}`)
    } catch (e) {
      res.status(400).send("Error encontrando producto por Id");
      console.log(`Error obteniendo producto por Id: ${e}`);
    }
  },
  save: async (req, res) => {
    const { nombre, precio, img, stock, descripcion, codigo, descuento } = req.body;
    const new_product = { nombre, precio, img, stock, descripcion, codigo, descuento };
    try {
      const product = await prodModelFb.save(new_product);
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
      console.log(`Error creando nuevo producto: ${e}`);
    }
  },
  editById: async (req, res) => {
    const { id } = req.params;
    const { nombre, precio, img, stock, descripcion, codigo, descuento } = req.body;
    const new_product = { nombre, precio, img, stock, descripcion, codigo, descuento};
    try {
      const producto = await prodModelFb.editById(id, new_product);
      res.status(200).send(producto);
      console.log(`Producto encontrado por ID: ${JSON.stringify(producto)}`)
    } catch (e) {
      res.status(400).send("Error editando producto");
      console.log(`Error editando producto: ${e}`);
    }
  },
  deleteById: async (req, res) => {
    const { id } = req.params;
    try {
      const borrado = await prodModelFb.deleteById(id);
      res.status(200).send(`Un producto borrado`);
      console.log(`Un producto borrado: ${JSON.stringify(borrado)}`)
    } catch (e) {
      res.status(400).send("Error borrando producto");
      console.log(`Error borrando producto: ${e}`);
    }
  },
  deleteAll: async (req, res) => {
    try {
      const borrado = await prodModelFb.deleteAll();
      res.status(200).send(borrado);
      console.log(`Productos borrados ${JSON.stringify(borrado)}`);
    } catch (e) {
      res.status(400).send("Error borrando productos");
      console.log(`Error borrando productos: ${e}`);
    }
  }
};
