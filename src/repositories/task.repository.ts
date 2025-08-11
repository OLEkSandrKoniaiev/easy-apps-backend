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

  static async deleteFileByUrl(taskId: number, updFiles: string | null): Promise<ITask | null> {
    const [affectedRows] = await TaskModel.update(
      { files: updFiles },
      {
        where: { id: taskId },
      },
    );

    if (affectedRows === 0) {
      throw new Error(`Task with id ${taskId} not found for update.`);
    }

    const updatedTask = await TaskModel.findOne({ where: { id: taskId } });

    if (!updatedTask) {
      throw new Error('Failed to retrieve updated task.');
    }

    return updatedTask.get();
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
