/* eslint-disable prettier/prettier */
import { useState } from 'react';
import { useForm } from "react-hook-form";
import {Form , Modal , Button} from 'react-bootstrap';
import { useRouter } from 'next/router';
const SpecialRequest = (props) => {
  const router = useRouter()
  const params = router.query
  const [show,setShow] = useState(false);
  const {register,handleSubmit,reset,formState: { errors }} = useForm();
  const [checkOptions , setCheckOptions] = useState([
    {label:'Pickup Service',checked:false},
    {label:'Late-checkout',checked:false},
    {label:'Interconnected Room',checked:false},
    {label:'Twinbeds',checked:false},
    {label:'Early Checkin',checked:false},
    {label:'Special Occasion',checked:false},
    {label:'King Bed',checked:false},
  ])
  function handleClose(){
    setShow(false);
    reset()
  }
  function handleChange(index){
    let tempOptions = checkOptions
    tempOptions[index].checked = !tempOptions[index].checked
    setCheckOptions(tempOptions)
  }
  function addRequest(data){
    setCheckOptions((prevData)=>[
      ... prevData ,
      {label:data?.specialRequest,checked:false}
    ])
    reset();
    handleClose();
  }
  async function handleSave(){
    let result=[]
    await checkOptions.filter((values)=>{
      if (values.checked === true)
      result.push(values.label);
    })
    props.setSpecialRequest(result)
    let arr = props.completed.map((value,index)=>{
      if (props.index === index)
      return true;
      else
      return value;
    })
    props.setCompeleted(arr)
    if(params['type'] === 'ManualBooking')
    props.setExpanded(5)
    else if (params['type'] === 'RequestBooking')
    props.setExpanded(4)
    else
    props.setExpanded(props.index+1)
  }
  return (
    <div className="booking-card-wrapper">
      <div className="booking-overview-bottom">
        <div className="booking-form">
          <div className="s-request-heading">
            <h2>Special Requests</h2>
          </div>
          <div className="s-request">
            {
              checkOptions.map((check,index)=>{
                return(
                  <Form.Group className='form-check.policy_details' controlId={check.label} key={index}>
                    <Form.Check 
                      type="checkbox" 
                      className="checkbox-custom"
                      label={check.label} 
                      // id='policychecked'
                      value={check.label} 
                      name={check.label} 
                      onChange={()=>{handleChange(index)}}
                    />
                  </Form.Group>
                )
              })
            }
            <Form.Group>
              <button className="btn btn__link" onClick={()=>setShow(true)}>+ Other request</button>
            </Form.Group>
          </div>
        </div>
      </div>
      <div className="booking-action-button">
        <button className="btn btn__primary cus-btn" onClick={()=>handleSave()}>Continue to payment method</button>
      </div>

      {/* Model for Other Requests  */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Special Request</Modal.Title>
        </Modal.Header>
        <form>
        <Modal.Body>
        <Form.Group>
            <Form.Label>Special Request</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Request"
              name='specialRequest'
              id='specialRequest'
              {...register('specialRequest', { required:true })} 
            />
            {errors['specialRequest'] && (
              <span className="text-danger mt-1">
                *This is a required field
              </span>
            )}

          </Form.Group> 
          </Modal.Body>
          <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit(addRequest)}>
            Add
          </Button>
        </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
};

export default SpecialRequest;