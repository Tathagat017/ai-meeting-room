import { useState, useCallback } from "react";

interface AudioRecorderState {
  isRecording: boolean;
  audioBlob: Blob | null;
  error: string | null;
  mediaRecorder: MediaRecorder | null;
  audioChunks: Blob[];
}

export const useAudioRecorder = () => {
  const [state, setState] = useState<AudioRecorderState>({
    isRecording: false,
    audioBlob: null,
    error: null,
    mediaRecorder: null,
    audioChunks: [],
  });

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        setState((prev) => ({
          ...prev,
          isRecording: false,
          audioBlob,
          audioChunks: [],
        }));

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setState((prev) => ({
        ...prev,
        isRecording: true,
        error: null,
        mediaRecorder,
        audioChunks,
      }));
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to start recording. Please check your microphone permissions.";
      setState((prev) => ({
        ...prev,
        error: errorMessage,
      }));
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (state.mediaRecorder && state.isRecording) {
      state.mediaRecorder.stop();
    }
  }, [state.mediaRecorder, state.isRecording]);

  const resetRecording = useCallback(() => {
    setState({
      isRecording: false,
      audioBlob: null,
      error: null,
      mediaRecorder: null,
      audioChunks: [],
    });
  }, []);

  return {
    isRecording: state.isRecording,
    audioBlob: state.audioBlob,
    error: state.error,
    startRecording,
    stopRecording,
    resetRecording,
  };
};
