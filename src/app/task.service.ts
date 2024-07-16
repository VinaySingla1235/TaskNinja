import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  status: string;
  history: string[];
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Task[] = [];
  private readonly localStorageKey = 'tasks';

  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.loadTasks();
  }

  private loadTasks(): void {
    if (isPlatformBrowser(this.platformId)) {
      const tasksJson = localStorage.getItem(this.localStorageKey);
      if (tasksJson) {
        this.tasks = JSON.parse(tasksJson);
        this.tasksSubject.next(this.tasks);
      }
    }
  }

  getTasks(): Task[] {
    return this.tasks;
  }
  getTaskById(taskId: string): Task | undefined {
    return this.tasks.find(task => task.id === taskId);
  }
  addTask(task: Task): void {
    if (isPlatformBrowser(this.platformId)) {
      this.tasks.push(task);
      localStorage.setItem(this.localStorageKey, JSON.stringify(this.tasks));
      this.tasksSubject.next(this.tasks);
    }
  }

  updateTask(updatedTask: Task): void {
    if (isPlatformBrowser(this.platformId)) {
      const index = this.tasks.findIndex(task => task.id === updatedTask.id);
      if (index !== -1) {
        updatedTask.history.push(`Task updated on ${new Date().toISOString()}`);
        console.log(updatedTask);
        this.tasks[index] = updatedTask;
        localStorage.setItem(this.localStorageKey, JSON.stringify(this.tasks));
        this.tasksSubject.next(this.tasks);
      }
    }
    }

  deleteTask(taskId: string): void {
    if (isPlatformBrowser(this.platformId)) {
      const index = this.tasks.findIndex(task => task.id === taskId);
      if (index !== -1) {
        this.tasks.splice(index, 1);
        localStorage.setItem(this.localStorageKey, JSON.stringify(this.tasks));
        this.tasksSubject.next(this.tasks);
      }
    }
  }
}
