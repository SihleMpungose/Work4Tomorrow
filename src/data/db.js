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
