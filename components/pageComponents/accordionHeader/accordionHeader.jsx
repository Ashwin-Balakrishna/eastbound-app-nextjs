import { useContext } from "react";
import { AccordionContext, useAccordionToggle } from "react-bootstrap";
import { BsChevronDown } from "react-icons/bs";
import styles from "./accordionHeader.module.scss";

const AccordionHeader = ({ children, className, eventKey, callback }) => {
  const currentEventKey = useContext(AccordionContext);

  const decoratedOnClick = useAccordionToggle(eventKey, () => () =>
    callback && callback(eventKey)
  );

  const isCurrentEventKey = currentEventKey === eventKey;

  return (
    <div
      className={`d-flex justify-content-between ${className}`}
      onClick={decoratedOnClick}
    >
      <div className="d-flex align-items-center">{children}</div>
      <div>
        <BsChevronDown
          className={`${styles.accordianArrow} ${
            isCurrentEventKey ? styles.active : ""
          }`}
        />
      </div>
    </div>
  );
};

export default AccordionHeader;
