"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface TestStatus {
  status: "idle" | "testing" | "success" | "error";
  message: string;
}

interface SpeakerTestProps {
  testStatus: TestStatus;
  onTestStatusChange: (status: TestStatus) => void;
}

export function SpeakerTest({
  testStatus,
  onTestStatusChange,
}: SpeakerTestProps) {
  const testSpeakers = async () => {
    onTestStatusChange({
      status: "testing",
      message: "Reproduciendo sonido de prueba...",
    });

    try {
      // Create a simple beep sound using Web Audio API
      const audioContext = new (window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext)();

      // Resume audio context if suspended (required by modern browsers)
      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }

      // Create oscillator for beep sound
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Set frequency to 800Hz (pleasant beep)
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.type = "sine";

      // Set volume
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);

      // Play for 1 second
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1);

      // Clean up and update status
      oscillator.onended = () => {
        audioContext.close();
        onTestStatusChange({
          status: "success",
          message:
            "¿Escuchaste el tono de prueba? Los altavoces funcionan correctamente",
        });
      };
    } catch (error) {
      console.error("Error testing speakers:", error);
      onTestStatusChange({
        status: "error",
        message: `Error: ${
          error instanceof Error
            ? error.message
            : "No se pudo reproducir el sonido"
        }`,
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
          <Volume2 className="h-5 w-5" />
          Test de Altavoces
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          {getStatusIcon(testStatus.status)}
          <span className={getStatusColor(testStatus.status)}>
            {testStatus.message}
          </span>
        </div>

        <Button
          onClick={testSpeakers}
          disabled={testStatus.status === "testing"}
          className="w-full"
        >
          Probar Altavoces
        </Button>
      </CardContent>
    </Card>
  );
}
