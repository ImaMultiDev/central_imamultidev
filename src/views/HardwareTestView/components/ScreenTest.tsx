"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Monitor, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface TestStatus {
  status: "idle" | "testing" | "success" | "error";
  message: string;
}

interface ScreenTestProps {
  testStatus: TestStatus;
  onTestStatusChange: (status: TestStatus) => void;
}

export function ScreenTest({
  testStatus,
  onTestStatusChange,
}: ScreenTestProps) {
  const testScreen = async () => {
    onTestStatusChange({
      status: "testing",
      message: "Verificando resolución de pantalla...",
    });

    try {
      const width = window.screen.width;
      const height = window.screen.height;
      const colorDepth = window.screen.colorDepth;
      const pixelRatio = window.devicePixelRatio;

      onTestStatusChange({
        status: "success",
        message: `Pantalla: ${width}x${height}px, ${colorDepth} bits, ${pixelRatio}x densidad`,
      });
    } catch (error) {
      onTestStatusChange({
        status: "error",
        message: `Error: ${
          error instanceof Error
            ? error.message
            : "No se pudo obtener información de la pantalla"
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
          <Monitor className="h-5 w-5" />
          Test de Pantalla
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
          onClick={testScreen}
          disabled={testStatus.status === "testing"}
          className="w-full"
        >
          Probar Pantalla
        </Button>
      </CardContent>
    </Card>
  );
}
