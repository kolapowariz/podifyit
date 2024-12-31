'use client';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';


GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.5.207/pdf.worker.min.js';

export default function MyDropzone() {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const arrayBuffer = await file.arrayBuffer();

      try {
        const pdf = await getDocument({ data: arrayBuffer }).promise;

        let extractedText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          textContent.items.forEach((item) => {
            extractedText += (item as { str: string }).str + ' ';
          })
        }
        console.log('Extracted text:', extractedText);
      } catch (e) {
        console.error('Failed to extract text:', e);
      }

    }
  }, [])
  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  return (
    <div {...getRootProps()} className="w-full h-full flex flex-col items-center justify-center border-2 border-gray-300 border-dashed rounded-md mt-10 cursor-pointer">

      <input {...getInputProps()} />
      <p className='py-20 text-center'>Drag & drop a PDF file here, or click to select one</p>

    </div>
  )
}


// export function Dropzone() {
//   const onDrop = useCallback(async (acceptedFiles: File[]) => {
//     if (acceptedFiles.length > 0) {
//       const file = acceptedFiles[0];
//       const arrayBuffer = await file.arrayBuffer();
//       const base64File = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

//       const response = await fetch('/api/extract', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ file: base64File })
//       })

//       if (!response.ok) {
//         console.error('Failed to extract text:', response.statusText);
//         return;
//       }

//       const { text } = await response.json();
//       console.log('Extracted text:', text);
//     }

//   }, [])

//   const { getRootProps, getInputProps } = useDropzone({ onDrop })

//   return (
//     <div {...getRootProps()} className="w-full h-full flex flex-col items-center justify-center border-2 border-gray-300 border-dashed rounded-md mt-10 cursor-pointer">
//       <input {...getInputProps()} />
//       <p className='py-20 text-center'>Drag &apos;n&apos; drop some files here, or click to select files. API path</p>
//     </div>
//   )
// }