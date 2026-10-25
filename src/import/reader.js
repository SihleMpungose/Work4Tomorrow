// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2026 Sihle Mpungose
export const MAX_BYTES=5*1024*1024;
export function extractDocument(file,{onProgress=()=>{}}={}) {
 let worker,timer,rejectPending,done=false;
 const finish=()=>{done=true;clearTimeout(timer);worker?.terminate();worker=null;};
 const promise=new Promise((resolve,reject)=>{
  rejectPending=reject;
  if(file.size>MAX_BYTES){finish();reject(new Error('File is larger than 5 MiB. Paste the text or enter details manually.'));return;}
  const ext=file.name.toLowerCase().split('.').at(-1);
  if(!['txt','docx','pdf'].includes(ext)){finish();reject(new Error('Choose TXT, DOCX or a text-based PDF. Images and older DOC files need pasted text or manual entry.'));return;}
  try{worker=new Worker(new URL('./extract-worker.js',import.meta.url));}catch{finish();reject(new Error('Document processing is unavailable here. Use pasted text, or open the served project version.'));return;}
  timer=setTimeout(()=>{finish();reject(new Error('Processing exceeded 15 seconds. Try a smaller document or paste its text.'));},15000);
  worker.onmessage=event=>{if(event.data.type!=='w4t-result')return;if(event.data.progress){onProgress(event.data.progress);return;}finish();event.data.error?reject(new Error(event.data.error)):resolve(event.data.text);};
  worker.onerror=()=>{finish();reject(new Error('This file could not be read. Try pasted text or manual entry.'));};
  file.arrayBuffer().then(buffer=>{if(!done)worker.postMessage({type:'w4t-extract',buffer,ext},[buffer]);}).catch(()=>{finish();reject(new Error('Unable to read this file.'));});
 });
 return {promise,cancel(){if(!done){finish();rejectPending(new Error('Import cancelled. You can still paste text or enter details manually.'));}}};
}
