const Booking = require('../../models/Booking');
const Event = require('../../models/Event');
const User = require('../../models/User');

const spreadSingleEvent = async eventId => {
  try {
    const event = await Event.findById(eventId);
    return {
      ...event._doc
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const spreadCreator = async creatorId => {
    try {
      const creator = await User.findById(creatorId);
      return { ...creator._doc };
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

module.exports = {
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
        console.log(err)
      throw err;
    }
  },
  cancelBooking: async args => {
    try {
      const booking = await Booking.findById(args.bookingId).populate('event');
      if (!booking) {
        throw new Error('This event has already been deleted');
      }
      const event = {
        ...booking.event._doc
      };
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
};
