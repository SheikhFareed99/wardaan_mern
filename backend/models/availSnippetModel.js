const mongoose = require("mongoose");

const availSnippetSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      default: "default",
      trim: true,
    },
    script: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AvailSnippet", availSnippetSchema);
