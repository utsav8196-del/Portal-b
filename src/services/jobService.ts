import { request } from "../utils/helper/axiosConfig";

export const getJobs = (requestData) => {
  return request({
    url: "/api/job",
    method: "GET",
    params: requestData,
  });
};

export const getJobById = async (id: string) => {
  const response = await request({
    url: `/api/job/${id}`,
    method: "GET",
  });
  return response.data;
};

export const createJob = async (formData: FormData) => {
  try {
    const response = await request({
      url: "/api/job",
      method: "POST",
      body: formData,
    });
    return response.data;
  } catch (error: any) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
};

export const updateJob = async (id: string, formData: FormData) => {
  formData.append("job_id", id);
  try {
    const response = await request({
      url: `/api/job`,
      method: "PUT",
      body: formData,
    });
    return response.data;
  } catch (error: any) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
};

export const updateJobStatus = async (id: string, status: boolean) => {
  const formData = new FormData();
  formData.append("job_id", id);
  formData.append("job_status", status ? "true" : "false");
  try {
    const response = await request({
      url: `/api/job`,
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

export const deleteJob = async (id: string) => {
  await request({
    url: `/api/job/${id}`,
    method: "DELETE",
  });
};
