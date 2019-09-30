const User = require('../../models/User');
const bcrypt = require('bcrypt');
// const spreadEvent = async eventIds => {
//   try {
//     const events = await Event.find({ _id: { $in: eventIds } });
//     return events.map(event => {
//       return { ...event };
//     });
//   } catch (err) {
//     console.log(err);
//     throw err;
//   }
// };

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
      console.log(err);
      throw err;
    }
  },
  users: async () => {
    try {
      const users = await User.find().populate('createdEvents');
      return users.map(user => {
        return {
          ...user._doc,
        };
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
};
