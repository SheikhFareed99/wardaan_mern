/**
 * One-time admin seeder.
 * Usage: node seedAdmin.js
 *
 * Reads ADMIN_EMAIL and ADMIN_PASSWORD from .env and creates (or updates)
 * the admin document in MongoDB with a bcrypt-hashed password.
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Admin = require("./models/adminModel");

dotenv.config();

const { MONGO_URI, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

if (!MONGO_URI) {
  console.error("Error: MONGO_URI is not set in .env");
  process.exit(1);
}

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error(
    "Error: ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env before running this script."
  );
  process.exit(1);
}

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");

  try {
    const existing = await Admin.findOne({ email: ADMIN_EMAIL });

    if (existing) {
      existing.password = ADMIN_PASSWORD; // pre-save hook will bcrypt-hash this
      await existing.save();
      console.log(`Admin password updated for: ${ADMIN_EMAIL}`);
    } else {
      await Admin.create({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
      console.log(`Admin account created for: ${ADMIN_EMAIL}`);
    }
  } finally {
    await mongoose.disconnect();
    console.log("Done.");
  }
}

seed().catch((err) => {
  console.error("Failed to seed admin account:", err);
  process.exit(1);
});
