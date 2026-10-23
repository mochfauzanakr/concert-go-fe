"use client";
import { useState } from "react";
import { Message } from "./ui";

export function useFeedback() {
  const [feedback, setFeedback] = useState({ text: "", error: false });
  return {
    feedback,
    clear: () => setFeedback({ text: "", error: false }),
    run: (action: () => void, text: string) => {
      try {
        action();
        setFeedback({ text, error: false });
        return true;
      } catch (error) {
        setFeedback({
          text:
            error instanceof Error ? error.message : "Tindakan belum berhasil.",
          error: true,
        });
        return false;
      }
    },
  };
}

export function Feedback({
  value,
}: {
  value: { text: string; error: boolean };
}) {
  return <Message message={value.text} error={value.error} />;
}
