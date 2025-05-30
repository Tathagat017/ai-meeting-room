export class AudioService {
  private static baseUrl: string = import.meta.env.VITE_API_BASE_URL;

  static async transcribeAudio(audioBlob: Blob): Promise<string> {
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.wav");

      const response = await fetch(`${this.baseUrl}/api/transcribe`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to transcribe audio");
      }

      const data = await response.json();
      return data.transcript;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to transcribe audio";
      throw new Error(errorMessage);
    }
  }

  static async validateAudioFile(file: File): Promise<boolean> {
    // Check file type
    const validTypes = ["audio/wav", "audio/mp3", "audio/mpeg", "audio/webm"];
    if (!validTypes.includes(file.type)) {
      throw new Error(
        "Invalid file type. Please upload a WAV, MP3, or WebM file."
      );
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      throw new Error("File size too large. Maximum size is 10MB.");
    }

    return true;
  }
}
