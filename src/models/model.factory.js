const userModel = require('./user.model.')
const cartModel = require('./carts.model')
const pedidoModel = require('./pedidos.model')
const productosModel = require('./pedidos.model')

class ModelFactory{
  static getModel(modelName){
    switch (modelName) {
      case 'user':
        return userModel
      case 'cart':
        return cartModel
      case 'pedido':
        return pedidoModel
      case 'productos':
        return productosModel
      default:
        throw new Error('Model not found')
    }
  }
}

module.exports = ModelFactory