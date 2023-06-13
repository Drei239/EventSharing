import React from "react";

const ProImg = ({ placeholderSrc, src, ...props }) => {
  return (
    <img
      {...{ src: placeholderSrc, ...props }}
      alt={props.alt || ""}
      className="image"
    />
  );
};

export default ProImg;
