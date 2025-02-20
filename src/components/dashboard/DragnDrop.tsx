'use client';
import { TextItem } from 'pdfjs-dist/types/src/display/api';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { loadPDF } from '../extracter';


export default function MyDropzone() {
  const [text, setText] = useState<string>('')
  // const [generatedText, setGeneratedText] = useState<string>('')
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {

    if (acceptedFiles.length > 0) {
      setLoading(true)

      const file = acceptedFiles[0];
      const arrayBuffer = await file.arrayBuffer();

      if (file.type !== 'application/pdf') {
        console.error('Uploaded file is not a valid PDF');
        return;
      }

      try {
        const pdf = await loadPDF(arrayBuffer);

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
        setText(extractedText);

        // const response = await fetch('/api/tts', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({ text: extractedText }),
        // })

        // if (!response.ok) {
        //   console.error('Failed to fetch TTS API:', response.statusText);
        //   return;
        // }

        // const data = await response.json();
        // console.log('TTS API response:', data.result);
        // setGeneratedText(data.result);

      } catch (error) {
        console.error('Error loading PDF file:', error);
      } finally {
        setLoading(false)
      }
    }
  }, [])

  const { getRootProps, getInputProps } = useDropzone({ onDrop })


  return (
    <>
      <div {...getRootProps()} className="w-full h-full flex flex-col items-center justify-center border-2 border-gray-300 border-dashed rounded-md mt-10 cursor-pointer">

        <input {...getInputProps()} />
        <p className='py-20 text-center'>Drag & drop a PDF file here, or click to select one</p>
      </div>

      {loading && <div className='text-center text-2xl mt-10'>Processing...</div>}

      {text && <div className='text-center p-4 rounded-md mt-10'>
        <h1 className='text-xl font-bold'>Extracted text</h1>
        <p className='text-justify'>{text}</p>
      </div>}

      {/* {generatedText && (
        <div className="text-center p-4 rounded-md mt-10">
        <h1 className="text-xl font-bold">Generated Result</h1>
        <p className="text-justify">{generatedText}</p>
      </div>
      )} */}

    </>
  )
}
