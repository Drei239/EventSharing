import axios from "axios";
import UseCallApi from "../hooks/useCallApi";
export const uploadImage = async (files, folder) => {
  console.log(files);
  const formData = new FormData();
  for (let i = 0; i <= files.length - 1; i++) {
    if (files[i]) {
      formData.append("images", files[i]);
    }
  }
  if (formData) {
    console.log(formData);
    const response = await UseCallApi({
      data: formData,
      url: `/upload?folder=${folder}`,
      method: "POST",
    });
    return response?.data;
  } else {
    throw Error("Không có ảnh hoặc định dạng sai");
  }
};
