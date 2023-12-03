const User = require("../models/userModel.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); 

const setUser = async (req, res) => {
  const user = req.body;
  user.email = user.email.toLowerCase();
  user.password = await bcrypt.hash(user.password, 10);
  const newUser = new User(user);
  try {
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
}

const getUserTokenByLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const lowerCaseEmail = email.toLowerCase();
    const user = await User.findOne({ email: lowerCaseEmail });
    let token = null;
    if (await bcrypt.compare(password, user.password)) {
      token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.status(200).json(token);
    }
    else {
      res.status(200).json(null);
    }
    
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}


const getUserByJWTToken = async (req, res) => {
  try {
    const { JWTToken } = req.body;
    jwt.verify(JWTToken, process.env.JWT_SECRET)
    const userID = jwt.decode(JWTToken);
    const user = await User.findOne({ _id: userID.id });
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  } 
}

const getUserByID = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  } 
}

// not completed
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

module.exports = { setUser, getUserTokenByLogin, getUserByJWTToken, getUserByID, getUserFriends };
