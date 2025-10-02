import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type TimerState = 'work' | 'shortBreak' | 'longBreak';

interface PomodoroState {
  minutes: number;
  seconds: number;
  timerState: TimerState;
  cycles: number;
  timerOn: boolean;
  timestamp: number;
}

@Component({
  selector: 'app-pomodoro-timer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pomodoro-timer.component.html',
  styleUrls: ['./pomodoro-timer.component.css']
})
export class PomodoroTimerComponent implements OnDestroy, OnInit {
  minutes = 25;
  seconds = 0;
  timerOn = false;
  timerState: TimerState = 'work';
  cycles = 0;

  workDuration = 25;
  shortBreakDuration = 5;
  longBreakDuration = 15;
  showSettings = false;

  private timer: any;
  private alarmSound!: HTMLAudioElement;

  ngOnInit(): void {
    if (typeof Audio !== 'undefined') {
      this.alarmSound = new Audio('/assets/alarm.mp3');
    }
    this.loadState();
  }

  ngOnDestroy(): void {
    this.pauseTimer();
  }

  // --- State Persistence Logic ---
  saveState(): void {
    const state: PomodoroState = {
      minutes: this.minutes,
      seconds: this.seconds,
      timerState: this.timerState,
      cycles: this.cycles,
      timerOn: this.timerOn,
      timestamp: Date.now()
    };
    localStorage.setItem('pomodoroState', JSON.stringify(state));
  }

  loadState(): void {
    const savedStateJSON = localStorage.getItem('pomodoroState');
    if (savedStateJSON) {
      const savedState: PomodoroState = JSON.parse(savedStateJSON);
      
      this.timerState = savedState.timerState;
      this.cycles = savedState.cycles;
      this.timerOn = savedState.timerOn;

      const elapsedSeconds = this.timerOn ? Math.floor((Date.now() - savedState.timestamp) / 1000) : 0;
      const remainingTotalSeconds = (savedState.minutes * 60 + savedState.seconds) - elapsedSeconds;

      if (remainingTotalSeconds <= 0) {
        this.switchState(undefined, false, false);
      } else {
        this.minutes = Math.floor(remainingTotalSeconds / 60);
        this.seconds = remainingTotalSeconds % 60;
        if (this.timerOn) {
          this.startTimer();
        }
      }
    } else {
      this.minutes = this.workDuration;
      this.seconds = 0;
    }
  }

  clearState(): void {
    localStorage.removeItem('pomodoroState');
  }

  // --- Timer Control Logic ---
  toggleTimer(): void {
    this.timerOn = !this.timerOn;
    if (this.timerOn) {
      this.startTimer();
    } else {
      this.pauseTimer();
    }
  }

  startTimer(): void {
    this.saveState();
    this.timer = setInterval(() => {
      if (this.seconds > 0) {
        this.seconds--;
      } else if (this.minutes > 0) {
        this.minutes--;
        this.seconds = 59;
      } else {
        if (this.alarmSound) this.alarmSound.play();
        this.switchState();
      }
    }, 1000);
  }

  pauseTimer(): void {
    clearInterval(this.timer);
    this.saveState();
  }

  resetTimer(): void {
    this.pauseTimer();
    this.timerOn = false;
    this.clearState();
    this.switchState('work', true);
  }

  switchState(newState?: TimerState, forceReset = false, shouldStart = false): void {
    this.pauseTimer();
    this.timerOn = false;

    if (forceReset) {
      this.cycles = 0;
      this.timerState = 'work';
      this.minutes = this.workDuration;
    } else if (this.timerState === 'work') {
      this.cycles++;
      this.timerState = (this.cycles > 0 && this.cycles % 4 === 0) ? 'longBreak' : 'shortBreak';
      this.minutes = this.timerState === 'longBreak' ? this.longBreakDuration : this.shortBreakDuration;
    } else {
      this.timerState = 'work';
      this.minutes = this.workDuration;
    }
    this.seconds = 0;
    this.saveState();
  }

  applySettings(): void {
    this.showSettings = false;
    this.resetTimer();
  }

  // THIS IS THE CORRECTED GETTER FUNCTION
  get formattedState(): string {
    switch (this.timerState) {
      case 'work':
        return 'Time to Work!';
      case 'shortBreak':
        return 'Take a Short Break';
      case 'longBreak':
        return 'Take a Long Break';
    }
  }
}

