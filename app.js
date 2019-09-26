const express = require('express');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const app = express();

app.use(
  '/eb_graphql',
  graphqlHttp({
    schema: null,
    rootValue: {},
    graphiql: true
  })
);

app.listen(3000);
