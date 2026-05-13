import { request } from "../utils/helper/axiosConfig";

export const login = async (credentials: {
  username: string;
  password: string;
}) => {
  try {
    const response = await request({
      url: "/api/auth/login",
      method: "POST",
      body: credentials,
    });
    return response.data;
  } catch (error: any) {
    console.error("Login Error:", error.response?.data || error.message);
    throw error;
  }
};

export const register = async (userData: {
  username: string;
  password: string;
}) => {
  try {
    const response = await request({
      url: "/api/auth/register",
      method: "POST",
      body: userData,
    });
    return response.data;
  } catch (error: any) {
    console.error("Register Error:", error.response?.data || error.message);
    throw error;
  }
};

export const changePassword = async (
  oldPassword: string,
  newPassword: string
) => {
  try {
    const response = await request({
      url: "/api/auth/update_password",
      method: "PUT",
      body: {
        old_password: oldPassword,
        new_password: newPassword,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "Change Password Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};
