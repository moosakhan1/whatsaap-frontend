"use client";
import { Button, Form, Input, Modal } from "antd";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { Toaster, toast } from "sonner";
import { useSelector } from "react-redux";
import { addChat } from "../Action/chatAction";
import { LoadingOutlined } from "@ant-design/icons";
import { Flex, Spin } from "antd";
import { useState } from "react";
const AddChat = NiceModal.create(({ Term, setTerm }) => {
  const modal = useModal();
  const [form] = Form.useForm();
  const auth = useSelector((state) => state.auth);
  const [loading, setloading] = useState(false);

  const onSubmit = async (Data) => {
    try {
      setloading(true);
      const obj = {
        email: Data.email,
        Useremail: auth.user.email,
      };
      const token = auth.user.token;
      const res = await addChat(token, obj);
      if (!res.ok) {
        const { error } = await res.json();
        setloading(false);
        return toast.error(error);
      }
      const { data } = await res.json();
      setloading(false);

      setTerm(!Term);
      return modal.hide();
    } catch (err) {
      console.log("err=>", err);
    }
  };

  return (
    <Modal
      title={
        <div className="text-white bg-gray-900 text-xl font-semibold">
          Add Chat
        </div>
      }
      visible={modal.visible}
      onCancel={() => modal.hide()}
      afterClose={() => modal.remove()}
      footer={null}
      className="custom-modal"
    >
      <Toaster />
      <Form form={form} onFinish={onSubmit} className="space-y-4">
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Email is required" }]}
        >
          <Input
            placeholder="example@gmail.com"
            className="bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:text-black focus:outline-none rounded-lg p-2 w-full"
            type="text"
          />
        </Form.Item>
        <Form.Item>
          {loading ? (
            <div className="flex justify-center items-center">
              <Spin indicator={<LoadingOutlined spin />} size="large" />
            </div>
          ) : (
            <Button
              type="primary"
              htmlType="submit"
              block
              className="bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg p-2 transition-all"
            >
              Submit
            </Button>
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default AddChat;
