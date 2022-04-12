import {React, useState, useEffect} from "react";
import { Row, Col } from "react-bootstrap";
import MoreActionBranch from "../../elements/MoreActionBranch";
import { useWindowSize } from "../../../hooks/useWindowSize";
import Cookies from "js-cookie";

const branchDetails = (props) => {
  const screenSize = useWindowSize();
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => setIsMobile(screenSize.width <= 991), [screenSize]);

  return (
    <>
      <tr >
        <td>{props.Sno}</td>
        <td style={{fontStyle:"San-Serif"}}>
          <>
            <div>
              <span>{props.name}</span>
              {/* <br />
              <span>{props.id}</span> */}
            </div>
          </>
        </td>
        <td style={{fontStyle:"San-Serif"}}>{props.head}</td>
        <td style={{fontStyle:"San-Serif"}}>{props.city}</td>
        <td style={{fontStyle:"San-Serif"}}>{props.address}</td>
       
        {
        Cookies.get('accesses')
        && 
        (JSON.parse(Cookies.get('accesses')).includes(5) || JSON.parse(Cookies.get('accesses')).includes(6)||JSON.parse(Cookies.get('accesses')).includes(7))
        &&  
        <td>
          <div class="text-center">
            <button style={{ background: "none" }}>
              <MoreActionBranch id={props.id} />
            </button>
          </div>
        </td>}
       
      </tr>
    </>
  );
};

export default branchDetails;
