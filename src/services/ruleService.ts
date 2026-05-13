import { request } from "../utils/helper/axiosConfig";

export const getRules = (requestData) => {
  return request({
    url: "/api/rule",
    method: "GET",
    params: requestData,
  });
};

export const getRuleById = async (id: string) => {
  const response = await request({
    url: `/api/rule/${id}`,
    method: "GET",
  });
  return response.data;
};

export const createRule = async (formData: FormData) => {
  try {
    const response = await request({
      url: "/api/rule",
      method: "POST",
      body: formData,
    });
    return response.data;
  } catch (error: any) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
};

export const updateRule = async (id: string, formData: FormData) => {
  formData.append("rule_id", id);
  try {
    const response = await request({
      url: `/api/rule`,
      method: "PUT",
      body: formData,
    });
    return response.data;
  } catch (error: any) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteRule = async (id: string) => {
  await request({
    url: `/api/rule/${id}`,
    method: "DELETE",
  });
};
