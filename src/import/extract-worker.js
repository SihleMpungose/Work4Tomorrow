const MAX_TEXT=100000;
function checkLength(text){if(text.length>MAX_TEXT)throw Error('Extracted text exceeds 100,000 characters. Use a smaller document or paste a relevant section.');return text;}
function verifyDocx(buffer){
 const v=new DataView(buffer);if(v.byteLength<22||v.getUint32(0,true)!==0x04034b50)throw Error('This is not a supported DOCX archive.');
 let end=-1;for(let i=v.byteLength-22;i>=Math.max(0,v.byteLength-65557);i--)if(v.getUint32(i,true)===0x06054b50){end=i;break;}
 if(end<0)throw Error('Invalid or truncated DOCX archive.');
 const count=v.getUint16(end+10,true);let offset=v.getUint32(end+16,true),total=0,hasDocument=false;
 if(count>2000)throw Error('DOCX archive has too many entries.');
 for(let i=0;i<count;i++){
  if(offset+46>v.byteLength||v.getUint32(offset,true)!==0x02014b50)throw Error('Invalid DOCX directory.');
  if(v.getUint16(offset+8,true)&1)throw Error('Encrypted DOCX files are not supported.');
  total+=v.getUint32(offset+24,true);if(total>20*1024*1024)throw Error('DOCX expanded content exceeds the processing limit.');
  const nameLen=v.getUint16(offset+28,true),extra=v.getUint16(offset+30,true),comment=v.getUint16(offset+32,true);
  const name=new TextDecoder().decode(new Uint8Array(buffer,offset+46,nameLen));if(name==='word/document.xml')hasDocument=true;
  if(/vbaProject\.bin$/i.test(name))throw Error('Macro-enabled Word content is not supported.');
  offset+=46+nameLen+extra+comment;
 }
 if(!hasDocument)throw Error('This archive does not contain a Word document.');
}
self.onmessage=async({data:{type,buffer,ext}})=>{
 if(type!=='w4t-extract')return;
 try{
  let text='';
  if(ext==='txt'){
   const bytes=new Uint8Array(buffer);if(bytes.includes(0))throw Error('Choose a UTF-8 plain text file; this file contains binary or unsupported encoding.');
   text=new TextDecoder('utf-8',{fatal:true}).decode(bytes);
  }else if(ext==='docx'){
   verifyDocx(buffer);importScripts('../../vendor/mammoth/mammoth.browser.min.js');
   text=(await mammoth.extractRawText({arrayBuffer:buffer})).value;
  }else{
   if(!new TextDecoder().decode(new Uint8Array(buffer,0,Math.min(1024,buffer.byteLength))).includes('%PDF-'))throw Error('This file does not have a PDF header.');
   const pdf=await import('../../vendor/pdfjs/pdf.min.mjs');
   pdf.GlobalWorkerOptions.workerSrc=new URL('../../vendor/pdfjs/pdf.worker.min.mjs',self.location.href).href;
   const task=pdf.getDocument({data:new Uint8Array(buffer),isEvalSupported:false,useSystemFonts:false,disableFontFace:true});
   const doc=await task.promise;
   if(doc.numPages>50){await doc.destroy();throw Error('PDF has more than 50 pages. Use a shorter document.');}
   try{for(let i=1;i<=doc.numPages;i++){
    self.postMessage({type:'w4t-result',progress:`Reading page ${i} of ${doc.numPages}`});
    const page=await doc.getPage(i);const content=await page.getTextContent();
    text+=content.items.map(item=>item.str+(item.hasEOL?'\n':' ')).join('')+'\n';checkLength(text);
   }}finally{await doc.destroy();}
  }
  text=checkLength(text).trim();if(!text)throw Error('No readable text found. This may be a scanned document; paste the text or enter details manually.');
  self.postMessage({type:'w4t-result',text});
 }catch(error){self.postMessage({type:'w4t-result',error:error.name==='PasswordException'?'Password-protected PDFs are not supported. Use an unprotected copy or pasted text.':error.message||'Unable to read this document.'});}
};
