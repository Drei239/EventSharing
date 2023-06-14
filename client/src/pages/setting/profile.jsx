import React, { useState } from "react";
import { Input } from "@nextui-org/react";
const Profile = () => {
  const [inputValue, setInputValue] = useState("");
  const handleChange = (event) => {
    const newValue = event.target.value;
    if (newValue.length <= 50) {
      setInputValue(newValue);
    }
  };
  const remainingChars = 30 - inputValue.length;
  return (
    <div className="profile">
      <h2 className="profile-title">Edit profile</h2>
      <p className="profile-info">
        This infomation will apperar on your public proflie
      </p>
      <div className="avatar-profile">
        <img
          src="https://ibiettuot.com/wp-content/uploads/2021/10/avatar-mac-dinh.png"
          alt=""
          className="avatar-img"
        />
        <button className="btn-upload-profile">Upload New</button>
      </div>
      <form>
        <div className="fullName-form">
          <label>Name(required)</label>
          <div className="input-name">
            <Input
              type="text"
              size="md"
              color="default"
              maxLength={30}
              bordered
              onChange={handleChange}
              value={inputValue}
              style={{ width: "400px", padding: "8px" }}
            />
            <span className="number-resignal">{remainingChars}</span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Profile;
