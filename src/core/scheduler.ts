import * as fs from 'fs';
import * as path from 'path';

interface Config {
 interval: number;
 enabled: boolean;
 theme: string;
 opacity: number;
 alwaysOnTop: boolean;
 centerPosition: boolean;
 reminderDuration: number;
 autoStart: boolean;
}

export class Scheduler {
 private configPath: string;
 private config!: Config;
 private timerId: NodeJS.Timeout | null = null;
 private onTimerCallback: (() => void) | null = null;

 constructor() {
   this.configPath = path.join(__dirname, '../storage/config.json');
   this.loadConfig();
 }

 private loadConfig(): void {
   try {
     const data = fs.readFileSync(this.configPath, 'utf-8');
     this.config = JSON.parse(data);
   } catch (error) {
     console.error('Error loading config:', error);
     // Default config
     this.config = {
       interval: 1800000, // 30 minutes
       enabled: true,
       theme: 'default',
       opacity: 0.95,
       alwaysOnTop: true,
       centerPosition: true,
       reminderDuration: 10000, // 10 seconds
       autoStart: true
     };
     this.saveConfig();
   }
 }

 private saveConfig(): void {
   try {
     fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
   } catch (error) {
     console.error('Error saving config:', error);
   }
 }

 public start(): void {
   if (!this.config.enabled) {
     console.log('Scheduler is disabled');
     return;
   }

   this.stop(); // Stop any existing timer

   console.log(`Starting scheduler with interval: ${this.config.interval}ms (${this.config.interval / 1000 / 60} minutes)`);
   
   this.timerId = setInterval(() => {
     if (this.onTimerCallback) {
       console.log('Timer triggered - showing reminder');
       this.onTimerCallback();
     }
   }, this.config.interval);
 }

 public stop(): void {
   if (this.timerId) {
     clearInterval(this.timerId);
     this.timerId = null;
     console.log('Scheduler stopped');
   }
 }

 public setCallback(callback: () => void): void {
   this.onTimerCallback = callback;
 }

 public triggerNow(): void {
   if (this.onTimerCallback) {
     console.log('Manual trigger - showing reminder');
     this.onTimerCallback();
   }
 }

 public updateInterval(newInterval: number): void {
   this.config.interval = newInterval;
   this.saveConfig();
   
   if (this.timerId) {
     this.start(); // Restart with new interval
   }
 }

 public toggle(): void {
   this.config.enabled = !this.config.enabled;
   this.saveConfig();
   
   if (this.config.enabled) {
     this.start();
   } else {
     this.stop();
   }
 }

 public getConfig(): Config {
   return { ...this.config };
 }

 public updateConfig(updates: Partial<Config>): void {
   this.config = { ...this.config, ...updates };
   this.saveConfig();
   
   // Restart if interval changed and scheduler is running
   if (updates.interval && this.timerId) {
     this.start();
   }
 }

 public isRunning(): boolean {
   return this.timerId !== null && this.config.enabled;
 }

 public getNextReminderTime(): Date | null {
   if (!this.isRunning()) {
     return null;
   }
   
   return new Date(Date.now() + this.config.interval);
 }
}