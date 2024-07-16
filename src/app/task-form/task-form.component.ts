import { Component } from '@angular/core';
import { TaskService, Task } from '../task.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent {
  title: string = '';
  description: string = '';
  dueDate: string = '';
  priority: string = 'low';

  constructor(private taskService: TaskService, private router: Router) {}

  addTask(): void {
    const newTask: Task = {
      id: this.generateId(),
      title: this.title,
      description: this.description,
      dueDate: this.dueDate,
      priority: this.priority,
      status: 'to-do',
      history: [`Task created on ${new Date().toISOString()}`]
    };
    this.taskService.addTask(newTask);
    this.resetForm();
    this.router.navigate(['/']); // Navigate to TaskListComponent after adding task
  }

  generateId(): string {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  resetForm(): void {
    this.title = '';
    this.description = '';
    this.dueDate = '';
    this.priority = 'low';
  }
}
