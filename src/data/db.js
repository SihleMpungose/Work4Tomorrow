// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2026 Sihle Mpungose
let connection;
export function openDB() {
 if (connection) return connection;
 connection = new Promise((resolve,reject)=>{
  const request=indexedDB.open('work4tomorrow',1);
  request.onupgradeneeded=()=>{for(const name of ['profile','jobs','comparisons']) if(!request.result.objectStoreNames.contains(name)) request.result.createObjectStore(name,{keyPath:'id'});};
  request.onsuccess=()=>resolve(request.result);
  request.onerror=()=>{connection=null;reject(request.error);};
  request.onblocked=()=>reject(new Error('Close another old Work4Tomorrow tab, then retry.'));
 });return connection;
}
export async function saveRecord(store,record) {
 const db=await openDB();
 return new Promise((resolve,reject)=>{
  const tx=db.transaction(store,'readwrite');
  tx.objectStore(store).put(record);
  tx.oncomplete=()=>resolve(record);
  tx.onerror=()=>reject(tx.error||new Error('Save failed'));
  tx.onabort=()=>reject(tx.error||new Error('Save cancelled'));
 });
}
export async function allRecords(store) {
 const db=await openDB();
 return new Promise((resolve,reject)=>{const tx=db.transaction(store,'readonly');const request=tx.objectStore(store).getAll();request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});
}

export async function deleteJobAndArchive(id){
 const db=await openDB();return new Promise((resolve,reject)=>{
  const tx=db.transaction(['jobs','comparisons'],'readwrite');
  tx.objectStore('jobs').delete(id);
  const request=tx.objectStore('comparisons').getAll();
  request.onsuccess=()=>{for(const item of request.result)if(item.payload.jobs.some(job=>job.id===id))tx.objectStore('comparisons').put({...item,historical:true,deletedIds:[...new Set([...(item.deletedIds||[]),id])]});};
  tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||new Error('Deletion cancelled.'));
 });
}
export async function removeComparison(id){const db=await openDB();return new Promise((resolve,reject)=>{const tx=db.transaction('comparisons','readwrite');tx.objectStore('comparisons').delete(id);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});}
export async function saveProfileAndArchive(record){
 const db=await openDB();return new Promise((resolve,reject)=>{
  const tx=db.transaction(['profile','comparisons'],'readwrite');tx.objectStore('profile').put(record);
  if(!record.currentJob){const request=tx.objectStore('comparisons').getAll();request.onsuccess=()=>{for(const item of request.result)if(item.payload.profile.currentJob)tx.objectStore('comparisons').put({...item,historical:true,baselineRemoved:true});};}
  tx.oncomplete=()=>resolve(record);tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||new Error('Profile save cancelled.'));
 });
}

// One transaction; stable IDs make repeated loads preserve all existing edits.
export async function addMissingJobs(records){
 const db=await openDB();return new Promise((resolve,reject)=>{
  const tx=db.transaction('jobs','readwrite'),store=tx.objectStore('jobs');let added=0;
  for(const record of records){const request=store.get(record.id);request.onsuccess=()=>{if(!request.result){store.add(record);added++;}};}
  tx.oncomplete=()=>resolve(added);tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||new Error('Sample load cancelled.'));
 });
}
