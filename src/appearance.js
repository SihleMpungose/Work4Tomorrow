// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2026 Sihle Mpungose
const appearanceDefaults={theme:'system',textSize:'standard',palette:'standard',highContrast:false,reducedMotion:false};
const appearanceKey='work4tomorrow.appearance.v1';
let appearanceSettings={...appearanceDefaults};
try{const saved=JSON.parse(localStorage.getItem(appearanceKey)||'{}');for(const key of ['theme','textSize','palette']){const allowed={theme:['system','light','dark'],textSize:['standard','large','extra'],palette:['standard','red-green','blue-yellow']};if(allowed[key].includes(saved[key]))appearanceSettings[key]=saved[key];}for(const key of ['highContrast','reducedMotion'])if(typeof saved[key]==='boolean')appearanceSettings[key]=saved[key];}catch{}
export function getAppearance(){return {...appearanceSettings};}
export function applyAppearance(){
 const root=document.documentElement;
 root.dataset.theme=appearanceSettings.theme==='system'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):appearanceSettings.theme;
 root.dataset.textSize=appearanceSettings.textSize;root.dataset.palette=appearanceSettings.palette;root.dataset.contrast=appearanceSettings.highContrast?'high':'normal';
 root.dataset.motion=appearanceSettings.reducedMotion||matchMedia('(prefers-reduced-motion: reduce)').matches?'reduced':'normal';
}
export function updateAppearance(changes){appearanceSettings={...appearanceSettings,...changes};applyAppearance();try{localStorage.setItem(appearanceKey,JSON.stringify(appearanceSettings));return true;}catch{return false;}}
export function resetAppearance(){return updateAppearance({...appearanceDefaults});}
export function setupAppearance(){applyAppearance();for(const query of ['(prefers-color-scheme: dark)','(prefers-reduced-motion: reduce)'])matchMedia(query).addEventListener('change',applyAppearance);}
