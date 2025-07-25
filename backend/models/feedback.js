const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({

  name: { type: String, required: true },
  review: { type: String },
  star: { type: Number },
  status:{type:bool}
});

module.exports = mongoose.model("Feedback", FeedbackSchema);