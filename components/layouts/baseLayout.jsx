import React from "react";
import { Row, Col } from "react-bootstrap";
import SideMenu from "../pageComponents/sideMenu/sideMenu";
import Styles from "./baseLayout.module.scss";

const BaseLayout = (props) => {
  return (
    <>
      <Row className={`no-gutters w-100 h-100 ${Styles.positionLg}`}>
        <SideMenu />
        <Col md={10} className="p-md-3 p-3 mt-md-5 bg-light">
          {props.children}
        </Col>
      </Row>
    </>
  );
};

export default BaseLayout;
