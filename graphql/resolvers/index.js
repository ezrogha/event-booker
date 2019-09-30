const bcrypt = require('bcrypt');
const User = require('../../models/User');
const Booking = require('../../models/Booking');
const Event = require('../../models/Event');

const spreadEvent = async eventIds => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map(event => {
      return { ...event };
    });
  } catch (err) {
    throw err;
  }
};

const spreadSingleEvent = async eventId => {
  try {
    const event = await Event.findById(eventId);
    return {
      ...event._doc
    };
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

module.exports = {
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
  },
  createBooking: async args => {
    const creatorId = '5d88e8a614cb2178fa2690fd';
    try {
      const bookingExists = await Booking.find({
        event: args.eventId,
        user: creatorId
      });
      console.log(bookingExists);
      if (bookingExists.length > 0) {
        throw new Error('This event has already been booked by this user');
      }
      const newBooking = new Booking({
        event: args.eventId,
        user: creatorId
      });
      const result = await newBooking.save();
      return {
        ...result._doc,
        user: spreadCreator.bind(this, creatorId),
        event: spreadSingleEvent.bind(this, args.eventId)
      };
    } catch (err) {
      throw err;
    }
  },
  cancelBooking: async args => {
    try {
      const booking = await Booking.findById(args.bookingId).populate('event');
      if(!booking) {
          throw new Error("This event has already been deleted");
      }
      const event = {
        ...booking.event._doc
      };
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (err) {
      throw err;
    }
  }
};
