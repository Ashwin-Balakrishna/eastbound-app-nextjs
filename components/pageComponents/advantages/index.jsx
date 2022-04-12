import React from "react";
import { Col } from "react-bootstrap";
import { IconContext } from "react-icons/lib";

const Advantages = ({ advantages }) => {
  return (
    <div className="d-flex flex-row flex-nowrap is-x-scrollable w-100 justify-content-lg-around pb-3">
      {advantages.map((adv) => (
        <Col
          xs={5}
          lg={2}
          key={adv.key}
          className="d-flex align-items-center advantage-box"
        >
          <div className="mr-2">
            <IconContext.Provider value={{ className: "advantage-box-icon" }}>
              {adv.icon}
            </IconContext.Provider>
          </div>
          <p className="mb-0" style={{ fontSize: "13.5px", fontWeight: 600 }}>
            {adv.title}
          </p>
        </Col>
      ))}
    </div>
  );
};

export default Advantages;
