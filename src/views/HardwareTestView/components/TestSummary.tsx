"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TestStatus {
  status: "idle" | "testing" | "success" | "error";
  message: string;
}

interface TestSummaryProps {
  cameraTest: TestStatus;
  micTest: TestStatus;
  speakerTest: TestStatus;
  screenTest: TestStatus;
}

export function TestSummary({
  cameraTest,
  micTest,
  speakerTest,
  screenTest,
}: TestSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen de Pruebas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                cameraTest.status === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              Cámara
            </span>
          </div>
          <div className="text-center">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                micTest.status === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              Micrófono
            </span>
          </div>
          <div className="text-center">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                speakerTest.status === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              Altavoces
            </span>
          </div>
          <div className="text-center">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                screenTest.status === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              Pantalla
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
