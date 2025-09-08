import { BrowserWindow, screen } from 'electron';
import * as path from 'path';

export class PopupManager {
 private popupWindow: BrowserWindow | null = null;
 private onClosedCallback: (() => void) | null = null;

 public createPopup(thought: any, config: any): void {
   // Close existing popup if any
   this.closePopup();

   const { width, height } = screen.getPrimaryDisplay().workAreaSize;
   
   // Popup dimensions
   const popupWidth = 500;
   const popupHeight = 300;
   
   // Calculate center position
   const x = Math.round((width - popupWidth) / 2);
   const y = Math.round((height - popupHeight) / 2);

   this.popupWindow = new BrowserWindow({
     width: popupWidth,
     height: popupHeight,
     x: config.centerPosition ? x : undefined,
     y: config.centerPosition ? y : undefined,
     alwaysOnTop: config.alwaysOnTop,
     frame: false,
     resizable: false,
     movable: true,
     minimizable: false,
     maximizable: false,
     fullscreenable: false,
     opacity: config.opacity,
     backgroundColor: '#f8f9fa',
     show: false,
     skipTaskbar: true,
     webPreferences: {
       nodeIntegration: false,
       contextIsolation: true,
       preload: path.join(__dirname, '../preload.js')
     }
   });

   // Load the popup HTML
   this.popupWindow.loadFile(path.join(__dirname, '../ui/popup.html'));

   // Show the window when ready
   this.popupWindow.once('ready-to-show', () => {
     if (this.popupWindow) {
       this.popupWindow.show();
       this.popupWindow.focus();
       
       // Send the thought data to the renderer
       this.popupWindow.webContents.send('display-thought', thought);
     }
   });

   // Handle window closed
   this.popupWindow.on('closed', () => {
     this.popupWindow = null;
     if (this.onClosedCallback) {
       this.onClosedCallback();
     }
   });

   // Auto-close after configured duration (if no user interaction)
   if (config.reminderDuration > 0) {
     setTimeout(() => {
       if (this.popupWindow && !this.popupWindow.isDestroyed()) {
         this.closePopup();
       }
     }, config.reminderDuration);
   }

   // Handle IPC messages from renderer
   this.popupWindow.webContents.on('ipc-message', (event, channel, ...args) => {
     if (channel === 'close-popup') {
       this.closePopup();
     }
   });
 }

 public closePopup(): void {
   if (this.popupWindow && !this.popupWindow.isDestroyed()) {
     this.popupWindow.close();
   }
   this.popupWindow = null;
 }

 public setOnClosedCallback(callback: () => void): void {
   this.onClosedCallback = callback;
 }

 public isPopupOpen(): boolean {
   return this.popupWindow !== null && !this.popupWindow.isDestroyed();
 }

 public focusPopup(): void {
   if (this.popupWindow && !this.popupWindow.isDestroyed()) {
     this.popupWindow.focus();
     this.popupWindow.show();
   }
 }

 public movePopup(x: number, y: number): void {
   if (this.popupWindow && !this.popupWindow.isDestroyed()) {
     this.popupWindow.setPosition(x, y);
   }
 }

 public setOpacity(opacity: number): void {
   if (this.popupWindow && !this.popupWindow.isDestroyed()) {
     this.popupWindow.setOpacity(opacity);
   }
 }
}