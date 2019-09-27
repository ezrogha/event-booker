const express = require('express');
const graphqlHttp = require('express-graphql');
const graphqlSchema = require('./graphql/schema');
const mongoose = require('mongoose');
const User = require('./models/User');
const Event = require('./models/Event');
const Booking = require('./models/Booking');
const bcrypt = require('bcrypt');

const app = express();

const spreadEvent = async eventIds => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map(event => {
      return { ...event._doc };
    });
  } catch (err) {
    throw err;
  }
};

const spreadCreator = async creatorId => {
  try {
    const creator = await User.findById(creatorId);
    return { ...creator._doc };
  } catch (err) {
    throw err;
  }
};

app.use(
  '/eb_graphql',
  graphqlHttp({
    schema: graphqlSchema,
    rootValue: {
      createUser: async ({ userInput: { email, password } }) => {
        try {
          const userExists = await User.findOne({ email });
          if (userExists) {
            throw new Error('User already exists');
          }
          const hashedPassword = await bcrypt.hash(password, 12);
          const user = new User({
            email,
            password: hashedPassword
          });
          const result = await user.save();
          return {
            ...result._doc
          };
        } catch (err) {
          throw err;
        }
      },
      users: async () => {
        try {
          const users = await User.find();
          return users.map(user => {
            return {
              ...user._doc,
              createdEvents: spreadEvent.bind(this, user.createdEvents)
            };
          });
        } catch (err) {
          throw err;
        }
      },
      createEvent: async ({
        eventInput: { title, description, date, duration }
      }) => {
        const creatorId = '5d8d1302bbf8c62ae9ff6f32';
        const event = new Event({
          title,
          description,
          date,
          duration,
          creator: creatorId
        });
        try {
          const result = await event.save();
          createdEvent = {
            ...result._doc,
            date: new Date(result._doc.date).toISOString()
          };
          const user = await User.findById(creatorId);

          if (!user) {
            throw new Error('User not found');
          }
          user.createdEvents.push(event);
          await user.save();

          return createdEvent;
        } catch (err) {
          throw err;
        }
      },
      events: async () => {
        const events = await Event.find();
        return events.map(event => {
          return {
            ...event._doc,
            creator: spreadCreator.bind(this, event.creator)
          };
        });
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
