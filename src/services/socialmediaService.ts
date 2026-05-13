import { request } from "../utils/helper/axiosConfig";

export const getPosts = (requestData) => {
  return request({
    url: "/api/social_media",
    method: "GET",
    params: requestData,
  });
};

export const getPostById = async (id: string) => {
  const response = await request({
    url: `/api/social_media/${id}`,
    method: "GET",
  });
  return response.data;
};

export const createPost = async (formData: FormData) => {
  try {
    const response = await request({
      url: "/api/social_media",
      method: "POST",
      body: formData,
    });
    return response.data;
  } catch (error: any) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
};

export const updatePost = async (id: string, formData: FormData) => {
  formData.append("social_media_id", id);
  try {
    const response = await request({
      url: `/api/social_media`,
      method: "PUT",
      body: formData,
    });
    return response.data;
  } catch (error: any) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
};

export const updatePostStatus = async (id: string, status: boolean) => {
  const formData = new FormData();
  formData.append("social_media_id", id);
  formData.append("social_media_status", status ? "true" : "false");
  try {
    const response = await request({
      url: `/api/social_media`,
      method: "PUT",
      body: formData,
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "Status Update Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deletePost = async (id: string) => {
  await request({
    url: `/api/social_media/${id}`,
    method: "DELETE",
  });
};
