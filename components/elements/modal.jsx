import Modal from "react-bootstrap/Modal";

const ModalComponent = ({
  size,
  show,
  onHide,
  title,
  body,
  bodyClassName,
  footer,
  scrollable,
  classDialog
}) => {
  return (
    <Modal
      size={size}
      scrollable={scrollable}
      dialogClassName={classDialog === "null" ? "" : "fixed-height-modal"}
      show={show}
      onHide={() => onHide()}
    >
      {title && (
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
      )}

      <Modal.Body className={bodyClassName}>{body}</Modal.Body>

      {footer && <Modal.Footer>{footer}</Modal.Footer>}
    </Modal>
  );
};

export default ModalComponent;
