import { app, BrowserWindow, ipcMain, Menu, Tray, nativeImage } from 'electron';
import * as path from 'path';
import { Scheduler } from './core/scheduler';
import { PopupManager } from './core/popupManager';
import { ContentManager } from './content/contentManager';

class ThoughtReminderApp {
 private scheduler: Scheduler;
 private popupManager: PopupManager;
 private contentManager: ContentManager;
 private tray: Tray | null = null;

 constructor() {
   this.scheduler = new Scheduler();
   this.popupManager = new PopupManager();
   this.contentManager = new ContentManager();

   this.setupEventHandlers();
 }

 private setupEventHandlers(): void {
   // App event handlers
   app.whenReady().then(() => {
     this.createTray();
     this.startApp();
   });

   app.on('window-all-closed', () => {
     // Keep app running in background on all platforms
     // Don't quit the app when all windows are closed
   });

   app.on('activate', () => {
     // On macOS, show the app when clicked in dock
     this.showReminder();
   });

   app.on('before-quit', () => {
     this.scheduler.stop();
   });

   // IPC handlers
   ipcMain.on('close-popup', () => {
     this.popupManager.closePopup();
   });

   // Scheduler callback
   this.scheduler.setCallback(() => {
     this.showReminder();
   });

   // Popup manager callback
   this.popupManager.setOnClosedCallback(() => {
     console.log('Popup closed by user');
   });
 }

 private createTray(): void {
   // Create a simple icon for the tray (you can replace with an actual icon file)
   const icon = nativeImage.createFromDataURL('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
   
   this.tray = new Tray(icon);
   this.tray.setToolTip('Thought Reminder');

   const contextMenu = Menu.buildFromTemplate([
     {
       label: 'Show Reminder Now',
       click: () => this.showReminder()
     },
     {
       label: 'Toggle Scheduler',
       click: () => {
         this.scheduler.toggle();
         this.updateTrayMenu();
       }
     },
     { type: 'separator' },
     {
       label: 'Statistics',
       click: () => this.showStats()
     },
     { type: 'separator' },
     {
       label: 'Quit',
       click: () => {
         this.scheduler.stop();
         app.quit();
       }
     }
   ]);

   this.tray.setContextMenu(contextMenu);
   this.tray.on('click', () => {
     this.showReminder();
   });
 }

 private updateTrayMenu(): void {
   if (!this.tray) return;

   const isRunning = this.scheduler.isRunning();
   const contextMenu = Menu.buildFromTemplate([
     {
       label: 'Show Reminder Now',
       click: () => this.showReminder()
     },
     {
       label: isRunning ? 'Pause Scheduler' : 'Resume Scheduler',
       click: () => {
         this.scheduler.toggle();
         this.updateTrayMenu();
       }
     },
     { type: 'separator' },
     {
       label: 'Statistics',
       click: () => this.showStats()
     },
     { type: 'separator' },
     {
       label: 'Quit',
       click: () => {
         this.scheduler.stop();
         app.quit();
       }
     }
   ]);

   this.tray.setContextMenu(contextMenu);
 }

 private startApp(): void {
   console.log('Thought Reminder App started');
   
   const config = this.scheduler.getConfig();
   if (config.autoStart) {
     this.scheduler.start();
     console.log('Scheduler auto-started');
   }

   // Show initial reminder after 5 seconds
   setTimeout(() => {
     this.showReminder();
   }, 5000);
 }

 private showReminder(): void {
   // Don't show if popup is already open
   if (this.popupManager.isPopupOpen()) {
     this.popupManager.focusPopup();
     return;
   }

   const thought = this.contentManager.getTodaysThought();
   if (!thought) {
     console.error('No thought available');
     return;
   }

   const config = this.scheduler.getConfig();
   this.popupManager.createPopup(thought, config);
 }

 private showStats(): void {
   const stats = this.contentManager.getStats();
   const config = this.scheduler.getConfig();
   const isRunning = this.scheduler.isRunning();
   const nextReminder = this.scheduler.getNextReminderTime();

   console.log('=== Thought Reminder Statistics ===');
   console.log(`Total thoughts available: ${stats.totalThoughts}`);
   console.log(`Total thoughts shown: ${stats.totalShown}`);
   console.log(`Current streak: ${stats.currentStreak} days`);
   console.log(`Scheduler running: ${isRunning}`);
   console.log(`Reminder interval: ${config.interval / 1000 / 60} minutes`);
   if (nextReminder) {
     console.log(`Next reminder: ${nextReminder.toLocaleString()}`);
   }
   console.log('================================');
 }
}

// Create and start the app
new ThoughtReminderApp();