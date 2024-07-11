import { writer } from "./writer/emitter";
import { readAll } from "./reader/seek";
import path from "path";


writer(`${__dirname}${path.sep}text.xlsx`).then( emitter => {
    readAll( emitter ).then( () => {
        console.log('finished');
    });
})