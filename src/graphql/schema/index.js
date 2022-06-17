const { buildSchema } = require("graphql");

const schema = `
  type Product {
    id: String
    nombre: String
    descripcion: String
    descuento: Int
    codigo: String
    img: String
    precio: Int
    stock: Int
  }

  input ProductInput{
    nombre: String
    descripcion: String
    descuento: Int
    codigo: String
    img: String
    precio: Int
    stock: Int
  }

  type Query{
    getAllProducts(price: Int): [Product]
  }

  type Mutation{
    createProduct(data: ProductInput): Product
  }
`

module.exports = buildSchema(schema)