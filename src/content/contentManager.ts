import * as fs from 'fs';
import * as path from 'path';

interface Thought {
 id: number;
 text: string;
 translation: string;
 source: string;
 reference: string;
}

interface ThoughtsData {
 thoughts: Thought[];
}

interface State {
 lastShown: string | null;
 currentThoughtIndex: number;
 totalThoughtsShown: number;
 streakDays: number;
 lastActiveDate: string | null;
}

export class ContentManager {
  private thoughtsPath: string;
  private statePath: string;
  private thoughts: Thought[] = [];
  private state!: State;

 constructor() {
   this.thoughtsPath = path.join(__dirname, '../content/thoughts.json');
   this.statePath = path.join(__dirname, '../storage/state.json');
   this.loadThoughts();
   this.loadState();
 }

 private loadThoughts(): void {
   try {
     const data = fs.readFileSync(this.thoughtsPath, 'utf-8');
     const thoughtsData: ThoughtsData = JSON.parse(data);
     this.thoughts = thoughtsData.thoughts;
   } catch (error) {
     console.error('Error loading thoughts:', error);
     this.thoughts = [];
   }
 }

 private loadState(): void {
    try {
      const data = fs.readFileSync(this.statePath, 'utf-8');
      this.state = JSON.parse(data);
    } catch (error) {
      console.error('Error loading state:', error);
      this.state = {
        lastShown: null,
        currentThoughtIndex: -1,
        totalThoughtsShown: 0,
        streakDays: 0,
        lastActiveDate: null
      };
    }
  }

 private saveState(): void {
    try {
      fs.mkdirSync(path.dirname(this.statePath), { recursive: true });
      fs.writeFileSync(this.statePath, JSON.stringify(this.state, null, 2));
    } catch (error) {
      console.error('Error saving state:', error);
    }
  }

 public getTodaysThought(): Thought | null {
   if (this.thoughts.length === 0) {
     return null;
   }

   // Get today's date
   const today = new Date().toDateString();
   
   // Check if we've already shown a thought today
   if (this.state.lastShown === today) {
     // Return the same thought for today
     return this.thoughts[this.state.currentThoughtIndex];
   }

   // Move to next thought
   this.state.currentThoughtIndex = (this.state.currentThoughtIndex + 1) % this.thoughts.length;
   this.state.lastShown = today;
   this.state.totalThoughtsShown++;
   
   // Update streak
   const lastDate = this.state.lastActiveDate ? new Date(this.state.lastActiveDate) : null;
   const todayDate = new Date();
   
   if (lastDate) {
     const daysDiff = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
     if (daysDiff === 1) {
       this.state.streakDays++;
     } else if (daysDiff > 1) {
       this.state.streakDays = 1;
     }
   } else {
     this.state.streakDays = 1;
   }
   
   this.state.lastActiveDate = today;
   this.saveState();

   return this.thoughts[this.state.currentThoughtIndex];
 }

 public getRandomThought(): Thought | null {
   if (this.thoughts.length === 0) {
     return null;
   }

   const randomIndex = Math.floor(Math.random() * this.thoughts.length);
   return this.thoughts[randomIndex];
 }

 public getStats(): { totalThoughts: number; currentStreak: number; totalShown: number } {
   return {
     totalThoughts: this.thoughts.length,
     currentStreak: this.state.streakDays,
     totalShown: this.state.totalThoughtsShown
   };
 }
}