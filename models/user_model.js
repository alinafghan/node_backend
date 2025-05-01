const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  id: { 
    type: String, 
    required: true 
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  firstName: {
    type: String,
    required: true, // First name of the user
  },
  businessName: {
    type: String,
    required: true, // Business name
  },
  businessType: {
    type: String,
    required: true, // Type of business (Retail, Consulting, etc.)
  },
  businessLogo: {
    type: String, // URL to the uploaded business logo
    required: true, 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash the password before saving it to the database
userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});

// Compare the given password with the hashed password in the database
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
