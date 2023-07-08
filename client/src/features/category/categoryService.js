import axios from "axios";
import UseCallApi from "../../hooks/useCallApi";
const getAllCategory = async () => {
  const data = await UseCallApi({
    method: "GET",
    url: `/category/all`,
  });

  return data;
};

const categoryService = {
  getAllCategory,
};

export default categoryService;
