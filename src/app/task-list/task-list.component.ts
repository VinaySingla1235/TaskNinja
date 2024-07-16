import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TaskService, Task } from '../task.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  filter: string = '';
  sortCriteria: string = '';
  private tasksSubscription: Subscription = new Subscription();

  constructor(
    private taskService: TaskService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.tasksSubscription = this.taskService.tasks$.subscribe((tasks) => {
        this.tasks = tasks;
        this.applyFiltersAndSort();
      });
    }
  }

  ngOnDestroy(): void {
    if (this.tasksSubscription) {
      this.tasksSubscription.unsubscribe();
    }
  }

  applyFiltersAndSort(): void {
    this.filteredTasks = [...this.tasks];

    if (this.filter) {
      this.filteredTasks = this.filteredTasks.filter(task => task.status === this.filter);
    }

    if (this.sortCriteria === 'dueDate') {
      this.filteredTasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    } else if (this.sortCriteria === 'priority') {
      const priorityOrder: { [key: string]: number } = { 'low': 3, 'medium': 2, 'high': 1 };
      this.filteredTasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    }
  }

  onFilterChange(event: Event): void {
    const target = event.target as HTMLSelectElement | null;
    if (target) {
      this.filter = target.value;
      this.applyFiltersAndSort();
    }
  }

  onSortChange(event: Event): void {
    const target = event.target as HTMLSelectElement | null;
    if (target) {
      this.sortCriteria = target.value;
      this.applyFiltersAndSort();
    }
  }

  deleteTask(taskId: string): void {
    this.taskService.deleteTask(taskId);
  }

  navigateToAddTask(): void {
    this.router.navigate(['/add-task']);
  }

  navigateToUpdateTask(taskId: string): void {
    this.router.navigate(['/update-task', taskId]);
  }

  navigateToTaskHistory(taskId: string): void {
    this.router.navigate(['/task-history', taskId]);
  }

  exportTasksToCSV(): void {
    const csvData = this.convertToCSV(this.tasks);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'tasks.csv');
    a.click();
  }

  private convertToCSV(tasks: Task[]): string {
    const header = 'ID,Title,Description,Due Date,Priority,Status,History\n';
    const rows = tasks.map(task => 
      `"${task.id}","${task.title}","${task.description}","${task.dueDate}","${task.priority}","${task.status}","${task.history.join(' | ')}"`
    ).join('\n');
    return header + rows;
  }
}
