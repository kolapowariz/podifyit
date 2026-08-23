"use client";

import { TextItem } from "pdfjs-dist/types/src/display/api";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { loadPDF } from "../extracter";
import { SkeletonCard } from "./Skeletons";
import { AlertDestructive } from "./AlertDestructive";

type GenerationStage =
  | "idle"
  | "analyzing"
  | "generating"
  | "complete"
  | "error";

export default function DropZone() {
  const [text, setText] = useState("");
  const [extractLoading, setExtractLoading] = useState(false);
  const [generateLoading, setGenerateLoading] = useState(false);

  const [audioURL, setAudioURL] = useState<string | null>(null);

  const [pdfError, setPdfError] = useState("");
  const [generateError, setGenerateError] = useState("");

  const [generationStage, setGenerationStage] =
    useState<GenerationStage>("idle");

  const isProcessing = extractLoading || generateLoading;

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      return;
    }

    const file = acceptedFiles[0];

    // Reset previous state
    setPdfError("");
    setGenerateError("");
    setText("");
    setAudioURL(null);
    setGenerationStage("idle");

    // Validate file type
    if (file.type !== "application/pdf") {
      setPdfError(
        "Uploaded file is not a valid PDF. Please upload a PDF file.",
      );
      setGenerationStage("error");
      return;
    }

    try {
      // --------------------------------
      // STEP 1: Analyze PDF
      // --------------------------------
      setExtractLoading(true);
      setGenerationStage("analyzing");

      const arrayBuffer = await file.arrayBuffer();

      const pdf = await loadPDF(arrayBuffer);

      const numPages = pdf.numPages;
      let extractedText = "";

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();

        textContent.items.forEach((item) => {
          const textItem = item as TextItem;

          extractedText += textItem.str + " ";
        });
      }

      extractedText = extractedText.trim();

      if (!extractedText) {
        throw new Error("No readable text was found in this PDF.");
      }

      setText(extractedText);
      console.log(text)

      // --------------------------------
      // STEP 2: Generate podcast
      // --------------------------------
      setExtractLoading(false);
      setGenerateLoading(true);
      setGenerationStage("generating");

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

      if (!backendUrl) {
        throw new Error("NEXT_PUBLIC_BACKEND_URL is not configured.");
      }

      const res = await fetch(`${backendUrl}/podcast`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: extractedText,
        }),
      });

      if (!res.ok) {
        let errorMessage =
          "We couldn't generate your podcast. Please try again.";

        try {
          const errorData = await res.json();

          errorMessage = errorData.detail || errorData.error || errorMessage;
        } catch {
          // Response wasn't JSON.
        }

        throw new Error(errorMessage);
      }

      const blob = await res.blob();

      if (!blob.size) {
        throw new Error("The podcast audio file was empty.");
      }

      const url = URL.createObjectURL(blob);

      setAudioURL(url);
      setGenerationStage("complete");
    } catch (error) {
      console.error("Podcast generation error:", error);

      setGenerationStage("error");

      setGenerateError(
        error instanceof Error
          ? error.message
          : "Something went wrong while generating your podcast.",
      );
    } finally {
      setExtractLoading(false);
      setGenerateLoading(false);
    }
  }, [text]);

  // Clean up Blob URLs
  useEffect(() => {
    return () => {
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [audioURL]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: false,
    disabled: isProcessing,
  });

  const getStatusMessage = () => {
    switch (generationStage) {
      case "analyzing":
        return {
          title: "Analyzing PDF",
          description:
            "Extracting the information needed to create your podcast...",
        };

      case "generating":
        return {
          title: "Creating your podcast",
          description:
            "Writing the conversation and generating the host voices. This may take a moment...",
        };

      case "complete":
        return {
          title: "Podcast ready",
          description: "Your podcast has been generated successfully.",
        };

      case "error":
        return {
          title: "Generation failed",
          description:
            "Something went wrong. Please try uploading your PDF again.",
        };

      default:
        return null;
    }
  };

  const status = getStatusMessage();

  return (
    <>
      <div
        {...getRootProps()}
        className={`w-full min-h-[300px] flex flex-col items-center justify-center border-2 border-gray-300 border-dashed rounded-md mt-5 p-6 transition ${
          isProcessing
            ? "cursor-not-allowed opacity-70"
            : "cursor-pointer hover:border-gray-500"
        }`}
      >
        <input {...getInputProps()} />

        {/* Upload message */}
        {!isProcessing && !audioURL && !pdfError && !generateError && (
          <div className="text-center">
            <p className="font-medium">Drag & drop a PDF file here</p>

            <p className="text-sm text-gray-500 mt-2">
              or click to select a file
            </p>

            <p className="text-xs text-gray-400 mt-2">PDF files only</p>
          </div>
        )}

        {/* Status */}
        {status && isProcessing && (
          <div className="w-full max-w-md text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
            </div>

            <h2 className="text-lg font-semibold">{status.title}</h2>

            <p className="text-sm text-gray-500 mt-2">{status.description}</p>
          </div>
        )}

        {/* PDF extraction skeleton */}
        {extractLoading && <SkeletonCard />}

        {/* Extracted PDF text */}
        {/* {!extractLoading && text && (
          <div className="text-center p-4 rounded-md mt-5 w-full">
            <h1 className="text-xl font-bold">PDF Content</h1>

            <p className="text-justify">{text}</p>
          </div>
        )} */}

        {/* Audio generation skeleton */}
        {/* {generateLoading && <SkeletonAudio />} */}

        {/* Podcast result */}
        {!generateLoading && audioURL && (
          <div className="w-full max-w-xl mt-8 p-4">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-600 mb-3">
                ✓
              </div>

              <h2 className="text-xl font-semibold">Your Podcast Is Ready</h2>

              <p className="text-sm text-gray-500 mt-1">
                Listen to your AI-generated podcast or download the MP3.
              </p>
            </div>

            <audio controls className="w-full" src={audioURL}>
              Your browser does not support the <code>audio</code> element.
            </audio>

            <a
              href={audioURL}
              download="podifyit-podcast.mp3"
              className="block w-full mt-4 text-center px-4 py-3 rounded-md bg-black text-white hover:opacity-90 transition"
            >
              Download Podcast
            </a>
          </div>
        )}

        {/* PDF error */}
        {pdfError && (
          <div className="w-full max-w-md mt-6">
            <AlertDestructive message={pdfError} />
          </div>
        )}

        {/* Generation error */}
        {generateError && (
          <div className="w-full max-w-md mt-6">
            <AlertDestructive message={generateError} />
          </div>
        )}
      </div>
    </>
  );
}
