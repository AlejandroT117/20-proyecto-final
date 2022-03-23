const moment = require("moment");
const fs = require("fs").promises;

class ContenedorCart {
  constructor() {

  }

  async create() {
    try {
      let last_id = 0;
      const raw = await fs.readFile(this.filename, "utf-8");
      const data = JSON.parse(raw);

      if (data) {
        for (let i = 0; i < data.length; i++) {
          const producto = data[i];
          last_id = producto.id;
        }
      }

      this.next_id = last_id + 1;

      data.push({
        id: this.next_id,
        timestamp: moment().format("DD:mm:yy HH:mm:ss"),
        productos: [],
      });
      await fs.writeFile(this.filename, JSON.stringify(data, null, 2), "utf-8");

      return this.next_id;
    } catch (e) {
      console.log(e);
    }
  }

  async save(new_object) {
    try {
      let last_id = 0;
      const raw = await fs.readFile(this.filename, "utf-8");
      const data = JSON.parse(raw);

      if (data) {
        for (let i = 0; i < data.length; i++) {
          const producto = data[i];
          last_id = producto.id;
        }
      }

      this.next_id = last_id + 1;

      new_object.id = this.next_id;

      data.push({
        id: new_object.id,
        nombre: new_object.nombre,
        precio: new_object.precio,
        img: new_object.img,
        stock: new_object.stock,
        timestamp: moment().format("DD:mm:yy HH:mm:ss"),
        descripcion: new_object.descripcion,
        código: new_object.código,
      });

      await fs.writeFile(this.filename, JSON.stringify(data, null, 2), "utf-8");

      return new_object;
    } catch (e) {
      console.log(e);
    }
  }

  async getById(id) {
    try {
      const raw = await fs.readFile(this.filename, "utf-8");
      const data = JSON.parse(raw);

      const obj = data.find((obj) => obj.id === id);

      if (!obj) {
        return null;
      }

      return obj;
    } catch (e) {
      console.log(e);
    }
  }

  async getProductsByIdCart(id){
    try {
      const raw = await fs.readFile(this.filename, "utf-8");
      const data = JSON.parse(raw);

      const obj = data.find((obj) => obj.id === id);

      if (!obj) {
        return null;
      }

      return obj.productos;
    } catch (e) {
      console.log(e);
    }
  }

  async saveProdByIdCart(id, new_object) {
    try {
      const raw = await fs.readFile(this.filename, "utf-8");
      const data = JSON.parse(raw);

      const obj = data.find((obj) => obj.id === id);

      if (!obj) {
        return null;
      }
      
      data.map((cart) => {
        
        if (cart.id === id) {
          let last_id = 0;
          for (let i = 0; i < cart.productos.length; i++) {
            const producto = cart.productos[i];
            last_id = producto.id;
          }
          const id_product = last_id? last_id+1: 1

          cart.productos.push({
            id: id_product,
            nombre: new_object.nombre,
            precio: new_object.precio,
            img: new_object.img,
            stock: new_object.stock,
            timestamp: moment().format("DD:mm:yy HH:mm:ss"),
            descripcion: new_object.descripcion,
            código: new_object.código,
          })

          return cart;
        }
      });

      await fs.writeFile(this.filename, JSON.stringify(data, null, 2), "utf-8");

      return new_object;

    } catch (e) {
      console.log(e);
    }
  }

  async getAll() {
    try {
      const raw = await fs.readFile(this.filename, "utf-8");
      const data = JSON.parse(raw);

      return data;
    } catch (e) {
      console.log(e);
    }
  }

  async deleteById(id) {
    try {
      const raw = await fs.readFile(this.filename, "utf-8");
      const data = JSON.parse(raw);

      const filtered_data = data.filter((obj) => obj.id !== id);

      await fs.writeFile(
        this.filename,
        JSON.stringify(filtered_data, null, 2),
        "utf-8"
      );
    } catch (e) {
      console.log(e);
    }
  }
  

  async deleteProductById(id, idProduct) {
    try {
      const raw = await fs.readFile(this.filename, "utf-8");
      const data = JSON.parse(raw);

      const selectedCart = data.find((obj) => obj.id === id);

      const filtered_data = selectedCart.productos.filter((obj) => obj.id !== idProduct);

      selectedCart.productos = filtered_data

      const unselectedCart = data.find((obj) => obj.id !== id);

      /* Líneas confusas, corregir */
      const filedata = unselectedCart? [selectedCart, unselectedCart]: [selectedCart]

      await fs.writeFile(
        this.filename,
        JSON.stringify(filedata, null, 2),
        "utf-8"
      );
    } catch (e) {
      console.log(e);
    }
  }

  async deleteAll() {
    try {
      await fs.writeFile(this.filename, JSON.stringify([], null, 2), "utf-8");
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = ContenedorCart;
