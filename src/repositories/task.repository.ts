import { ICreateTaskDTO, IPartialUpdateTaskDTO, ITask } from '../types/task.types';
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

  static async updatePartial(taskId: number, data: IPartialUpdateTaskDTO): Promise<ITask | null> {
    const updateData: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        updateData[key] = value;
      }
    }

    if (Object.keys(updateData).length === 0) {
      throw new Error('No fields provided for update.');
    }

    const [affectedRows] = await TaskModel.update(data, {
      where: { id: taskId },
    });

    if (affectedRows === 0) {
      throw new Error(`Task with id ${taskId} not found for update.`);
    }

    const updatedTask = await TaskModel.findOne({ where: { id: taskId } });

    if (!updatedTask) {
      throw new Error('Failed to retrieve updated task.');
    }

    return updatedTask.get();
  }
}
