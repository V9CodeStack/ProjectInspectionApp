const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");
const mongoose = require("mongoose");
const { Feedback, GroupName, Comment } = require("../model");
const app = express();
const router = express.Router();
app.use(express.json());
app.use(cors());

// DB Configuration
mongoose
  .connect(
    "mongodb+srv://myprojects:9XFXIae28KxDbYMS@cluster0.udcqoee.mongodb.net/ProjectInspection?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB Connected..."))
  .catch((err) => console.log(err));

// Create a new group
router.post("/group", async (req, res) => {
  try {
    const group = new GroupName(req.body);
    await group.save();
    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ error: "Failed to create group" });
  }
});

// Get Group Name
router.get("/group/:groupId", async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const groupName = await GroupName.findById(groupId);
    res.status(200).json(groupName);
  } catch (err) {
    res.status(500).json({ error: "Invalid Group ID" });
  }
});

// Get feedback by group ID
router.get("/feedback/:groupId", async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const feedback = await Feedback.find({ groupId });
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch feedback" });
  }
});

// Create feedback for a group
router.post("/feedback/:groupId", async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const feedback = new Feedback({
      groupId,
      ...req.body,
    });
    await feedback.save();
    res.status(201).json(feedback);
  } catch (err) {
    res.status(500).json({ error: "Failed to save feedback" });
  }
});

// Create a comment on feedback
router.post("/comment/:feedbackId", async (req, res) => {
  try {
    const feedbackId = req.params.feedbackId;
    const comment = new Comment(req.body);
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      feedbackId,
      { $push: { comments: comment } },
      { new: true }
    );
    res.status(201).json(updatedFeedback);
  } catch (err) {
    res.status(500).json({ error: "Failed to save comment" });
  }
});

// Update feedback by ID
router.put("/feedback/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const feedback = await Feedback.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ error: "Failed to update feedback" });
  }
});

// Delete feedback by ID
router.delete("/feedback/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await Feedback.findByIdAndDelete(id);
    res.json({ message: "Feedback deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete feedback" });
  }
});

app.use("/.netlify/functions/api", router);
module.exports.handler = serverless(app);
