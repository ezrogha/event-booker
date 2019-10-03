const User = require('../../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
          ...user._doc
        };
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  login: async ({ email, password }) => {
		const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error('User doesnot exist');
		}
		
    const isPassCorrect = await bcrypt.compare(password, user.password);
    if (!isPassCorrect) {
      throw new Error('Password is Incorrect');
		}
		const userId = user.id;
    const token = await jwt.sign({ userId }, 'toughcode', {
      expiresIn: '1h'
    });
    return {
      userId,
      token,
      tokenExpiration: 1
    };
  }
};
