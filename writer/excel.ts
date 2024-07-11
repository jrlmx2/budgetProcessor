import { Workbook, Worksheet, Cell, Row, Column, Style, Fill } from "exceljs";
import { Entry } from "../normalize/entry";
import { access, constants } from "fs/promises";

export class Excel {
    static #worksheetTabColor = '#3C523300';
    static readonly worksheetHeaderBackground = '#FFFAF000';

    // @ts-ignore
    #filename: string;

    #workbook: Workbook = new Workbook();

    // @ts-ignore
    #activeSheet: Worksheet;

    #row = 0;

    async openWorkbook( excelFile: string ): Promise<Workbook> {
        // check closed file handles
        this.#filename = excelFile;
        try {
            await access(excelFile, constants.R_OK | constants.W_OK);
            console.log('can access');
            this.#workbook = await this.#workbook.xlsx.readFile(excelFile);
        } catch {
            console.error('cannot access ' + excelFile);
        }

        let sheet = this.#workbook.getWorksheet('transactions');
        if ( !sheet ) {
            sheet = this.#workbook.addWorksheet("transactions", { properties: { tabColor: { argb: Excel.#worksheetTabColor } } });
            sheet = writeHeader(sheet, Entry.headers());
        }

        this.#activeSheet = sheet;

        return this.#workbook;
    }

    async write(entry: Entry) {
        if ( !this.#activeSheet ) {
            setTimeout( () => {
                this.write(entry);
            }, 10);
        }

        const cells: Generator<Cell> = cellGen( this.findNextEmptyRow() );

        for ( let value of entry.write()) {
            let cell: Cell = cells.next().value;
            cell.value = value;
        }
    }

    private findNextEmptyRow(): Row {
        let row: Row = this.#activeSheet.getRow( this.#row );
        if( !row )
            return this.#activeSheet.addRow([]);

        let cell: Cell = row.getCell( 1 );
        if( cell.value ) {
            this.#row +=1;
            return this.findNextEmptyRow();
        }

        return this.#activeSheet.getRow( this.#row );
    }

    async writeOutAndClose() {
        return await this.#workbook.xlsx.writeFile(this.#filename);
    }
}

function writeHeader( sheet: Worksheet, headers: string[] ) {
    const cols = new Array<Partial<Column>>();

    for( let header of headers ) {
        cols.push( {
            header: header.toUpperCase(),
            key: header,
            width: columnWidth(header),
            style: columnStyle(header),
        } );
    }

    sheet.columns = cols;

    sheet.getRow(1).font = { bold: true, size: 11 };
    sheet.getRow(1).border = { bottom: { style: 'medium' } };

    return sheet;
}

function cellGen(row: Row) {
    let currentCell = 1;
    function *cellGenerator(): Generator<Cell> {
        while (true) {
            yield row.getCell(currentCell++);
        }
    }
    return cellGenerator();
}

function columnStyle (header: string): Partial<Style> {
    switch (header) {
        case "cost":
            return { numFmt: "$#,##0.00;Red", alignment: { vertical: "top", horizontal: "right" } };
        case "when":
            return { numFmt: 'dd/mm/yyyy' }
        default:
            return { alignment: { vertical: "top", horizontal: "left", wrapText: true } };
    }
}

function columnWidth (header: string): number {
    switch (header) {
        case "other":
            return 200;
        case "spend":
        case "industry":
        case "subindustry":
        case "card":
        case "cost":
            return 14;
        case "when":
            return 28;
        case "provider":
            return 100;
        default:
            return 48;
    }
}

