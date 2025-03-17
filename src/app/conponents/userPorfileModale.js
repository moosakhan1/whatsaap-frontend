import { Button, Form, Input, Modal } from "antd";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
const ProfileModale = NiceModal.create(() => {
  return (
    <Modal
      // className=""
      title="Email"
      onOk={() => modal.hide()}
      visible={modal.visible}
      onCancel={() => modal.hide()}
      afterClose={() => modal.remove()}
      footer={null}
    >
      <div>asad</div>
    </Modal>
  );
});

export default ProfileModale;
