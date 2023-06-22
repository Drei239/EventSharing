import axios from "axios";
import UseCallApi from "../hooks/useCallApi";
export const uploadImage = async (files) => {
  console.log(files);
  const formData = new FormData();
  for (let i = 0; i <= files.length - 1; i++) {
    if (files[i]) {
      formData.append("images", files[i]);
    }
  }
  if (formData) {
    const response = await UseCallApi({
      data: formData,
      url: "/upload?folder=user",
      method: "POST",
    });
    return response?.data;
  } else {
    throw new Error("Không có ảnh hoặc định dạng sai");
  }
};
