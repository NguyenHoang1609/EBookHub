import { promises as fsPromises } from 'fs';
import path from 'path';
import pdf from 'pdf-parse';

const convertPdfToText = async (pdfPath, password = null) => {
    console.log("Converting PDF to text using pdf-parse...");

    try {
        const dataBuffer = await fsPromises.readFile(pdfPath);

        const options = {
            password: password || undefined,
            max: 1000,
            version: 'v2.0.550'
        };

        console.log("Parsing PDF content...");

        const data = await pdf(dataBuffer, options);

        if (!data || !data.text) {
            throw new Error('No text content found in PDF');
        }

        console.log(`PDF parsed successfully. Total pages: ${data.numpages}`);
        console.log(`Text length: ${data.text.length} characters`);

        const totalTextLength = data.text.length;
        const charsPerPage = Math.ceil(totalTextLength / data.numpages);

        const pages = [];
        for (let i = 0; i < data.numpages; i++) {
            const startIndex = i * charsPerPage;
            const endIndex = Math.min((i + 1) * charsPerPage, totalTextLength);
            const pageContent = data.text.substring(startIndex, endIndex).trim();

            if (pageContent.length > 0) {
                pages.push({
                    pageNumber: i + 1,
                    content: pageContent,
                    title: `Page ${i + 1}`,
                    status: 'draft'
                });
            }
        }

        console.log(`Successfully extracted ${pages.length} text pages from PDF`);

        return pages;

    } catch (error) {
        console.error('PDF text extraction error:', error);

        let errorMessage = 'Failed to extract text from PDF';

        if (error.message.includes('password')) {
            errorMessage = 'PDF is password protected. Please provide the correct password.';
        } else if (error.message.includes('Invalid PDF')) {
            errorMessage = 'The file is not a valid PDF or is corrupted.';
        } else if (error.message.includes('No text content')) {
            errorMessage = 'No text content found in the PDF. The PDF might be image-based or scanned.';
        } else if (error.message.includes('timeout')) {
            errorMessage = 'PDF processing timed out. Please try with a smaller file.';
        }

        throw new Error(errorMessage);
    }
};

export default convertPdfToText;
