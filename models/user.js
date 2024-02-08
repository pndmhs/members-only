const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: { type: String, required: true, maxLength: 100 },
  lastName: { type: String, maxLength: 100 },
  username: { type: String, required: true },
  password: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ["guest", "member", "admin"],
    default: "guest",
  },
});

UserSchema.virtual("fullName").get(function () {
  return this.firstName + " " + this.lastName;
});

module.exports = mongoose.model("User", UserSchema);
