'use client';
import { TextItem } from 'pdfjs-dist/types/src/display/api';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { loadPDF } from '../extracter';


export default function MyDropzone() {

  const onDrop = useCallback(async (acceptedFiles: File[]) => {

    if (acceptedFiles.length > 0) {
      // console.log(acceptedFiles)
      const file = acceptedFiles[0];
      const arrayBuffer = await file.arrayBuffer();

      if (file.type !== 'application/pdf') {
        console.error('Uploaded file is not a valid PDF');
        return;
      }

      try {
        const pdf = await loadPDF(arrayBuffer);
        console.log('PDF loaded: ', pdf);

        const numPages = pdf.numPages;
        let extractedText = '';

        for (let i = 1; i <= numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();

          textContent.items.forEach((item) => {
            const textItem = item as TextItem;
            extractedText += textItem.str + ' ';
          })
        }

        console.log('Extracted text:', extractedText);
      } catch (error) {
        console.error('Error loading PDF file:', error);
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
