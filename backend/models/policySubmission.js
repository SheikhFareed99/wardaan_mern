const mongoose = require("mongoose");

const policySubmissionSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PolicySubmission", policySubmissionSchema);
