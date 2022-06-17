const ModelFactory = require("../../models/model.factory");
const productModel = ModelFactory.getModel("productos");

module.exports = {
  createProduct: async ({ data }) => {
    return await productModel.save(data);
  },
  getAllProducts: async ({ price }) => {
    return await productModel.getAll();
  },
};
