const logger = require("../../src/log");
const axios = require("axios");
const yargs = require("../../src/config/yargs");
const { new_product } = require("../util");

const PORT = process.env.PORT || yargs().port;
const API_URL = `http://localhost:${PORT}`;

async function main() {
  const product = new_product;
  try {
    const response = await axios.post(API_URL, product);

    logger.log(`Status: ${response.status}`);

    const { data } = await axios.get(API_URL);

    logger.log(
      `Último producto guardado: ${
        data[data.length - 1].nombre
      } - Producto enviado: ${product.nombre}`
    );
  } catch (e) {
    logger.log(e);
  }
}

main();
