import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';


pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.worker.mjs';


export default async function countCharacters(file) {
    const fileType = file.name.split('.').pop()?.toLowerCase();

    switch (fileType) {
        case 'pdf':
            return await countPDFCharacters(file);
        case 'txt':
            return await countTXTCharacters(file);
        case 'doc' || 'docx':
            return await countDOCCharacters(file);
        default:
            console.log('Unsupported file type.');
            return null;
    }
}

async function countPDFCharacters(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDocument = await pdfjsLib.getDocument(arrayBuffer).promise;
    let text = '';

    for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
        const page = await pdfDocument.getPage(pageNum);
        const textContent = await page.getTextContent();
        textContent.items.forEach(item => {
            if ('str' in item) {
                text += item.str;
            }
        });
    }
    return text.length;
}

async function countTXTCharacters(file) {
    const text = await file.text();
    return text.length;
}

async function countDOCCharacters(file) {
    const arrayBuffer = await file.arrayBuffer();
    const content = await mammoth.extractRawText({ arrayBuffer });
    return content.value.length;
}