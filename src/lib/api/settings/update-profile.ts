import { fetchApi } from "../api";
import { ProfileResponse } from "./get-profile";

export interface UpdateProfileDto {
  name?: string;
  bio?: string;
  studentCode?: string;
  academicProgram?: string;
  semester?: number;
  profilePicture?: string;
};

/**
 * Update user profile
 * @param data - Profile data to update
 * @param token - JWT access token
 */
export const updateProfile = async (
  data: UpdateProfileDto,
  token: string
): Promise<ProfileResponse> => {
  if (!token) {
    throw new Error("Authentication token is required");
  }

  return fetchApi<ProfileResponse>("/auth/profile", {
    method: "PATCH",
    body: JSON.stringify(data),
  }, token);
};