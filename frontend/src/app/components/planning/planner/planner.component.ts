import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlanningService, Task } from '../../../services/planning.service';
// This import will now work correctly
import { format, parseISO } from 'date-fns';

@Component({
  selector: 'app-planner',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './planner.component.html',
  styleUrls: ['./planner.component.css']
})
export class PlannerComponent implements OnInit {
  allTasks: Task[] = [];
  filteredTasks: Task[] = [];
  
  selectedDate: string = format(new Date(), 'yyyy-MM-dd');
  newTaskTitle: string = '';

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private planningService: PlanningService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.isLoading = true;
    this.planningService.getTasks().subscribe({
      next: (tasks) => {
        this.allTasks = tasks;
        this.filterTasksForSelectedDate();
        this.isLoading = false;
      },
      error: (err) => this.handleError('Failed to load tasks.')
    });
  }

  filterTasksForSelectedDate(): void {
    const selected = new Date(this.selectedDate + 'T00:00:00');
    this.filteredTasks = this.allTasks.filter(task => {
      const taskDate = parseISO(task.dueDate);
      return (
        taskDate.getDate() === selected.getDate() &&
        taskDate.getMonth() === selected.getMonth() &&
        taskDate.getFullYear() === selected.getFullYear()
      );
    });
  }

  onDateChange(): void {
    this.filterTasksForSelectedDate();
  }

  onAddTask(): void {
    if (!this.newTaskTitle.trim() || !this.selectedDate) {
      this.handleError('Task title and date are required.');
      return;
    }
    this.isLoading = true;
    const newTask: Partial<Task> = {
      title: this.newTaskTitle,
      dueDate: this.selectedDate,
      isCompleted: false,
    };
    this.planningService.addTask(newTask).subscribe({
      next: (createdTask) => {
        this.allTasks.push(createdTask);
        this.filterTasksForSelectedDate();
        this.newTaskTitle = '';
        this.handleSuccess('Task added!');
      },
      error: (err) => this.handleError('Failed to add task.')
    });
  }

  toggleTaskCompletion(task: Task): void {
    if (!task._id) return;
    this.isLoading = true;
    const updatedStatus = !task.isCompleted;
    this.planningService.updateTask(task._id, { isCompleted: updatedStatus }).subscribe({
      next: (updatedTask) => {
        task.isCompleted = updatedTask.isCompleted;
        this.handleSuccess('Task updated!');
      },
      error: (err) => this.handleError('Failed to update task.')
    });
  }

  onDeleteTask(taskId: string | undefined): void {
    if (!taskId) return;
    this.isLoading = true;
    this.planningService.deleteTask(taskId).subscribe({
      next: () => {
        this.allTasks = this.allTasks.filter(t => t._id !== taskId);
        this.filterTasksForSelectedDate();
        this.handleSuccess('Task deleted!');
      },
      error: (err) => this.handleError('Failed to delete task.')
    });
  }
  
  private handleError(message: string): void { this.errorMessage = message; this.isLoading = false; setTimeout(() => this.errorMessage = '', 3000); }
  private handleSuccess(message: string): void { this.successMessage = message; this.isLoading = false; setTimeout(() => this.successMessage = '', 2000); }
}