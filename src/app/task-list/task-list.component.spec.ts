<div class="container mx-auto p-4">
  <div class="mb-4">
    <label class="block mb-2">Filter by status:</label>
    <select (change)="onFilterChange($event)" class="p-2 border rounded">
      <option value="">All</option>
      <option value="to-do">To-Do</option>
      <option value="in-progress">In-Progress</option>
      <option value="completed">Completed</option>
    </select>
  </div>

  <div class="mb-4">
    <label class="block mb-2">Sort by:</label>
    <select (change)="onSortChange($event)" class="p-2 border rounded">
      <option value="">None</option>
      <option value="dueDate">Due Date</option>
      <option value="priority">Priority</option>
    </select>
  </div>

  <ul class="list-disc pl-5">
    <li *ngFor="let task of filteredTasks" class="mb-2 p-2 border rounded">
      <h3 class="text-lg font-bold">{{ task.title }}</h3>
      <p>{{ task.description }}</p>
      <p>Due: {{ task.dueDate | date }}</p>
      <p>Priority: {{ task.priority }}</p>
      <p>Status: {{ task.status }}</p>
    </li>
  </ul>
</div>
