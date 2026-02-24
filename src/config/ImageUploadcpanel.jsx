import React, { useContext } from "react";
import axios from "axios";

import toast from "react-hot-toast";
import { AuthContext } from "../providers/AuthProvider";

const ImageUpload = ({
  setImageUrl = () => {},
  setPreviewImageUrl = () => {},
  setValue = () => {},
  label = "Upload Image",
}) => {
  const { branch } = useContext(AuthContext);
  const handleImageUpload = async (e) => {
    const imageFile = e.target.files[0];
   
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_UPLOAD_URL}/api/get-image-url?pathName=${branch}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data = response.data;
      const path = `${process.env.REACT_APP_S3_BASE_URL}/${data.path}`;


      if (response.status === 200) {
        if (setImageUrl) {
          setImageUrl(path);
        }
        if (setPreviewImageUrl) {
          setPreviewImageUrl(path);
        }
        setValue("photourl", path);
        toast.success("Image uploaded successfully");
      } else {
        toast.error(data.message || "Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error uploading image");
    }
  };

  return (
    <div className="md:w-full w-[95%] space-y-2 pt-1 md:max-w-min">
      <label className="capitalize font-bold text-[0.9rem]">{label}</label>
      <div className="form-control border rounded-lg shadow-sm">
        <input
          onChange={handleImageUpload}
          type="file"
          className="file-input outline-none focus:outline-none"
        />
      </div>
    </div>
  );
};

export default ImageUpload;
