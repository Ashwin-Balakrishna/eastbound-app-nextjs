import {React,useState, useEffect} from "react";
import { Form, FormControl } from "react-bootstrap";
import Select from "react-select";
import { useRouter } from 'next/router';
import { fetchFormDataWithAuth } from '../../../utils/apiHelper';
import { NODE_API_URL , API_URL} from "../../../utils/helper";
import { useWindowSize } from "../../../hooks/useWindowSize";
const viewStaff = (props) => {
  const router=useRouter();
  var url = new URL(API_URL + router.asPath);
    
  var params = new URLSearchParams(url.search);
  const screenSize = useWindowSize();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => setIsMobile(screenSize.width <= 991), [screenSize]);

  


  return (
    <>
      <div className="profile-card-wrapper">
        <div className="profile-overview-top">
          <div className="profile-overview-heading">
            <img src="/images/guest.svg" />
            <h4>&nbsp;&nbsp; Personal Information</h4>
          </div>
          <div className="profile-overview-action">
            <ul>
              <li>
                <img src="/images/edit.png" onClick={(e) => { router.push(`/staffedit?id=${props.id}`) }} />
              </li>
              <li>
                <img src="/images/collapse.png" />
              </li>
            </ul>
          </div>
        </div>
        <div className="profile-overview-bottom">
          <div className="profile-form">
            <div className="profile-divider">
              <div className="width-90">
                <Form>
                  <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control disabled style={{background:"none"}} type="text" value={props.name} />
                  </Form.Group>


                  <Form.Group>
                    <Form.Label>Email ID</Form.Label>
                    <Form.Control disabled style={{background:"none"}}  type="email" value={props.email} />
                  </Form.Group>
                  
                  <Form.Group>
                    <Form.Label>Mobile Number</Form.Label>
                    <Form.Control disabled style={{background:"none"}}  type="text" value={props.mobile} />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Designation</Form.Label>
                    <Form.Control disabled style={{background:"none"}}  type="text" value={props.designation} />
                  </Form.Group>

                  {/* <Form.Group>
                    <Form.Label>City</Form.Label>
                    <Form.Control disabled style={{background:"none"}}  type="text" value={props.branch} />
                  </Form.Group> */}

                  <Form.Group>
                    <Form.Label>Branch</Form.Label>
                    <Form.Control disabled style={{background:"none"}}  type="text" value={props.branch} />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Group</Form.Label>
                    <Form.Control disabled style={{ background: "none" }} type="text" value={props.group_name} />
  
                  </Form.Group>

                  <Form.Group hidden={props.group_name==="Superuser"}>
                    <Form.Label>Reporting Manager</Form.Label>
                    <Form.Control disabled style={{background:"none"}}  type="text" value={props.manager
                      } />
                  </Form.Group>

                  {/* <Form.Group>
                    <Form.Label>Address</Form.Label>
                    <Form.Control as="textarea" row={3} placeholder="Enter your Address" />
                  </Form.Group> */}

                  
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default viewStaff;
