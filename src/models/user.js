const { Schema, model } = require("mongoose");
const moment = require("moment");
const bcrypt = require("bcrypt");

class UserModel {
  constructor() {
    const schema = new Schema({
      email: String,
      firstname: String,
      lastname: String,
      direccion: String,
      phone: String,
      password: String,
      rol: {type: String, default: 'cliente'},
      creado: String,
    });

    this.model = model("user", schema);
  }

  async save(obj) {
    obj.password = await bcrypt.hash(obj.password, 10);
    obj.creado = moment().format("H:mm:ss DD/MM/YYYY");
    return await this.model.create(obj);
  }

  async existsByEmail(email) {
    return this.model.exists({ email });
  }

  async getById(id) {
    return await this.model.findById(id);
  }

  // obtener un usuario por email
  async getByEmail(email) {
    const user = await this.model.findOne({ email });

    return {
      id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      name: `${user.firstname} ${user.lastname}`,
      email: user.email
    };
  }

  async getAll(orderBy = "", search = "") {
    try {
      console.log(`Getting users`);
      let find = search ? { email: { $regex: search, $options: "i" } } : {};
      let data = {};
      if (orderBy) {
        const SORT = {};
        SORT[orderBy] = 1;
        data = await this.model.find(find).sort(SORT);
      } else {
        data = await this.model.find(find);
      }

      return data;
    } catch (e) {
      console.log("Error al obtener datos");
      throw e;
    }
  }

  async isPasswordValid(email, pwd) {
    const user = await this.model.findOne({ email });

    return await bcrypt.compare(pwd, user.password);
  }
}

module.exports = new UserModel();
