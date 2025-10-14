import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { AcademicService, Course, Note } from '../../services/academic.service';
import { AiService, AiAction } from '../../services/ai.service';

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MarkdownModule,
    RouterModule
  ],
  templateUrl: './ai-assistant.component.html',
  styleUrls: ['./ai-assistant.component.css']
})
export class AiAssistantComponent implements OnInit {
  courses: Course[] = [];
  selectedCourseId: string = '';
  
  notesForSelectedCourse: Note[] = [];

  isLoading = false;
  isLoadingNotes = false;
  aiResult: string = '';
  currentAction: AiAction | null = null;
  errorMessage: string = '';

  constructor(
    private academicService: AcademicService,
    private aiService: AiService
  ) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.isLoading = true;
    this.academicService.getCourses().subscribe({
      next: (data) => {
        this.courses = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Could not load your courses. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  onCourseSelectionChange(): void {
    this.aiResult = '';
    this.notesForSelectedCourse = [];
    if (this.selectedCourseId) {
      this.isLoadingNotes = true;
      this.academicService.getNotesForCourse(this.selectedCourseId).subscribe({
        next: (notes) => {
          this.notesForSelectedCourse = notes;
          this.isLoadingNotes = false;
        },
        error: (err) => {
          this.errorMessage = 'Could not fetch notes for this course.';
          this.isLoadingNotes = false;
        }
      });
    }
  }

  onProcessRequest(action: AiAction): void {
    if (!this.selectedCourseId) {
      this.errorMessage = 'Please select a course first.';
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }

    if (this.notesForSelectedCourse.length === 0) {
      this.errorMessage = 'There are no notes for this course to process. Please add some notes first.';
      setTimeout(() => this.errorMessage = '', 4000);
      return;
    }

    this.isLoading = true;
    this.currentAction = action;
    this.aiResult = '';
    this.errorMessage = '';

    this.aiService.processNotes(this.selectedCourseId, action).subscribe({
      next: (response) => {
        this.aiResult = response.result;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'An error occurred while communicating with the AI service.';
        this.isLoading = false;
      }
    });
  }

  formatActionName(action: string | null): string {
    if (!action) return '';
    return action.replace('-', ' ').replace(/\b\w/g, char => char.toUpperCase());
  }
}