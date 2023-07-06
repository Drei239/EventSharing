import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import { object, string, number } from "yup";
import Modal from "@mui/material/Modal";
import {
  Rating,
  Input,
  TextField,
  TextareaAutosize,
  Button,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import { BsUpload } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import "./newRating.css";
import { createReview } from "../../../features/events/eventSlice";
import { uploadImage } from "../../../utils/uploadImg";
import notify from "../../../utils/notify";
const validateSchema = object().shape({
  rating: number()
    .required("Vui lòng chọn số sao đánh giá của bạn")
    .min(1, "Số sao ít nhất là 1")
    .max(5, "Số sao lớn nhât là 5"),
  title: string().required("Vui lòng nhập tiêu đề đánh giá"),
  comment: string().required("vui lòng nhập nội dung đánh giá"),
});
const NewRating = ({ open, handleClose }) => {
  const dispatch = useDispatch();
  const [imageList, setImageList] = useState([]);
  const [fileList, setFileList] = useState([]);
  const { getEventById, isSuccessRating } = useSelector((state) => state.event);
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (acceptedFiles) => {
      setImageList((image) => [
        ...image,
        acceptedFiles.map((file) => URL.createObjectURL(file)),
      ]);
      setFileList((file) => [...file, ...acceptedFiles.map((file) => file)]);
    },
  });
  const formik = useFormik({
    initialValues: {
      rating: 0,
      title: "",
      comment: "",
      image: "",
    },
    validationSchema: validateSchema,
    onSubmit: async (values) => {
      if (imageList.length > 0) {
        await uploadImage(fileList, "review").then((result, resolve) => {
          console.log(result);
          if (result) {
            dispatch(
              createReview({
                eventId: getEventById._id,
                title: values.title,
                comment: values.comment,
                rating: values.rating,
                image: result,
              })
            );
          }
        });
      } else {
        dispatch(
          createReview({
            eventId: getEventById._id,
            title: values.title,
            comment: values.comment,
            rating: values.rating,
          })
        );
      }
    },
  });
  const removeImageList = (number) => {
    setImageList((img) => img.filter((item, index) => index !== number));
    setFileList((img) => img.filter((item, index) => index !== number));
  };
  const handleChangeRating = (event, newValue) => {
    formik.setFieldValue("rating", newValue);
  };
  useEffect(() => {
    console.log(getEventById);
  }, [getEventById]);
  useEffect(() => {
    if (isSuccessRating) {
      notify("Đánh giá sự kiện thành công");
    }
  }, [isSuccessRating]);
  return (
    <Modal open={open} onClose={handleClose}>
      <div className="new-rating">
        <button onClick={handleClose} className="new-rating-btn-close">
          <AiOutlineClose />
        </button>
        <h2>Viết đánh giá</h2>
        <form onSubmit={formik.handleSubmit}>
          <div style={{ position: "relative" }}>
            <Rating
              name="simple-controlled"
              value={formik.values.rating}
              onChange={handleChangeRating}
            />
            <span className="new-rating-err">
              {formik.touched.rating && formik.errors.rating}
            </span>
          </div>
          <div style={{ position: "relative", width: "100%" }}>
            <TextField
              size="small"
              value={formik.values.title}
              placeholder="Tiêu đề đánh giá"
              name="title"
              className="new-rating-title"
              onChange={formik.handleChange}
            />
            <span className="new-rating-err">
              {formik.touched.title && formik.errors.title}
            </span>
          </div>
          <div style={{ position: "relative" }}>
            <textarea
              rows={10}
              placeholder="Nội dung đánh giá"
              onChange={formik.handleChange}
              name="comment"
              value={formik.values.comment}
            />
            <span className="new-rating-err">
              {formik.touched.comment && formik.errors.comment}
            </span>
          </div>
          <div className="new-rating-upload">
            <div className="new-rating-img-list">
              {imageList.length > 0 &&
                imageList.map((item, index) => {
                  return (
                    <div className="new-rating-img-item" key={index}>
                      <img src={item} alt="" />
                      <div className="new-rating-img-item-close">
                        <AiOutlineClose
                          onClick={() => removeImageList(index)}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
            <div {...getRootProps({ className: "new-rating-uploadImage" })}>
              <input {...getInputProps()} />
              <BsUpload fontSize={30} />
              <p>Thả tệp ở đây hoặc nhấp để tải lên</p>
            </div>
          </div>
          <div className="new-rating-btns">
            <Button
              variant="contained"
              className="new-rating-btn-rating"
              type="submit"
            >
              Đánh giá
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default NewRating;
