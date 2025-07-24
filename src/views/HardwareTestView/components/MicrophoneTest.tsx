"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Mic,
  CheckCircle,
  XCircle,
  AlertCircle,
  RotateCcw,
} from "lucide-react";

interface TestStatus {
  status: "idle" | "testing" | "success" | "error";
  message: string;
}

interface MicrophoneTestProps {
  testStatus: TestStatus;
  onTestStatusChange: (status: TestStatus) => void;
  isRecording: boolean;
  onIsRecordingChange: (recording: boolean) => void;
  recordedBlob: Blob | null;
  onRecordedBlobChange: (blob: Blob | null) => void;
  mediaRecorderRef: React.MutableRefObject<MediaRecorder | null>;
  streamRef: React.MutableRefObject<MediaStream | null>;
}

export function MicrophoneTest({
  testStatus,
  onTestStatusChange,
  isRecording,
  onIsRecordingChange,
  recordedBlob,
  onRecordedBlobChange,
  mediaRecorderRef,
  streamRef,
}: MicrophoneTestProps) {
  const testMicrophone = async () => {
    onTestStatusChange({
      status: "testing",
      message: "Accediendo al micrófono...",
    });

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      // Store the stream for later use
      streamRef.current = stream;

      onTestStatusChange({
        status: "success",
        message: "Micrófono detectado. Haz clic en 'Grabar' para probar",
      });
    } catch (error) {
      onTestStatusChange({
        status: "error",
        message: `Error: ${
          error instanceof Error
            ? error.message
            : "No se pudo acceder al micrófono"
        }`,
      });
    }
  };

  const startRecording = async () => {
    try {
      // Get a fresh stream for recording
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      // Create a new MediaRecorder instance
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        onRecordedBlobChange(blob);
        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
        mediaRecorderRef.current = null;
      };

      mediaRecorder.start();
      onIsRecordingChange(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      onIsRecordingChange(false);
    }
  };

  const stopRecording = () => {
    try {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
        onIsRecordingChange(false);
      }
    } catch (error) {
      console.error("Error stopping recording:", error);
      onIsRecordingChange(false);
    }
  };

  const resetMicrophoneTest = () => {
    // Stop any active recording
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }

    // Stop any active stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    // Reset states
    onIsRecordingChange(false);
    onRecordedBlobChange(null);
    mediaRecorderRef.current = null;

    onTestStatusChange({
      status: "idle",
      message: "Prueba el micrófono de tu dispositivo",
    });
  };

  const getStatusIcon = (status: TestStatus["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "testing":
        return (
          <AlertCircle className="h-5 w-5 text-yellow-500 animate-pulse" />
        );
      default:
        return null;
    }
  };

  const getStatusColor = (status: TestStatus["status"]) => {
    switch (status) {
      case "success":
        return "text-green-600";
      case "error":
        return "text-red-600";
      case "testing":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-5 w-5" />
          Test de Micrófono
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          {getStatusIcon(testStatus.status)}
          <span className={getStatusColor(testStatus.status)}>
            {testStatus.message}
          </span>
        </div>

        {recordedBlob && (
          <div className="space-y-2">
            <audio controls className="w-full">
              <source
                src={URL.createObjectURL(recordedBlob)}
                type="audio/webm"
              />
            </audio>
            <Button
              onClick={() => onRecordedBlobChange(null)}
              variant="outline"
              size="sm"
            >
              Eliminar Grabación
            </Button>
          </div>
        )}

        <div className="flex gap-2">
          {testStatus.status === "idle" ? (
            <Button
              onClick={testMicrophone}
              disabled={false}
              className="flex-1"
            >
              Probar Micrófono
            </Button>
          ) : (
            <>
              <Button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={testStatus.status === "testing"}
                variant={isRecording ? "destructive" : "default"}
                className="flex-1"
              >
                {isRecording ? "Detener Grabación" : "Grabar"}
              </Button>
              <Button onClick={resetMicrophoneTest} variant="outline" size="sm">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
