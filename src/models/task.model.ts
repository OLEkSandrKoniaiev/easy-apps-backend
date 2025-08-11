import { ITask } from '../types/task.types';
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../configs/database.config';
import { UserModel } from './user.model';

type TaskAttributes = ITask;

type TaskCreationAttributes = Optional<TaskAttributes, 'id' | 'done' | 'createdAt' | 'updatedAt'>;

class TaskModel extends Model<TaskAttributes, TaskCreationAttributes> implements TaskAttributes {
  public id!: number;
  public title!: string;
  public description!: string | null;
  public done!: boolean;
  public files!: string | null;
  public userId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

TaskModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    done: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    files: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  },
  {
    sequelize,
    tableName: 'tasks',
    timestamps: true,

    defaultScope: {
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    },
    scopes: {
      withDates: {
        attributes: { include: ['createdAt', 'updatedAt'] },
      },
    },
  },
);

TaskModel.belongsTo(UserModel, { foreignKey: 'userId', as: 'user' });

export { TaskModel };
