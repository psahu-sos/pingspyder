import axios from 'axios';

// Backend URL (Jo tera Spring Boot ka port hai, usually 8080)
const API_BASE_URL = 'http://localhost:8080/api';

export const apiService = {
  // 1. Database se live data lane ke liye (Auto Mode)
  fetchLiveNodes: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/nodes/live`);
      return response.data;
    } catch (error) {
      console.error("DB Fetch Error:", error);
      throw error;
    }
  },

  // 2. Excel data backend ko bhejne ke liye ping check karne (Manual Mode)
  triggerManualPing: async (fileData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/nodes/ping`, fileData);
      return response.data;
    } catch (error) {
      console.error("Ping Execution Error:", error);
      throw error;
    }
  }
};