import "@ungap/with-resolvers";
import { getDocument } from "pdfjs-dist";

export const loadPDF = async (data: ArrayBuffer) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  await import("pdfjs-dist/build/pdf.worker.mjs");

  const pdf = await getDocument({
    data,
    cMapUrl: "../../../node_modules/pdfjs-dist/cmaps/",
    cMapPacked: true,
    standardFontDataUrl: "../../../node_modules/pdfjs-dist/standard_fonts/",
    verbosity: 0,
  }).promise;

  return pdf;
};
