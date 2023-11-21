const User = require("../models/userModel.js");

const setUser = async (req, res) => {
  const user = req.body;
  const newUser = new User(user);
  try {
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
}

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const users = await User.findById(id);
    res.status(200).json(users);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    res.status(200).json(friends);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

module.exports = { setUser, getUser, getUserFriends };
