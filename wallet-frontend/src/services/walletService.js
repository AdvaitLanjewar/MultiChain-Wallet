import axios from "axios";

const API_URL = "http://localhost:5000";

export const generateWallet = async () => {
  const response = await axios.get(`${API_URL}/generate-wallet`);
  return response.data;
};