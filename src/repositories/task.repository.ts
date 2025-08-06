import { ICreateTaskDTO, ITask } from '../types/task.types';
import { TaskModel } from '../models/task.model';

export class TaskRepository {
  static async createTask(data: ICreateTaskDTO): Promise<ITask> {
    const task = await TaskModel.create(data);
    return task.get();
  }
}
