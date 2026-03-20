import { Component } from '@angular/core';
import { Api } from '../service/api';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tasks',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks {

  tasks: any[] = [];
  filteredTasks: any[] = [];
  error: string = '';
  priorityFilter: string = 'ALL';
  completionFilter: string = 'ALL';
  isLoading: boolean = false;

  constructor(private apiService:Api, private router:Router){
  }

  ngOnInit(): void {
    if (!this.apiService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.fetchTasks();
  }


  
fetchTasks(): void {
  this.isLoading = true;
  this.apiService.getAllMyTasks().subscribe({
    next: (res) => {
      console.log("Raw API Response:", res); 
      if (res.statusCode === 200) {
        this.tasks = res.data; 
        console.log("Tasks assigned:", this.tasks.length);
        this.applyFilters(); 
      }
      this.isLoading = false;
    },
    error: (err) => {
      console.error("Fetch Error:", err);
      this.isLoading = false;
    }
  });
}


applyFilters(): void {
  
  if (!this.tasks || this.tasks.length === 0) {
    this.filteredTasks = [];
    return;
  }

  let result = [...this.tasks];

  if (this.completionFilter !== 'ALL') {
    const isCompleted = this.completionFilter === 'COMPLETED';
    result = result.filter(t => t.completed === isCompleted);
  }

  if (this.priorityFilter !== 'ALL') {
    result = result.filter(t => 
      t.priority?.toString().toUpperCase() === this.priorityFilter.toUpperCase()
    );
  }

  this.filteredTasks = result;
  
  if (this.priorityFilter === 'ALL' && this.completionFilter === 'ALL' && this.filteredTasks.length === 0) {
    this.filteredTasks = [...this.tasks];
  }
}

  
  private applyPriorityFilter(currentResult: any[]): void {
    this.apiService.getMyTasksByPriority(this.priorityFilter).subscribe({
      next: (res) => {
        if (res.statusCode === 200) {
          if (this.completionFilter !== 'ALL') {
            const priorityTasks = res.data;
            currentResult = currentResult.filter(task => 
              priorityTasks.some((pt: any) => pt.id === task.id)
            );
          } else {
            currentResult = res.data;
          }
          this.filteredTasks = currentResult;
        }
      },
      error: (error) => {
        this.error = error.error?.message || error.message || 'Error applying priority filter';
      }
    });
  }

  
  toggleComplete(task: any): void {
    this.apiService.updateTask({
      id: task.id,
      completed: !task.completed
    }).subscribe({
      next: (res) => {
        if (res.statusCode === 200) {
          this.tasks = this.tasks.map(t =>
            t.id === task.id ? { ...t, completed: !t.completed } : t
          );
          this.applyFilters();
        }
      },
      error: (error) => {
        this.error = error.error?.message || error.message || 'Error updating task';
      }
    });
  }

  resetFilters(): void {
    this.priorityFilter = 'ALL';
    this.completionFilter = 'ALL';
    this.applyFilters();
  }
}
