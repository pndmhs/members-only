const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: { type: String, required: true, minLength: 3, maxLength: 100 },
  text: { type: String, required: true, minLength: 1 },
  timestamp: { type: Date, default: Date.now },
  user: { type: Schema.ObjectId, ref: "User" },
});

MessageSchema.virtual("timestamp_formatted").get(function () {
  return DateTime.fromJSDate(this.timestamp).toLocaleString(
    DateTime.DATETIME_MED
  );
});

MessageSchema.virtual("url").get(function () {
  return "/message/" + this._id;
});

module.exports = mongoose.model("Message", MessageSchema);
