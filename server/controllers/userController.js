const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const knex = require("../config/database/connection");

exports.create = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Check if the user already exists
    const existingUser = await knex("users").where({ email }).first();
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const [userId] = await knex("users").insert({
      username,
      email,
      password: hashedPassword
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      userId
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred"
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await knex("users").where({ email }).first();
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_TIMEOUT_DURATION }
    );

    // Set the JWT in an HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000
    });

    return res.status(200).json({
      success: true,
      message: "Login successful"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred"
    });
  }
};

exports.logout = (req, res) => {
    res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  };

  exports.authenticateToken = (req, res, next) => {
  const token = req.cookies.token; // Extract token from cookies

  if (token == null)
    return res
      .status(401)
      .json({ success: false, message: "Token is required" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({ success: false, message: "Invalid token" });

    req.user = user; // Attach user info to request object
    next();
  });
};
 
