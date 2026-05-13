import { request } from "../utils/helper/axiosConfig";

export const getDashboardStats = async () => {
  try {
    const response = await request({
      url: "/api/dashboard/counts",
      method: "GET",
    });

    return response.data;
  } catch (error: any) {
    console.error(
      "Dashboard Stats Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};
