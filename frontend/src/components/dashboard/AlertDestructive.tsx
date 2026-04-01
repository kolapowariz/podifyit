import { AlertCircleIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function AlertDestructive() {
  return (
    <Alert variant="destructive" className="max-w-md mx-auto mt-10">
      <AlertCircleIcon />
      <AlertTitle>Podcast generation failed</AlertTitle>
      <AlertDescription>
        Your podcast could not be generated. An error occurred while generating
        audio. Please try again.
      </AlertDescription>
    </Alert>
  );
}
