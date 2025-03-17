"use client";
import { Button, Form, Input, Modal } from "antd";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { Verify } from "../Action/authAction";
import { Toaster, toast } from "sonner";
import { redirect } from "next/navigation";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { loginAction } from "../redux/features/auth/auth";
import clearCachesByServerAction from "@/hook/revelidatepath";
import { useState } from "react";
// import { useRouter } from "next/router";
import { LoadingOutlined } from "@ant-design/icons";
import { Flex, Spin } from "antd";
const VerifyModale = NiceModal.create(({ email }) => {
  const [loading, setloading] = useState(false);
  const modal = useModal();
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const onSubmit = async (Data) => {
    try {
      setloading(true);
      console.log(Data);
      const obj = {
        code: Data.code,
        email: email,
      };
      const res = await Verify(obj);
      if (!res.ok) {
        const { error } = await res.json();
        setloading(false);

        return toast.error(error);
      }
      const { data } = await res.json();
      setloading(false);

      console.log(data);
      const users = JSON.stringify(data.user);
      dispatch(loginAction(data.user));
      console.log("users", users);
      Cookies.set("User", users);
      toast.success(data.data);
      clearCachesByServerAction("/");
      modal.hide();
    } catch (err) {
      console.log("bad seen ha", err);
    }
  };
  return (
    <Modal
      // className=""
      title="Otp"
      onOk={() => modal.hide()}
      visible={modal.visible}
      onCancel={() => modal.hide()}
      afterClose={() => modal.remove()}
      footer={null}
      className="custom-modal"
    >
      <Toaster />

      <Form form={form} onFinish={onSubmit}>
        <Form.Item
          name="code"
          rules={[{ required: true, message: "Code is required" }]}
        >
          <Input className=" border border-black" type="text" />
        </Form.Item>
        <Form.Item>
          {loading ? (
            <div className="flex justify-center items-center">
              <Spin indicator={<LoadingOutlined spin />} size="large" />
            </div>
          ) : (
            <Button type="primary" htmlType="submit" block>
              Submit
            </Button>
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default VerifyModale;
