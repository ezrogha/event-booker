const userResolvers = require('../resolvers/users');
const eventResolvers = require('../resolvers/events');
const bookingResolvers = require('../resolvers/booking');

module.exports = {
  ...userResolvers,
  ...eventResolvers,
  ...bookingResolvers
};
