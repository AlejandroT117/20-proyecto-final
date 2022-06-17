const { graphqlHTTP } = require("express-graphql");
const products = require("./resolvers/products");
const schema = require("./schema");

module.exports = function (app) {
  app.use(
    "/graphql",
    graphqlHTTP({
      schema,
      rootValue: products,
      graphiql: true,
    })
  );
};
