const { OpenAI } = require("openai");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class TranscribeController {
  static async transcribeAudio(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No audio file provided" });
      }

      // Create a temporary file path
      const tempFilePath = path.join(
        __dirname,
        `../temp/${Date.now()}_audio${path.extname(req.file.originalname)}`
      );

      // Ensure temp directory exists
      const tempDir = path.join(__dirname, "../temp");
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      // Write buffer to temporary file
      fs.writeFileSync(tempFilePath, req.file.buffer);

      try {
        // Create a ReadStream for the file
        const audioFile = fs.createReadStream(tempFilePath);

        // Transcribe using OpenAI's Whisper model
        const response = await openai.audio.transcriptions.create({
          file: audioFile,
          model: "whisper-1",
          language: "en",
        });

        res.json({ transcript: response.text });
      } finally {
        // Clean up: Delete temporary file
        if (fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath);
        }
      }
    } catch (error) {
      console.error("Error transcribing audio:", error);
      res.status(500).json({ error: "Failed to transcribe audio" });
    }
  }
}

module.exports = TranscribeController;
