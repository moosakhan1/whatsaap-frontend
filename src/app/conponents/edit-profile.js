"use client";

import { Modal, Input, Upload, Form, Spin } from "antd";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Check, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { editeDetaile, editeProfile } from "../Action/authAction";
import { toast, Toaster } from "sonner";
import { editProfile } from "../redux/features/auth/auth";
import { LoadingOutlined } from "@ant-design/icons";

const EditeProfile = NiceModal.create(() => {
  const modal = useModal();
  const { user } = useSelector((state) => state.auth);
  const [loading, setloading] = useState(false);

  const [profileData, setProfileData] = useState({
    name: user.name,
    status: user.whatappstatus,
    pic: user.Pic,
  });
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [previewImage, setPreviewImage] = useState(profileData.pic);
  const [file, setfile] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarUpload = (file) => {
    const reader = new FileReader();
    setfile(file);
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data1) => {
    setloading(true);
    const formData = new FormData();
    const File = file;
    if (file) {
      formData.append("fileInput", file);
      formData.append("name", profileData.name);
      formData.append("id", user.id);
      formData.append("Useremail", user.email);
      formData.append("whatappstatus", profileData.status);
      formData.append("fileName", file.name);
      const Data = await editeProfile(formData, user.token);
      if (!Data.ok) {
        const { error } = await Data.json();
        return toast.error(error);
      }
      const { data } = await Data.json();
      dispatch(editProfile(data));

      modal.hide();
    } else {
      formData.append("name", profileData.name);
      formData.append("id", user.id);
      formData.append("Useremail", user.email);
      formData.append("whatappstatus", profileData.status);
      const Data = await editeDetaile(formData, user.token);
      if (!Data.ok) {
        const { error } = await Data.json();
        return toast.error(error);
      }
      const { data } = await Data.json();
      dispatch(editProfile(data));

      modal.hide();
    }
  };
  console.log(user.token);
  return (
    <Modal
      open={modal.visible}
      onCancel={() => modal.hide()}
      afterClose={() => modal.remove()}
      footer={null}
      centered
      className="custom-modal"
    >
      <Toaster />
      <Form form={form} onFinish={onSubmit}>
        <div className="bg-gray-900 p-6 rounded-lg">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center  gap-y-6"
          >
            <h2 className="text-2xl text-white font-bold">Edit Profile</h2>

            <div className="text-center w-full">
              <div className="relative w-24 h-24 mx-auto mb-4 border bg-white rounded-full overflow-hidden group cursor-pointer">
                <img
                  src={previewImage || profileData.pic || "/boy.png"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                <Upload
                  name="avatar"
                  showUploadList={false}
                  beforeUpload={() => false}
                  onChange={(e) => {
                    handleAvatarUpload(e.file);
                  }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Camera className="text-white" size={24} />
                  </div>
                </Upload>
              </div>

              <div className="space-y-4 w-full max-w-md mx-auto">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Name
                  </label>
                  <Input
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    placeholder="Your name"
                    className="w-full bg-gray-800 hover:text-black focus:text-black text-white border-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Status
                  </label>
                  <Input.TextArea
                    name="status"
                    value={profileData.status}
                    onChange={handleInputChange}
                    placeholder="Hey there! I am using WhatsApp"
                    className="w-full bg-gray-800 text-white hover:text-black focus:text-black border-gray-700"
                    rows={3}
                    maxLength={100}
                  />
                  <p className="text-xs text-gray-500 mt-1 text-right">
                    {profileData.status.length}/100
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex space-x-4">
              {loading ? (
                <Spin indicator={<LoadingOutlined spin />} size="large" />
              ) : (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  type="submite"
                  className="px-6 py-2 flex items-center space-x-2 rounded-full bg-green-500 hover:bg-green-600 text-white font-semibold transition-all"
                >
                  <Check size={20} />
                  <span>Save</span>
                </motion.button>
              )}

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => modal.hide()}
                className="px-6 py-2 flex items-center space-x-2 rounded-full bg-red-500 hover:bg-red-600 text-white font-semibold transition-all"
              >
                <X size={20} />
                <span>Cancel</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </Form>
    </Modal>
  );
});

export default EditeProfile;
