import { request } from "../utils/helper/axiosConfig";

export const getUsers = (requestData) => {
  return request({
    url: "/api/user",
    method: "GET",
    params: requestData,
  });
};

export const getUserById = async (id: string) => {
  const response = await request({
    url: `/api/user/${id}`,
    method: "GET",
  });
  return response.data;
};

export const createUser = async (formData: FormData) => {
  try {
    const response = await request({
      url: "/api/user",
      method: "POST",
      body: formData,
    });
    return response.data;
  } catch (error: any) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
};

export const updateUser = async (id: string, formData: FormData) => {
  formData.append("user_id", id);
  try {
    const response = await request({
      url: `/api/user`,
      method: "PUT",
      body: formData,
    });
    return response.data;
  } catch (error: any) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteUser = async (id: string) => {
  await request({
    url: `/api/user/${id}`,
    method: "DELETE",
  });
};
