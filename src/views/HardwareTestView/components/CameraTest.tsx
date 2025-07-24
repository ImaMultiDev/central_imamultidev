"use client";

import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface TestStatus {
  status: "idle" | "testing" | "success" | "error";
  message: string;
}

interface CameraTestProps {
  testStatus: TestStatus;
  onTestStatusChange: (status: TestStatus) => void;
  cameraStream: MediaStream | null;
  onCameraStreamChange: (stream: MediaStream | null) => void;
}

export function CameraTest({
  testStatus,
  onTestStatusChange,
  cameraStream,
  onCameraStreamChange,
}: CameraTestProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const testCamera = async () => {
    onTestStatusChange({
      status: "testing",
      message: "Accediendo a la cámara...",
    });

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      onCameraStreamChange(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      onTestStatusChange({
        status: "success",
        message: "Cámara funcionando correctamente",
      });
    } catch (error) {
      onTestStatusChange({
        status: "error",
        message: `Error: ${
          error instanceof Error
            ? error.message
            : "No se pudo acceder a la cámara"
        }`,
      });
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      onCameraStreamChange(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      onTestStatusChange({
        status: "idle",
        message: "Prueba la cámara de tu dispositivo",
      });
    }
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
          <Camera className="h-5 w-5" />
          Test de Cámara
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          {getStatusIcon(testStatus.status)}
          <span className={getStatusColor(testStatus.status)}>
            {testStatus.message}
          </span>
        </div>

        {cameraStream && (
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-48 object-cover rounded-lg"
            />
            <Button
              onClick={stopCamera}
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
            >
              Detener
            </Button>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={testCamera}
            disabled={testStatus.status === "testing"}
            className="flex-1"
          >
            Probar Cámara
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
