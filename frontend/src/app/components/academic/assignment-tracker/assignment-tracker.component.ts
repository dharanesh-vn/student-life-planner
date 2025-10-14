import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AcademicService, Course, Assignment } from '../../../services/academic.service';
import { format } from 'date-fns';

// Custom Validator Function
export function futureDateValidator(control: AbstractControl): { [key: string]: boolean } | null {
  if (control.value) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date to midnight
    const selectedDate = new Date(control.value);
    if (selectedDate < today) {
      return { 'pastDate': true }; // Return error if the date is in the past
    }
  }
  return null; // Return null if validation passes
}

@Component({
  selector: 'app-assignment-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './assignment-tracker.component.html',
  styleUrls: ['./assignment-tracker.component.css']
})
export class AssignmentTrackerComponent implements OnInit {
  assignments: Assignment[] = [];
  courses: Course[] = [];
  assignmentForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  today: string;

  constructor(
    private academicService: AcademicService,
    private fb: FormBuilder
  ) {
    this.today = format(new Date(), 'yyyy-MM-dd');
    this.assignmentForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      course: ['', Validators.required],
      dueDate: [this.today, [Validators.required, futureDateValidator]],
      status: ['To-Do', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.isLoading = true;
    this.academicService.getCourses().subscribe({
      next: courses => this.courses = courses,
      error: err => this.handleError('Could not load courses for the form.')
    });
    this.academicService.getAssignments().subscribe({
      next: assignments => {
        this.assignments = assignments;
        this.isLoading = false;
      },
      error: err => this.handleError('Could not load assignments.')
    });
  }
  
  get f() { return this.assignmentForm.controls; }

  onAddAssignment(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.assignmentForm.invalid) {
      this.handleError('Please fill out all required fields correctly.');
      this.assignmentForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.academicService.addAssignment(this.assignmentForm.value).subscribe({
      next: (createdAssignment) => {
        this.assignments.push(createdAssignment);
        this.assignments.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
        this.assignmentForm.reset({ status: 'To-Do', dueDate: this.today });
        this.handleSuccess('Assignment added successfully!');
      },
      error: (err) => {
        console.error("Error adding assignment:", err);
        this.handleError('Failed to add assignment. Please try again.');
      }
    });
  }

  toggleDone(assignment: Assignment): void {
    if (!assignment._id) return;
    const oldStatus = assignment.status;
    const newStatus = oldStatus === 'Done' ? 'In Progress' : 'Done';
    this.isLoading = true;
    assignment.status = newStatus;
    this.academicService.updateAssignment(assignment._id, { status: newStatus }).subscribe({
      next: updatedAssignment => {
        const index = this.assignments.findIndex(a => a._id === updatedAssignment._id);
        if (index !== -1) this.assignments[index] = updatedAssignment;
        this.handleSuccess('Status updated!');
      },
      error: err => {
        assignment.status = oldStatus;
        this.handleError('Failed to update status.');
      }
    });
  }

  onDelete(assignmentId: string | undefined): void {
    if (!assignmentId) return;
    if (confirm('Are you sure you want to delete this assignment?')) {
      this.isLoading = true;
      this.academicService.deleteAssignment(assignmentId).subscribe({
        next: () => {
          this.assignments = this.assignments.filter(a => a._id !== assignmentId);
          this.handleSuccess('Assignment deleted successfully!');
        },
        error: err => this.handleError('Failed to delete assignment.')
      });
    }
  }
  
  private handleError(message: string): void {
    this.errorMessage = message;
    this.isLoading = false;
    setTimeout(() => this.errorMessage = '', 4000);
  }

  private handleSuccess(message: string): void {
    this.successMessage = message;
    this.isLoading = false;
    setTimeout(() => this.successMessage = '', 3000);
  }
}