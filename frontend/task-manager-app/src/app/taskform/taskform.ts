import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Api } from '../service/api';

@Component({
  selector: 'app-taskform',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './taskform.html',
  styleUrl: './taskform.css',
})
export class Taskform {

  taskForm: FormGroup;
  error: string = '';
  isEdit: boolean = false;
  taskId: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private apiService:Api,
    private route:ActivatedRoute,
    private router: Router
  ){
    this.taskForm = this.formBuilder.group({
      title: ['', Validators.required],  // Title is required
      description: [''],
      dueDate: [''],
      priority: ['MEDIUM'],  // Default priority
      completed: [false]     // Default completion status
    });
  }

  ngOnInit(): void {
    this.taskId = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.taskId;
    if (this.isEdit && this.taskId) {
      this.fetchTask(this.taskId);
    }
  }

  fetchTask(id: string): void {
    this.apiService.getTaskById(id).subscribe({
      next: (res) => {
        if (res.statusCode === 200) {
          this.taskForm.patchValue({
            title: res.data.title,
            description: res.data.description,
            dueDate: this.formatDateForInput(res.data.dueDate),
            priority: res.data.priority,
            completed: res.data.completed
          });
        } else {
          this.error = res.message || 'Failed to fetch task';
        }
      },
      error: (error) => {
        this.error = error.error?.message || error.message || 'Error fetching task';
      }
    });
  }

  
  formatDateForInput(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  
  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.error = 'Title is required';
      return;
    }

    
    const formData = this.taskForm.value; 
    this.error = '';

    if (this.isEdit && this.taskId) { 
      formData.id = this.taskId;
      this.apiService.updateTask(formData).subscribe({
        next: (res) => {
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          this.error = error.error?.message || error.message || 'Error updating task';
        }
      });
    } else {
      this.apiService.createTask(formData).subscribe({
        next: (res) => {
          this.router.navigate(['/tasks']).then(()=>{
            window.location.reload();// slow down when created
          })
        },
        error: (error) => {
          this.error = error.error?.message || error.message || 'Error creating task';
        }
      });
    }
  }

  onDelete(): void {
    if (!this.taskId) return;
    const confirmDelete = confirm("Are you sure you want to delete this task?");
    if (confirmDelete) {
      this.apiService.deleteTask(this.taskId).subscribe({
        next: () => {
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          this.error = error.error?.message || error.message || 'Error deleting task';
        }
      });
    }
  }
}
