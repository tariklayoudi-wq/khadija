import fs from 'node:fs';
import vm from 'node:vm';
const source = fs.readFileSync('src/lib/catalog.ts','utf8');
const start = source.indexOf('export const LISTINGS: Listing[] = ');
const end = source.indexOf('\n];',start);
if(start<0 || end<0) throw new Error('Catalog definition missing');
const expression = source.slice(start + 'export const LISTINGS: Listing[] = '.length,end+2);
const listings = vm.runInNewContext(expression,{media:file=>'/media/real/'+(file==='belboula.jpg'?'belboula.svg':file.replace(/\.jpg$/,'.webp'))},{timeout:1000});
fs.writeFileSync('backend/catalog.json', JSON.stringify(listings));
