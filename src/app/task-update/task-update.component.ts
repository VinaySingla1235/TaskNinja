import { Component, OnInit } from '@angular/core';
import { TaskService, Task } from '../task.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-task-update',
  templateUrl: './task-update.component.html',
  styleUrls: ['./task-update.component.css']
})
export class TaskUpdateComponent implements OnInit {
  task: Task | undefined;

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const taskId = this.route.snapshot.paramMap.get('id');
    if (taskId) {
      this.task = this.taskService.getTaskById(taskId);
    }
  }

  updateTask(): void {
    if (this.task) {
      this.taskService.updateTask(this.task);
      this.router.navigate(['/']);
    }
  }
}
