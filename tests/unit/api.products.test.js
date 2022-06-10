const supertest = require('supertest')
const logger = require("../../src/log");
const expect = require('chai').expect
const yargs = require("../../src/config/yargs");
const { new_product } = require("../util");

const PORT = process.env.PORT || yargs().port;
const API_URL = `http://localhost:${PORT}`;

describe("API products", ()=>{
  const agent = supertest(API_URL)

  it("should retrieve all products", async ()=>{
    const response = await agent.get("/api/productos/all")

    expect(response.status).to.equal(200)
  })

  it("should create a new fake product", async ()=>{
    const response = await agent.post("/api/productos").send(new_product)
    
    logger.log(response.text)

    expect(response.status).to.equal(201)
  })
})
