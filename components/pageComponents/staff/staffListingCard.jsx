import React from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import MoreAction from "../../elements/MoreAction";
import Cookies from "js-cookie";
const staffListingCard = (props) => {
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
        <td style={{fontStyle:"San-Serif"}}>{props.designation}</td>
        <td style={{fontStyle:"San-Serif"}}>{props.email}</td>
        <td style={{fontStyle:"San-Serif"}}>{props.mno}</td>
        {/* <td>{props.dept}</td> */}
        <td style={{fontStyle:"San-Serif"}}>{props.city}</td>
        <td style={{fontStyle:"San-Serif"}}>{props.rmanager}</td>
        <td style={{fontStyle:"San-Serif"}}>{props.group}</td>
        {
        Cookies.get('accesses')
        && 
        (JSON.parse(Cookies.get('accesses')).includes(5) || JSON.parse(Cookies.get('accesses')).includes(6)||JSON.parse(Cookies.get('accesses')).includes(7))
        &&  
        <td>
          <div class="text-center">
            <button style={{ background: "none" }}>
              <MoreAction id={props.id} agency_id={props.agency_id} name={props.name} />
            </button>
          </div>
        </td>}
       
      </tr>
    </>
  );
};

export default staffListingCard;
