const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  type Booking {
		_id: ID
		event: Event!
		user: User!
		createdAt: String!
		updatedAt: String!
	}
	type User {
		_id: ID
		email: String!
		password: String!
		createdEvents: [Event!]!
	}
	type Event {
		_id: ID
		title: String!
		description: String!
		date: String!
		duration: Int!
		creator: User!
	}
	type AuthData {
		userId: ID!
		token: String!
		tokenExpiration: Int!
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
		users: [User!]!
		bookings: [Booking!]!
		login(email: String!, password: String!): AuthData!
	}
	type RootMutation {
		createEvent(eventInput: EventInput): Event!
		createUser(userInput: UserInput): User!
		createBooking(eventId: ID): Booking!
		cancelBooking(bookingId: ID): Event!
	}
	schema {
		query: RootQuery
		mutation: RootMutation
	} 
`);
