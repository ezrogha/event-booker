const express = require('express');
const graphqlHttp = require('express-graphql');
const graphqlSchema = require('./graphql/schema');
const mongoose = require('mongoose');

const app = express();

app.use(
  '/eb_graphql',
  graphqlHttp({
    schema: graphqlSchema,
    rootValue: {
      events: () => {},
      createEvent: args => {
        return {
          ...args.name
        };
      }
    },
    graphiql: true
  })
);

const { DB_NAME, DB_USER, DB_PASSWORD } = process.env;

mongoose
  .connect(
    `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0-1rscx.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(3000);
  })
  .catch(err => {
    throw err;
  });
