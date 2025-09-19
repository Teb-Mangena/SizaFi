import validator from "validator";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";

export const signupUser = async (req, res) => {
  const { fullname, email, password, role = "user" } = req.body;

  try {
    if (!fullname || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({ message: "Password is not strong enough" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    generateToken(newUser._id, res);

    res.status(201).json({
      _id: newUser._id,
      fullname: newUser.fullname,
      email: newUser.email,
      role: newUser.role,
    });
  } catch (error) {
    console.error("Error in signupUser:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // validate user input
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      profilePic: user.profilePic,
      role: user.role,
    });
  } catch (error) {
    console.log("Error in loginUser:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const logoutUser = (_, res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.status(200).json({ message: "Logged out successfully" });
};

// WORKERS DETAILS
export const getAllWorkers = async (req, res) => {
  try {
    // Define the worker roles you want to include
    const workerRoles = [
      "plumber",
      "electrician",
      "carpenter",
      "painter",
      "gardener",
      "cleaner",
    ];

    // Find all users whose role is in the workerRoles array
    const workers = await User.find({ role: { $in: workerRoles } }).select(
      "-password"
    ); 

    res.status(200).json(workers);
  } catch (error) {
    console.error("Error in getAllWorkers:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getWorkerById = async (req, res) => {
  try {
    const { id } = req.params;

    // Define allowed worker roles
    const workerRoles = [
      'plumber',
      'electrician',
      'carpenter',
      'painter',
      'gardener',
      'cleaner'
    ];

    // Find user by ID and ensure they are a worker
    const worker = await User.findOne({
      _id: id,
      role: { $in: workerRoles }
    }).select('-password'); // exclude password

    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    res.status(200).json(worker);
  } catch (error) {
    console.error("Error in getWorkerById:", error);
    res.status(500).json({ message: "Server error" });
  }
};

