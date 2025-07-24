"use client";

import { useState, useRef } from "react";
import {
  CameraTest,
  MicrophoneTest,
  SpeakerTest,
  ScreenTest,
} from "./components";

// Types
interface TestStatus {
  status: "idle" | "testing" | "success" | "error";
  message: string;
}

export function HardwareTestView() {
  // Camera Test State
  const [cameraTest, setCameraTest] = useState<TestStatus>({
    status: "idle",
    message: "Prueba la cámara de tu dispositivo",
  });
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  // Microphone Test State
  const [micTest, setMicTest] = useState<TestStatus>({
    status: "idle",
    message: "Prueba el micrófono de tu dispositivo",
  });
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Speaker Test State
  const [speakerTest, setSpeakerTest] = useState<TestStatus>({
    status: "idle",
    message: "Prueba los altavoces de tu dispositivo",
  });

  // Screen Test State
  const [screenTest, setScreenTest] = useState<TestStatus>({
    status: "idle",
    message: "Prueba la pantalla de tu dispositivo",
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">Test de Hardware</h1>
        <p className="text-muted-foreground">
          Verifica el funcionamiento de los componentes de tu dispositivo
        </p>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Camera Test */}
        <CameraTest
          className="lg:col-span-3"
          testStatus={cameraTest}
          onTestStatusChange={setCameraTest}
          cameraStream={cameraStream}
          onCameraStreamChange={setCameraStream}
        />

        {/* Microphone Test */}
        <MicrophoneTest
          testStatus={micTest}
          onTestStatusChange={setMicTest}
          isRecording={isRecording}
          onIsRecordingChange={setIsRecording}
          recordedBlob={recordedBlob}
          onRecordedBlobChange={setRecordedBlob}
          mediaRecorderRef={mediaRecorderRef}
          streamRef={streamRef}
        />

        {/* Speaker Test */}
        <SpeakerTest
          testStatus={speakerTest}
          onTestStatusChange={setSpeakerTest}
        />

        {/* Screen Test */}
        <ScreenTest
          testStatus={screenTest}
          onTestStatusChange={setScreenTest}
        />
      </div>
    </div>
  );
}
