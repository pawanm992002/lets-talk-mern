const User = require("../models/userModel");
const generateToken = require("../config/genrateToken");

const registerUser = async (req, res) => {
  const { name, email, password, picture } = req.body;
  if (!name || !email || !password) {
    return res.json({ status: false, msg: "please enter all fields" });
  }
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.json({ status: false, msg: "user already exists" });
    }
    const user = await User.create({ name, email, password, picture });
    if (user) {
      const sentUser = {
        name: user.name,
        email: user.email,
        picture: user.picture,
        _id: user._id,
        token: generateToken(user._id),
        // isAdmin: user.isAdmin,
      };
      return res.json({
        status: true,
        msg: "user created successfully",
        sentUser,
      });
    } else {
      return res.json({ status: false, msg: "user not created" });
    }
  } catch (error) {
    return res.json({ status: false, msg: "something went wrong" });
  }
};

const authUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ status: false, msg: "please enter all fields" });
  }
  try {
    const user = await User.findOne({ email });
    const sentUser = {
      name: user.name,
      email: user.email,
      picture: user.picture,
      _id: user._id,
      token: generateToken(user._id),
      isAdmin: user.isAdmin,
    };
    if (user && (await user.matchPassword(password))) {
      return res.json({ status: true, msg: "login successfull", sentUser });
    } else {
      return res.json({ status: false, msg: "invalid email or password" });
    }
  } catch (error) {
    return res.json({ status: false, msg: "something went wrong" });
  }
};

// /api/user?search=pawan
const allUsers = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
};

module.exports = { registerUser, authUser, allUsers };
