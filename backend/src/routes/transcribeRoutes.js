const express = require("express");
const router = express.Router();
const multer = require("multer");
const TranscribeController = require("../controllers/transcribeController");

// Configure multer for handling audio files
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Transcribe audio file
router.post("/", upload.single("audio"), TranscribeController.transcribeAudio);

module.exports = { transcribeRouter: router };
