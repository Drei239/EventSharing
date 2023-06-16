import { base_url } from "../../utils/base_url";
import axios from "axios";

const getAllCategory = async () => {
  const response = await axios.get(`${base_url}/category/all`);
  return response.data;
};

const categoryService = {
  getAllCategory,
};

export default categoryService;
