import { ICreateTaskDTO, ITask } from '../types/task.types';
import { TaskModel } from '../models/task.model';

export class TaskRepository {
  static async createTask(data: ICreateTaskDTO): Promise<ITask> {
    const task = await TaskModel.create(data);
    return task.get();
  }


  static async findById(taskId: number): Promise<ITask | null> {
    return TaskModel.findOne({ where: { id: taskId } });
  }
    
    
  static async getTasks(
    userId: number,
    page: number,
    tasksPerPage: number,
  ): Promise<{ total: number; tasks: TaskModel[] }> {
    const offset = (page - 1) * tasksPerPage;

    const { count, rows } = await TaskModel.findAndCountAll({
      where: {
        userId: userId,
      },
      attributes: ['id', 'title', 'description', 'files', 'done'],
      limit: tasksPerPage,
      offset: offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      total: count,
      tasks: rows,
    };
  }
}
