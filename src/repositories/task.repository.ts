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

  static async deleteById(taskId: number): Promise<boolean> {
    const deletedCount = await TaskModel.destroy({ where: { id: taskId } });
    return deletedCount > 0;
  }

  static async getTasks(userId: number): Promise<{ tasks: TaskModel[] }> {
    const { rows } = await TaskModel.findAndCountAll({
      where: {
        userId: userId,
      },
      attributes: ['id', 'title', 'description', 'files', 'done'],
      order: [['createdAt', 'DESC']],
    });

    return {
      tasks: rows,
    };
  }
}
