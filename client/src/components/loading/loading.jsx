import React from "react";
import ContentLoader from "react-content-loader";

const MyLoader = (props) => (
  <ContentLoader
    speed={2}
    width={292}
    height={353}
    viewBox="0 0 292 353"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="0" y="0" rx="0" ry="0" width="417" height="180" />
    <rect x="0" y="197" rx="0" ry="0" width="99" height="21" />
    <rect x="1" y="228" rx="15" ry="15" width="135" height="29" />
    <rect x="2" y="272" rx="0" ry="0" width="300" height="20" />
    <rect x="2" y="317" rx="0" ry="0" width="67" height="20" />
    <rect x="64" y="323" rx="0" ry="0" width="1" height="4" />
    <rect x="159" y="325" rx="0" ry="0" width="8" height="0" />
    <rect x="211" y="316" rx="0" ry="0" width="67" height="20" />
    <rect x="254" y="325" rx="0" ry="0" width="5" height="2" />
    <rect x="99" y="316" rx="0" ry="0" width="79" height="20" />
  </ContentLoader>
);

export default MyLoader;
