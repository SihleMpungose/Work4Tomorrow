// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2026 Sihle Mpungose
// Lightweight UI preview adapter. Full downloads use reader.js with DOCX/PDF parsers.
export const MAX_BYTES=5*1024*1024;
export function extractDocument(file,{onProgress=()=>{}}={}){
 let rejectPending,settled=false;
 const promise=new Promise((resolve,reject)=>{
  rejectPending=reject;
  if(file.size>MAX_BYTES){reject(Error('File is larger than 5 MiB.'));return;}
  if(!file.name.toLowerCase().endsWith('.txt')){reject(Error('This lightweight UI preview reads TXT files. Use pasted text or open the full mobile download for DOCX and PDF.'));return;}
  onProgress('Reading text locally…');
  file.arrayBuffer().then(buffer=>{if(settled)return;const bytes=new Uint8Array(buffer);if(bytes.includes(0))throw Error('Choose a UTF-8 text file.');const text=new TextDecoder('utf-8',{fatal:true}).decode(bytes).trim();if(!text)throw Error('No readable text found.');if(text.length>100000)throw Error('Extracted text exceeds 100,000 characters.');settled=true;resolve(text);}).catch(error=>{if(!settled){settled=true;reject(error);}});
 });
 return {promise,cancel(){if(!settled){settled=true;rejectPending(Error('Import cancelled.'));}}};
}
