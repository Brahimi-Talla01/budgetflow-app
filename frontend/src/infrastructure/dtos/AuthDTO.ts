export interface UserDTO {
      userId: number;
      firstname: string;
      lastname: string;
      email: string;
      isActive: boolean;
      createdAt: string | null;
      lastLogin: string | null;
      role: { roleId: number; name: string } | null;
}

export interface LoginResponseDTO {
      success: boolean;
      message: string;
      user: UserDTO;
}

export interface RegisterResponseDTO {
      success: boolean;
      message: string;
      user: UserDTO;
}

export interface MeResponseDTO {
      user: UserDTO;
}

export interface LoginPayloadDTO {
      email: string;
      password: string;
}

export interface RegisterPayloadDTO {
      firstname: string;
      lastname: string;
      email: string;
      password: string;
      roleId: number;
}
