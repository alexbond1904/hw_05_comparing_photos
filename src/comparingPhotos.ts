import * as fs from "node:fs";

const readStream1 = fs.createReadStream('./photos/photo1.webp', {highWaterMark: 2});
const readStream2 = fs.createReadStream('./photos/photo2.webp', {highWaterMark: 2});

let photo1Promise: Promise<string>;
let photo2Promise: Promise<string>;
let flag: boolean = true;

readStream1.on('data', (chunk) => {
    readStream2.pause();
    photo1Promise = new Promise<string>((resolve) => resolve(chunk.toString()));
    readStream2.resume();
    readStream1.pause();
});

readStream2.on('data', (chunk) => {
    photo2Promise = new Promise<string>((resolve) => resolve(chunk.toString()));
    readStream2.pause();
    comparePhotos().then();
});

readStream1.on('end', ()=> {
    console.log("Images are equals")
})

async function comparePhotos() {
    const [a, b] = await Promise.all([photo1Promise, photo2Promise]);
    if (a === b) {
        // console.log(a)
        // console.log(b)
        // console.log("======")
        readStream1.resume();
    } else {
        // console.log(a)
        // console.log(b)
        readStream1.close();
        readStream2.close();
        console.log("Images are not equals")
    }
}