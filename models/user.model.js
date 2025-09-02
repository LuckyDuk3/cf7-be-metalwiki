const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required field"],
      max: 20,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required field"],
      max: 100, 
    },
    name: {
      type: String,
      required: [true, "Name is required field"],
      max: 20,
    },
    surname: {
      type: String,
      required: [true, "Surname is required field"],
      max: 20,
    },
    email: {
      type: String,
      required: [true, "Email is required field"],
      max: 50,
      unique: true,
      trim: true,
      lowercase: true,
    },
    roles: {          
      type: [String],
      enum: ["user", "admin"],
      default: ["user"],
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
