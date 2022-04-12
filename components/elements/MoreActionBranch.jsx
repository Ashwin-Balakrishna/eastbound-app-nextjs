import React from 'react';
import { Dropdown, Modal, Button } from 'react-bootstrap';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { useRouter } from 'next/router';
import Cookies from "js-cookie";
import { fetchFormDataWithAuth } from '../../utils/apiHelper';
import { NODE_API_URL } from '../../utils/helper';
import { AiFillEye,AiFillEdit } from "react-icons/ai";

const MoreActionBranch = (props) => {
  const router =useRouter();
const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <button
      href=""
      className='customize-btn'
      ref={ref}
      style={{background:'none'}}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      <BiDotsVerticalRounded color="#e85423" width={'100%'}/>
    </button>
));
  // Modal for agent delete confirmation
   const [show, setShow] = React.useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);



  
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
              (child) => child?.props?.children?.toString().toLowerCase()
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
  
      <Dropdown.Menu as={CustomMenu}>
        

        {Cookies.get('accesses') && JSON.parse(Cookies.get('accesses')).includes(5) && <Dropdown.Item eventKey="2" onClick={(e) => { router.push({pathname:`/branchdetails/edit`, query:{id:props.id}}) }}><span className='mr-2'><AiFillEdit/></span>Edit</Dropdown.Item>}
        
        {Cookies.get('accesses')&&JSON.parse(Cookies.get('accesses')).includes(7)&&  <Dropdown.Item eventKey="1" onClick={(e)=>{router.push({pathname:`/branchdetails/view`, query:{id:props.id}})}}><span className='mr-2'><AiFillEye/></span>View</Dropdown.Item>}
      </Dropdown.Menu>
    </Dropdown>


  );
}

export default MoreActionBranch

