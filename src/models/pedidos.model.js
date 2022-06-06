const mongoose = require("mongoose");
const moment = require("moment");
const fs = require("fs").promises;
const path = require("path");
const logger = require("../log");

class Pedido {
  constructor() {
    const schema = new mongoose.Schema({
      userId: String,
      total: { type: Number, default: 0 },
      created: { type: Date, default: Date.now },
      enviado: Boolean
    })

    this.model = mongoose.model("pedido", schema)
  }

  async save(obj) {
    const pedido = await this.model.create(obj)
    return {
      id: pedido._id.toString(),
      userId: pedido.userId,
      total: pedido.total,
      created: moment(pedido.created).format('DD-MM-YYYY HH:mm'),
      enviado: pedido.enviado ? 'Si' : 'No'
    }
  }
  
  async getByUser(id) {
    const pedido =  await this.model.findOne({ userId: id }).lean()
    
    if (!pedido) {
      return {}
    }

    return {
      id: pedido._id.toString(),
      userId: pedido.userId,
      total: pedido.total,
      created: moment(pedido.created).format('DD-MM-YYYY HH:mm'),
      enviado: pedido.enviado ? 'Si' : 'No'
    }
  }
}

module.exports = new Pedido()