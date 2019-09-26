const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  type Booking {
		event: Event!
		user: User!
		createdAt: String!
		updatedAt: String!
	}
	type User {
		_id: ID
		email: String!
		password: String!
		createdEvents: [Events!]!
	}
	type Event {
		_id: ID
		title: String!
		description: String!
		date: String!
		duration: Int!
		Creator: [User!]!
	}
	input EventInput {
		title: String!
		description: String!
		date: String!
		duration: Int!
	}
	input UserInput {
		email: String!
		password: String!
	}
	type RootQuery {
		events: [Event!]!
		bookings: [Booking!]!
	}
	type RootMutation {
		createEvent(eventInput: EventInput): Event!
		createUser(userInput: UserInput): User!
		createBooking(eventId: String!): Booking!
	}
	schema {
		query: RootQuery
		mutation: RootMutation
	} 
`);
