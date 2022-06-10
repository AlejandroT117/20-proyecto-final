const assert = require('assert').strict
const logger = require("../../src/log");
const mongoose = require('mongoose')
const productModel = require("../../src/models/products.model.")

describe('Admin Service', () => {

  before(async () => {
    console.log('connecting to mongo')
    await mongoose.connect('mongodb://localhost:27017/ecommerce')
  })

  after(() => {
    mongoose.disconnect()
  })

  it('should connect to the db', () => {
    assert.strictEqual(mongoose.connection.readyState, 1)
  })

  it('should retrieve number of products', async () => {
    const stats = await productModel.count()

    logger.log(`Number of products ${stats}`)

    assert.strictEqual(stats > 0, true)
  })
})