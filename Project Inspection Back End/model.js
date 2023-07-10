const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  managerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Manager",
    required: true,
  },
  commentMessage: {
    type: String,
    required: true,
  },
});

const feedbackSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GroupName",
    required: true,
  },
  feedbackType: {
    type: String,
    enum: ["Good", "Bad", "Ideas", "Actions", "Kudos"],
    required: true,
  },
  feedbackMessage: {
    type: String,
    required: true,
  },
  comments: [commentSchema],
});

const groupSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  name: {
    type: String,
    required: true,
  },
});

const Feedback = mongoose.model("Feedback", feedbackSchema);
const GroupName = mongoose.model("GroupName", groupSchema);
const Comment = mongoose.model("Comment", commentSchema);

module.exports = { Feedback, GroupName, Comment };
