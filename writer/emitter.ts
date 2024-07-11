import EventEmitter from "node:events";
import { Excel } from "./excel";
import { Entry, EntryEvent, EntryEventMap } from "../normalize/entry";

export const writer = async ( excelfile: string, log: boolean = false ) => {
    const emitter: EventEmitter<EntryEventMap> = new EventEmitter<EntryEventMap>();
    const listeners: Map<symbol, number> = new Map<symbol, number>();

    // make class to read more than one file from same class instance. Access workbook by singleton. Ensure closing
    const workbookHandle = new Excel();

    const removeAndClose = ( listenerHandle: symbol ) => {

        if ( listeners.get(listenerHandle)! > 0 )
            setTimeout( () => removeAndClose(listenerHandle), 50 )


        console.log("removed listener ", Symbol.keyFor(listenerHandle));
        listeners.delete(listenerHandle);

        if (listeners.size === 0) // finished, cleanup
            workbookHandle.writeOutAndClose();
    }

    await workbookHandle.openWorkbook( excelfile ).then( () => {
        emitter.on('read', async (event: EntryEvent) => {
            if (log) console.log("writing");
            listeners.set(event.source, listeners.get( event.source )! + 1);
            await workbookHandle.write( event.entry );
            listeners.set(event.source, listeners.get( event.source )! - 1);
        });

        emitter.on('addListener', (listenerHandle: symbol) => {
            console.log("registered listener ", Symbol.keyFor(listenerHandle));
            listeners.set(listenerHandle, 0);
        });

        emitter.on('finished', removeAndClose);
    }).catch(e => console.error(e)).finally(() => console.log("finally"));

    return emitter;
};