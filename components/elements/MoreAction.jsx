import React from 'react';
import { Dropdown, Modal, Button } from 'react-bootstrap';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { useRouter } from 'next/router';
import Cookies from "js-cookie";
import { AiFillEye, AiFillDelete, AiFillEdit } from "react-icons/ai";
import { fetchFormDataWithAuth } from '../../utils/apiHelper';
import { NODE_API_URL } from '../../utils/helper';

function MoreAction(props) {
  
const router =useRouter();
const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <button
      // href=""
      className='customize-btn'
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      <BiDotsVerticalRounded color="#e85423" height={'100px'} width={'100px'}/>
    </button>
));
  // Modal for agent delete confirmation
   const [show, setShow] = React.useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

//DELETE AN AGENT FROM THE LIST
  const removeagent = async (e) => {
 try   
{
   const delstaff = await fetchFormDataWithAuth(
     `${NODE_API_URL}/user/agent/delete?agencyId=${props.agency_id}&userId=${props.id}`,
     "GET",
     null,
     { "Content-Type": "application/json" },
         
   );
location.reload(true);
    }
    catch(error){
   throw new Error(error);
    }

}  

  
  // forwardRef again here!
  // Dropdown needs access to the DOM of the Menu to measure it
  const CustomMenu = React.forwardRef(
    ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
      return (
        <div
          ref={ref}
          style={style}
          className={className}
          aria-labelledby={labeledBy}
        >
          <ul className="list-unstyled">
            {
                React.Children.toArray(children).filter(
              (child) => (child.props.children)
            )}
          </ul>


          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Delete Agent</Modal.Title>
            </Modal.Header>
            <Modal.Body><span>Are you sure you want to delete this agent : {props.name}</span></Modal.Body>
            <Modal.Footer>
              <Button variant="outline-secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={removeagent}>
                Delete
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      );
    },
  );
  
  return (
    <Dropdown align="end">
      <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
        Custom toggle
      </Dropdown.Toggle>
  
      <Dropdown.Menu  as={CustomMenu} style={{background:"white"}}>
        {Cookies.get('accesses') && JSON.parse(Cookies.get('accesses')).includes(6) && <Dropdown.Item eventKey="3"  onClick={handleShow}>
        <span><AiFillDelete /></span>  Delete
        </Dropdown.Item>}

        {Cookies.get('accesses') && JSON.parse(Cookies.get('accesses')).includes(5) && <Dropdown.Item eventKey="2" onClick={(e) => { router.push(`/staffedit?id=${props.id}`) }}> <span><AiFillEdit /></span> Edit</Dropdown.Item>}
        
        {Cookies.get('accesses')&&JSON.parse(Cookies.get('accesses')).includes(7)&&  <Dropdown.Item eventKey="1" onClick={(e)=>{router.push(`/staffprofile?id=${props.id}`)}}><span><AiFillEye /></span>View</Dropdown.Item>}
      </Dropdown.Menu>
    </Dropdown>


  );
}
export default MoreAction