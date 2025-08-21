export interface ITask {
  id: number;
  title: string;
  description: string | null;
  done: boolean;
  files: string | null;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreateTaskDTO {
  title: string;
  description: string | null;
  files: string | null;
  userId: number;
}

export interface IPartialUpdateTaskDTO {
  title?: string;
  description?: string | null;
  files?: string | null;
  done?: boolean;
}

export interface IUpdateTaskDTO {
  title: string;
  description?: string | null;
  files?: string | null;
  done: boolean;
}

export interface IShowTaskDTO {
  id: number;
  title: string;
  description: string | null;
  files: string | null;
  done: boolean;
}

export interface IShowTasksListDTO {
  total: number;
  tasks: IShowTaskDTO[];
}
