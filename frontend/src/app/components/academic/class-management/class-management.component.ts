import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AcademicService, Course } from '../../../services/academic.service';

@Component({
  selector: 'app-class-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './class-management.component.html',
  styleUrls: ['./class-management.component.css']
})
export class ClassManagementComponent implements OnInit {
  courses: Course[] = [];
  courseData: Course = { courseName: '', instructor: '', scheduleDays: [], scheduleStartTime: '', scheduleEndTime: '' };
  daySelection: { [key: string]: boolean } = {
    Monday: false, Tuesday: false, Wednesday: false, Thursday: false, Friday: false, Saturday: false, Sunday: false
  };
  isEditMode = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private academicService: AcademicService) { }

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
      error: (err) => this.handleError('Failed to load courses.')
    });
  }

  updateSelectedDays(): void {
    this.courseData.scheduleDays = Object.entries(this.daySelection)
      .filter(([day, isSelected]) => isSelected)
      .map(([day]) => day);
  }

  onSubmitCourse(): void {
    this.updateSelectedDays();
    if (!this.courseData.courseName.trim()) {
      this.handleError('Course Name cannot be empty.');
      return;
    }
    this.isLoading = true;
    if (this.isEditMode) {
      this.academicService.updateCourse(this.courseData._id!, this.courseData).subscribe({
        next: (updatedCourse) => {
          const index = this.courses.findIndex(c => c._id === updatedCourse._id);
          if (index !== -1) this.courses[index] = updatedCourse;
          this.handleSuccess('Course updated successfully!');
          this.resetForm();
        },
        error: (err) => this.handleError('Failed to update course.')
      });
    } else {
      this.academicService.addCourse(this.courseData).subscribe({
        next: (course) => {
          this.courses.unshift(course);
          this.handleSuccess('Course added successfully!');
          this.resetForm();
        },
        error: (err) => this.handleError('Failed to add course.')
      });
    }
  }

  onEdit(course: Course): void {
    this.isEditMode = true;
    this.courseData = { ...course };
    Object.keys(this.daySelection).forEach(day => {
      this.daySelection[day] = this.courseData.scheduleDays.includes(day);
    });
    window.scrollTo(0, 0);
  }

  onDelete(courseId: string | undefined): void {
    if (!courseId) return;
    if (confirm('Are you sure you want to delete this course? This will also delete all its assignments.')) {
      this.isLoading = true;
      this.academicService.deleteCourse(courseId).subscribe({
        next: () => {
          this.courses = this.courses.filter(c => c._id !== courseId);
          this.handleSuccess('Course deleted successfully!');
        },
        error: (err) => this.handleError('Failed to delete course.')
      });
    }
  }

  resetForm(): void {
    this.isEditMode = false;
    this.courseData = { courseName: '', instructor: '', scheduleDays: [], scheduleStartTime: '', scheduleEndTime: '' };
    Object.keys(this.daySelection).forEach(day => this.daySelection[day] = false);
  }

  get days(): string[] {
    return Object.keys(this.daySelection);
  }
  
  private handleError(message: string): void { this.errorMessage = message; this.isLoading = false; setTimeout(() => this.errorMessage = '', 3000); }
  private handleSuccess(message: string): void { this.successMessage = message; this.isLoading = false; setTimeout(() => this.successMessage = '', 3000); }
}