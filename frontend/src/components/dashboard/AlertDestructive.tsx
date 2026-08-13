import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AlertDestructiveProps {
  message: string;
}

export function AlertDestructive({ message }: AlertDestructiveProps) {
  return (
    <Alert variant="destructive" className="max-w-md mx-auto mt-10">
      <AlertCircleIcon />

      <AlertTitle>Podcast generation failed</AlertTitle>

      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
