import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AcademicService, Course, Assignment } from '../../../services/academic.service';

type NewAssignmentForm = Omit<Assignment, '_id' | 'course'> & { course: string };

@Component({
  selector: 'app-assignment-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assignment-tracker.component.html',
  styleUrls: ['./assignment-tracker.component.css']
})
export class AssignmentTrackerComponent implements OnInit {
  assignments: Assignment[] = [];
  courses: Course[] = [];
  newAssignment: NewAssignmentForm = { title: '', dueDate: '', status: 'To-Do', course: '' };
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  today: string = ''; // For HTML input [min]

  constructor(private academicService: AcademicService) {}

  ngOnInit(): void {
    this.loadInitialData();
    this.today = this.getTodayDate(); // Initialize today for HTML
  }

  // Helper method to get today's date in YYYY-MM-DD format
  private getTodayDate(): string {
    const now = new Date();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    return `${now.getFullYear()}-${month}-${day}`;
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

  onAddAssignment(): void {
    this.errorMessage = '';
    this.successMessage = '';

    // Use helper method for date validation
    const todayDate = new Date(this.getTodayDate());
    todayDate.setHours(0, 0, 0, 0);
    const selectedDate = new Date(this.newAssignment.dueDate);

    if (selectedDate < todayDate) {
      this.handleError('Due date cannot be in the past.');
      return;
    }

    if (!this.newAssignment.title.trim() || !this.newAssignment.dueDate || !this.newAssignment.course) {
      this.handleError('Please fill out all required fields: Title, Course, and Due Date.');
      return;
    }

    this.isLoading = true;
    this.academicService.addAssignment(this.newAssignment).subscribe({
      next: (createdAssignment) => {
        this.assignments.push(createdAssignment);
        this.assignments.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
        this.newAssignment = { title: '', dueDate: '', status: 'To-Do', course: '' };
        this.handleSuccess('Assignment added successfully!');
      },
      error: err => {
        console.error("Error adding assignment:", err);
        this.handleError('Failed to add assignment. Please check the console for details.');
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
