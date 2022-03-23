const mongoose = require('mongoose')
const fs = require("fs").promises;
const path = require('path')

class ContenedorCart {
  constructor() {
    const schema = new mongoose.Schema(
      {
        productos: [mongoose.Types.Mixed]
      },
      {timestamps: true})
      //modelo: representaciön en js
      this.model = mongoose.model('cart', schema)
  }

  async loadData(filename){
    try {
      const raw = await fs.readFile(path.join(__dirname, filename), "utf-8");
      const carritos = JSON.parse(raw);
      let i=0
      for(const c of carritos){
        console.log(c)
        await this.model.create(c)
        i++
      }

      console.log('data cargada en db')
      return i
    } catch (e) {
      console.log(e);
    }
  }

  async save(new_object) {
    try {
      const carrito = await this.model.create(new_object)
      console.log('-----')
      console.log(JSON.stringify(carrito, null, 2))

      return carrito
    } catch (e) {
      console.log(`Error creando carrito ${e}`);
    }
  }

  async getById(id) {
    try {
      const carrito = await this.model.find({_id:id})
      if (!carrito) {
        return null;
      }

      return carrito[0];
    } catch (e) {
      console.log(`Error en get by id: ${e}`)
    }
  }

  async getProductsByIdCart(id){
    try {
      const carrito = await this.model.find({_id:id})
      if (!carrito) {
        return null;
      }

      return carrito[0].productos;
    } catch (e) {
      console.log(`Error en get productos by id: ${e}`)
    }
  }

  async saveProdByIdCart(id, new_product) {
    try {
      const carrito = await this.model.updateOne(
        {_id:id},
        {$push: {productos: new_product}}
      )

      return carrito
    } catch (e) {
      console.log(e);
    }
  }

  async getAll(orderBy='', search='') {
    try{
      let carritos = []
      let find = search ? {nombre: {$regex: search, $options:'i'}}: {}
      if(orderBy){
        const SORT = {}
        SORT[orderBy]=1
        carritos = await this.model.find(find).sort(SORT)
      }else{
        carritos = await this.model.find(find)
      }
      console.log(`No. de productos: ${carritos.length}`)
      
      return carritos.map((p)=>{
        return {
          id: p['_id'],
          productos: p.productos,
        }
      })
    } catch (e) {
      console.log(`Error en get all ${e}`)
    }
  }

  async deleteById(id) {
    try {
      const borrado = await this.model.deleteOne({_id: id})
      return borrado
    } catch (e) {
      console.log(`Error en borrado por id ${e}`)
    }
  }
  

  async deleteProductById(id, idProduct) {
    try {
      const borrado = await this.model.deleteOne({_id: id, "productos._id":idProduct})

      return borrado
    } catch (e) {
      console.log(e);
    }
  }

  async deleteAll() {
    try {
      const carrito = await this.model.deleteMany({})
      return carrito
    } catch (e) {
      console.log(`Error borrando todos los carritos ${e}`)
    }
  }
}

module.exports = ContenedorCart;
