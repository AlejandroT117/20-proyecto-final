const mongoose = require("mongoose");
const fs = require("fs").promises;
const path = require("path");
const logger = require("../log");

class ContenedorCart {
  constructor() {
    const schema = new mongoose.Schema(
      {
        userId: String,
        productos: [
          {
            _id: mongoose.Types.ObjectId,
            nombre: String,
            descripcion: String,
            codigo: String,
            descuento: Number,
            img: String,
            precio: Number,
            cantidad: Number,
          },
        ],
      },
      { timestamps: true }
    );
    //modelo: representaciön en js
    this.model = mongoose.model("cart", schema);
  }

  async loadData(filename) {
    try {
      const raw = await fs.readFile(path.join(__dirname, filename), "utf-8");
      const carritos = JSON.parse(raw);
      let i = 0;
      for (const c of carritos) {
        this.save(c);
        i++;
      }

      logger.log("data cargada en db");
      return i;
    } catch (e) {
      logger.log(e);
    }
  }

  async save(new_object) {
    try {
      if (!new_object.productos.cantidad) {
        new_object.productos.cantidad = 1;
      }
      const carrito = await this.model.create(new_object);
      logger.log("-----");
      logger.log(JSON.stringify(carrito, null, 2));

      return carrito;
    } catch (e) {
      logger.log(`Error creando carrito ${e}`);
    }
  }

  async getAll(orderBy = "", search = "") {
    try {
      let carritos = [];
      let find = search
        ? { "productos.nombre": { $regex: search, $options: "i" } }
        : {};
      if (orderBy) {
        const SORT = {};
        SORT[orderBy] = 1;
        carritos = await this.model.find(find).sort(SORT);
      } else {
        carritos = await this.model.find(find);
      }

      return carritos.map((p) => {
        return {
          id: p["_id"],
          productos: p.productos,
        };
      });
    } catch (e) {
      logger.log(`Error en get all ${e}`);
    }
  }
  async isInCart(idCart, new_product) {
    try {
      const inCart = await this.model.find(
        { userId: idCart },
        {
          productos: {
            $elemMatch: { _id: new_product.id },
          },
        }
      );
      logger.log(`Is in cart ${inCart.productos}`);
      if (inCart.productos) {
        return true;
      }
      return false;
    } catch (e) {
      logger.error(`Error en Is in Cart`);
    }
  }

  async getByUserId(id) {
    try {
      const carrito = await this.model.findOne({ userId: id });
      if (!carrito) {
        return this.createVoidCart(id);
      }
      return carrito;
    } catch (e) {
      logger.log(`Error en get by id: ${e}`);
    }
  }
  async createVoidCart(id) {
    try {
      const new_cart = { userId: id };
      const carrito = await this.model.create(new_cart);
      logger.log(`Carrito creado`);
      return carrito;
    } catch (e) {
      logger.error(`Cart not created`);
    }
  }
  async getById(id) {
    try {
      const carrito = await this.model.findOne({ _id: id });
      if (!carrito) {
        return null;
      }
      return carrito;
    } catch (e) {
      logger.log(`Error en get by id: ${e}`);
    }
  }
  async deleteAll() {
    try {
      const carrito = await this.model.deleteMany({});
      return carrito;
    } catch (e) {
      logger.log(`Error borrando todos los carritos ${e}`);
    }
  }

  async deleteById(id) {
    try {
      const borrado = await this.model.deleteOne({ _id: id });
      return borrado;
    } catch (e) {
      logger.log(`Error en borrado por id ${e}`);
    }
  }

  async deleteByUserId(id) {
    try {
      const borrado = await this.model.deleteOne({ userId: id });
      return borrado;
    } catch (e) {
      logger.log(`Error en borrado por id ${e}`);
    }
  }
  async getProductsByIdCart(id) {
    try {
      const carrito = await this.model.findOne({ _id: id });
      if (!carrito) {
        return null;
      }

      return carrito.productos;
    } catch (e) {
      logger.log(`Error en get productos by id: ${e}`);
    }
  }

  async saveProdByIdCart(id, new_product) {
    try {
      const isInCart = await this.isInCart(id, new_product);
      if(isInCart){
        return //update quantity
      }
      if (!new_product.cantidad) {
        new_product.cantidad = 1;
      }
      const carrito = await this.model.updateOne(
        { userId: id },
        { $push: { productos: new_product } }
      );

      return carrito;
    } catch (e) {
      logger.log(e);
    }
  }

  async deleteProductById(id, idProduct) {
    try {
      const borrado = await this.model.updateMany(
        { id: id },
        { $pull: { productos: { _id: idProduct } } }
      );
      return borrado;
    } catch (e) {
      logger.log(`Rrror borrando producto por id ${e}`);
    }
  }
}

module.exports = new ContenedorCart();
