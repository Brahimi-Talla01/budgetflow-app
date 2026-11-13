export interface UserRole {
      roleId: number;
      name: string;
}

export interface User {
      id: number;
      firstname: string;
      lastname: string;
      email: string;
      isActive: boolean;
      role?: UserRole;
      createdAt?: Date;
      lastLogin?: Date;
}

export const getDisplayName = (user: User | null): string =>
      user ? `${user.firstname} ${user.lastname}`.trim() : "";
