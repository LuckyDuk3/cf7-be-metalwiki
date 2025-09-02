const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bandSchema = new Schema({
  name: {
    type: String,
    required: [true, "Band name is required"],
    trim: true,
    unique: true
  },
  genre: {
    type: String,
    required: [true, "Genre is required"]
  },
  country: {
    type: String,
    required: [true, "Country is required"]
  },
  formationYear: {
    type: Number,
    required: [true, "Formation year is required"]
  },
  members: {
    type: [String],
    default: []
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, {
  collection: "bands",
  timestamps: true
});

module.exports = mongoose.model("Band", bandSchema);
