import { fetchApi } from "./api";

export interface RegisterUserDto {
  email: string;
  password: string;
  name: string;
  profilePicture?: string;
  bio?: string;
}

export interface RegisterResponse {
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
    profilePicture: string | null;
    bio: string | null;
    createdAt: string;
    updatedAt: string;
  };
  accessToken: string;
}

/**
 * Register a new user
 */
export const registerUser = async (userData: RegisterUserDto): Promise<RegisterResponse> => {
  return fetchApi<RegisterResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};