import { Button, Modal } from "antd";
import React, { useRef, useState } from "react";
import type { DraggableData, DraggableEvent } from "react-draggable";
import Draggable from "react-draggable";

interface IProps {
  data: any;
  isOpen: boolean;
  handleCloseModal: () => void;
  handleConfirm: () => void;
}
const ModalDelete: React.FC<IProps> = ({ data, isOpen, handleCloseModal, handleConfirm }) => {
  const [disabled, setDisabled] = useState(true);
  const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 });
  const draggleRef = useRef<HTMLDivElement>(null);

  const handleOk = (e: React.MouseEvent<HTMLElement>) => {
    console.log(e);
    handleConfirm();
    handleCloseModal();
  };

  const handleCancel = (e: React.MouseEvent<HTMLElement>) => {
    console.log(e);
    handleCloseModal();
  };

  const onStart = (_event: DraggableEvent, uiData: DraggableData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) {
      return;
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    });
  };

  return (
    <Modal
      title={
        <div
          style={{
            width: "100%",
            cursor: "move",
          }}
          onMouseOver={() => {
            if (disabled) {
              setDisabled(false);
            }
          }}
          onMouseOut={() => {
            setDisabled(true);
          }}
          onFocus={() => {}}
          onBlur={() => {}}
        >
          Xác nhận xóa <span className="text-orange-500">{data?.name}</span>
        </div>
      }
      open={isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      modalRender={(modal) => (
        <Draggable
          disabled={disabled}
          bounds={bounds}
          nodeRef={draggleRef}
          onStart={(event, uiData) => onStart(event, uiData)}
        >
          <div ref={draggleRef}>{modal}</div>
        </Draggable>
      )}
      footer={
        <div
          style={{
            marginTop: "2rem",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            justifyContent: "end",
          }}
        >
          <Button onClick={handleCancel} type="primary" ghost>
            Hủy
          </Button>
          <Button onClick={handleOk} danger type="primary">
            Xóa
          </Button>
        </div>
      }
    ></Modal>
  );
};

export default ModalDelete;
