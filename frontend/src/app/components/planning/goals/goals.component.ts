import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlanningService, Goal } from '../../../services/planning.service';

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.css']
})
export class GoalsComponent implements OnInit {
  goals: Goal[] = [];
  goalData: Goal = this.getInitialGoalData();
  
  isEditMode = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private planningService: PlanningService) {}

  ngOnInit(): void {
    this.loadGoals();
  }

  loadGoals(): void {
    this.isLoading = true;
    this.planningService.getGoals().subscribe({
      next: (data) => {
        this.goals = data;
        this.isLoading = false;
      },
      error: (err) => this.handleError('Failed to load goals.')
    });
  }

  onSubmitGoal(): void {
    if (!this.goalData.title.trim()) {
      this.handleError('Goal title is required.');
      return;
    }
    this.isLoading = true;
    if (this.isEditMode) {
      this.planningService.updateGoal(this.goalData._id!, this.goalData).subscribe({
        next: (updatedGoal) => {
          const index = this.goals.findIndex(g => g._id === updatedGoal._id);
          this.goals[index] = updatedGoal;
          this.handleSuccess('Goal updated!');
          this.resetForm();
        },
        error: (err) => this.handleError('Failed to update goal.')
      });
    } else {
      this.planningService.addGoal(this.goalData).subscribe({
        next: (newGoal) => {
          this.goals.unshift(newGoal);
          this.handleSuccess('Goal added!');
          this.resetForm();
        },
        error: (err) => this.handleError('Failed to add goal.')
      });
    }
  }

  onEdit(goal: Goal): void {
    this.isEditMode = true;
    this.goalData = { ...goal };
    window.scrollTo(0, 0);
  }

  onDelete(goalId: string | undefined): void {
    if (!goalId) return;
    if (confirm('Are you sure you want to delete this goal?')) {
      this.isLoading = true;
      this.planningService.deleteGoal(goalId).subscribe({
        next: () => {
          this.goals = this.goals.filter(g => g._id !== goalId);
          this.handleSuccess('Goal deleted!');
        },
        error: (err) => this.handleError('Failed to delete goal.')
      });
    }
  }

  resetForm(): void {
    this.isEditMode = false;
    this.goalData = this.getInitialGoalData();
  }
  
  getInitialGoalData(): Goal {
    return { title: '', description: '', category: 'Personal', status: 'Not Started' };
  }
  
  private handleError(message: string): void { this.errorMessage = message; this.isLoading = false; setTimeout(() => this.errorMessage = '', 3000); }
  private handleSuccess(message: string): void { this.successMessage = message; this.isLoading = false; setTimeout(() => this.successMessage = '', 2000); }
}