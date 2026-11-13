export interface ProjectProps {
      id: number;
      name: string;
      targetAmount: number;
      color: string;
      createdAt: Date;
      userId: number;
}

export interface CreateProjectPayload {
      name: string;
      targetAmount: number;
      color: string;
}

export type UpdateProjectPayload = Partial<CreateProjectPayload>;
