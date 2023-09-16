import React, { useEffect, useState, useCallback } from "react";
import "./index.css";
import {
  AiOutlineClose,
  AiOutlineCloudUpload,
  AiOutlineZoomIn,
  AiOutlineZoomOut,
} from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { closeModal, saveImg } from "../../features/user/userSlice";
import { useDropzone } from "react-dropzone";
import { MdRotate90DegreesCw } from "react-icons/md";
import { motion } from "framer-motion";
import Cropper from "react-easy-crop";
import { CropImage } from ".";
const UploadImage = () => {
  const dispatch = useDispatch();
  const open = useSelector((state) => state.user.open);
  const [rotate, setRotate] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [croppedImage, setCroppedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [imgSrc, setImgSrc] = useState(null);
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (acceptedFiles) => {
      setImgSrc(acceptedFiles.map((file) => URL.createObjectURL(file)));
    },
  });
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);
  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await CropImage(imgSrc, croppedAreaPixels, rotate);
      if (croppedImage) {
        setImgSrc(null);
        dispatch(saveImg(croppedImage));
      }
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels, rotate]);
  const closeModal2 = () => {
    setImgSrc("");
    dispatch(closeModal());
  };
  useEffect(() => {
    console.log(open);
  }, [open]);
  return (
    <>
      {open && (
        <motion.div open={open} className="upload-photo">
          <motion.div
            key={open}
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 200, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="upload-photo-content"
          >
            <div className="close-icon">
              <AiOutlineClose onClick={closeModal2} />
            </div>
            <div className="upload-content-text">
              <div className="upload-content-photo">
                <div {...getRootProps({ className: "upload-dropzone" })}>
                  <input {...getInputProps()} />
                  <AiOutlineCloudUpload className="upload-icon" />
                  <h2>Thêm một ảnh</h2>
                  <p>
                    Kéo và thả ảnh hoặc nhấp vào nút bên dưới để chọn ảnh bạn
                    muốn tải lên
                  </p>
                  <button className="upload-btn">Tải ảnh lên</button>
                </div>
                {imgSrc && (
                  <div className="crop">
                    <Cropper
                      image={imgSrc}
                      crop={crop}
                      aspect={3 / 3}
                      rotation={rotate}
                      onCropChange={setCrop}
                      onCropComplete={onCropComplete}
                      zoom={zoom}
                    />
                  </div>
                )}
              </div>
              {imgSrc && (
                <div className="crop-setting">
                  <div className="zoom-range">
                    <AiOutlineZoomOut className="zoom-icon" />
                    <input
                      type="range"
                      min={1}
                      max={5}
                      value={zoom}
                      step={0.1}
                      aria-aria-labelledby="Zoom"
                      onChange={(e) => setZoom(e.target.value)}
                      className="zoom-range"
                    />
                    <AiOutlineZoomIn className="zoom-icon" />
                  </div>
                  <button
                    className="btn-rotate"
                    onClick={() => setRotate(rotate + 90)}
                  >
                    <MdRotate90DegreesCw className="rotate-icon" />
                  </button>
                </div>
              )}
              <p className="upload-info">
                Những ảnh này phải ở định dạng JPEG, GIF hoặc PNG, có kích thước
                dưới 10MB.
              </p>
              {imgSrc && (
                <div className="btn-uploadImg">
                  <button className="btn-save" onClick={showCroppedImage}>
                    Lưu thay đổi
                  </button>
                  <button className="btn-cancel">Huỷ</button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default UploadImage;
