const Event = require('../../models/Event');
const User = require('../../models/User');

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
    let createdEvent = {}
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
      console.log(err);
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
};
