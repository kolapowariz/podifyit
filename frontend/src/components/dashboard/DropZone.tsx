"use client";
import { TextItem } from "pdfjs-dist/types/src/display/api";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { loadPDF } from "../extracter";
import { SkeletonCard, SkeletonAudio } from "./Skeletons";

export default function DropZone() {
  const [text, setText] = useState<string>("");
  const [extractLoading, setExtractLoading] = useState(false);
  const [generateLoading, setGenerateLoading] = useState(false);
  // const [loading, setLoading] = useState(false);
  const [audioURL, setAudioURL] = useState<string>();
  const [pdfError, setPdfError] = useState<string>("");

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setExtractLoading(true);
      // setLoading(true);
      setText("");

      const file = acceptedFiles[0];
      const arrayBuffer = await file.arrayBuffer();

      if (file.type !== "application/pdf") {
        setPdfError(
          "Uploaded file is not a valid PDF. Please upload a valid PDF file.",
        );
        setExtractLoading(false);
        // setLoading(false);
        return;
      }

      setPdfError("");

      try {
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

        if (extractedText === "" || !extractedText) {
          setPdfError("No text found in the PDF file.");
          setExtractLoading(false);
          // setLoading(false);
          return;
        }

        setPdfError("");

        setText(extractedText);

        setExtractLoading(false);

        setGenerateLoading(true);

        const backendUrl =
          process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";
        const res = await fetch(`${backendUrl}/podcast`, {
          method: "POST",
          body: JSON.stringify({ text: extractedText }),
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          throw new Error(`Backend returned ${res.status}`);
        }

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        setGenerateLoading(false);
      } catch (error) {
        console.error("Error loading PDF file:", error);
      } finally {
        setExtractLoading(false);
        // setLoading(false);
      }
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <>
      <div
        {...getRootProps()}
        className="w-full h-full flex flex-col items-center justify-center border-2 border-gray-300 border-dashed rounded-md mt-10 cursor-pointer"
      >
        <input {...getInputProps()} />
        <p className="py-20 text-center">
          Drag & drop a PDF file here, or click to select one
        </p>
      </div>

      {pdfError && (
        <div className="text-center text-red-500 mt-14 text-lg">{pdfError}</div>
      )}

      {/* {text && (
        <div className="text-center p-4 rounded-md mt-10">
          <h1 className="text-xl font-bold">Extracted text</h1>
          <p className="text-justify">{text}</p>
        </div>
      )} */}

      {extractLoading ? (
        <SkeletonCard />
      ) : (
        text && (
          <div className="text-center p-4 rounded-md mt-10">
            <h1 className="text-xl font-bold">Extracted text</h1>
            <p className="text-justify">{text}</p>
          </div>
        )
      )}


      {generateLoading ? (
        <SkeletonAudio />
      ) : (
        audioURL && (
          <audio controls className="w-full mt-6" src={audioURL}>
            Your browser does not support the <code>audio</code> element.
          </audio>
        )
      )}

      {/* {audioURL && (
        <audio controls className="w-full mt-6" src={audioURL}>
          Your browser does not support the <code>audio</code> element.
        </audio>
      )} */}

    </>
  );
}
