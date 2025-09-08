import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
 closePopup: () => ipcRenderer.send('close-popup'),
 onDisplayThought: (callback: (thought: any) => void) => {
   ipcRenderer.on('display-thought', (event, thought) => callback(thought));
 },
 removeAllListeners: (channel: string) => {
   ipcRenderer.removeAllListeners(channel);
 }
});

// Custom types for TypeScript
declare global {
 interface Window {
   electronAPI: {
     closePopup: () => void;
     onDisplayThought: (callback: (thought: any) => void) => void;
     removeAllListeners: (channel: string) => void;
   };
 }
}