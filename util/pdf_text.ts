import { getDocument as loadPdf } from 'pdfjs-dist';

export const pdfToTxt = async function (file: File): Promise<string[]> {

    const pdf = await loadPdf(await file.arrayBuffer()).promise;

    return Promise
        .all([...Array(pdf.numPages).keys()]
            .map(async num => (await (await pdf.getPage(num + 1)).getTextContent())
                .items.map(item => (<any>item).str).join(' '))
        )
}