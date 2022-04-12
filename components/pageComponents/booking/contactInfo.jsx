import React , { useEffect , useState} from 'react';
import Form from 'react-bootstrap/Form';
import { useForm } from "react-hook-form";
const ContactInfo = (props) => {
  const {register,handleSubmit ,unregister  ,reset,formState: { errors }} = useForm();
  const [contactInfo,setContactInfo] = useState([])
  const onSubmit = async (data) => {
    let arr = props.completed.map((value,index)=>{
      if (props.index === index)
      return true;
      else
      return value;
    })
    props.setCompeleted(arr)
    props.setExpanded(props.index+1)
    let tempData = {}
    for(let index=1;index<=props.contactInfo.length;index++){
      let flg={}
      flg['guest_name']=data['GuestName'+index]
      flg['guest_phone_number']=data['GuestPhone'+index]
      flg['guest_email']=data['GuestEmail'+index]
      flg['is_primary'] = index <= props.rooms.length
      flg['is_adult'] = true
      tempData[index]=flg
    }
    props.setContactInfoValues(tempData)
  }
  async function addData(data){
    if (props.contactInfo.length < ( 6 * parseInt(props.room))){
      let temp = [... props.contactInfo , data]
      await props.setContactInfo(temp)
      setContactInfo(temp)
    }
  }
  function removeGuest(rindex){
    var temp = props.contactInfo.filter((info,index)=>index !== rindex)
    unregister('GuestName'+rindex)
    unregister('GuestEmail'+rindex)
    unregister('GuestPhone'+rindex)
    props.setContactInfo(temp)
  }
  useEffect(() => {
    setContactInfo(props.contactInfo)
  },[props.contactInfo.length,props,props.reload])
  return (
    <div className="booking-card-wrapper">
       <form onSubmit={handleSubmit(onSubmit)}>
      <div className="booking-overview-bottom">
        <div className="booking-form">   
          {/* guest form */}
          {
            contactInfo.map((info,index)=>{ 
              return (
                <div className="guest-details" key={index}>
                  <div className="clone-details">
                  <div className="clone-heading">
                    <h5>Room {index+1} : Primary Guest *</h5>
                  </div>
                  {/* {
                    info !==1 && (
                      <div className="clone-action-wrapper">
                        <div className="clone-action" onClick={()=>removeGuest(index)}>
                          <img src="/images/delete.png" />
                          <h4>Remove Guest</h4>
                        </div>
                      </div>
                  )} */}
                  </div>
                  <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control 
                      type="text" 
                      name={'GuestName'+(index+1)} 
                      id={'GuestName'+(index+1)} 
                      placeholder="Enter your name" 
                      {...register('GuestName'+(index+1), { required:true })} 
                    />
                    {errors['GuestName'+(index+1)] && (
                      <span className="text-danger mt-1">
                        *This is a required field
                      </span>
                    )}
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control 
                      type="email" 
                      name={'GuestEmail'+(index+1)} 
                      id={'GuestEmail'+(index+1)} 
                      placeholder="Enter your Email Address" 
                      {...register('GuestEmail'+(index+1), { required:true,pattern:/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/ })} 
                    />
                    {errors['GuestEmail'+(index+1)] && (
                      <span className="text-danger mt-1">
                        *This is a required field
                      </span>
                    )}
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Phone Number</Form.Label> 
                    <Form.Control 
                      type="tel" 
                      name={'GuestPhone'+(index+1)} 
                      id={'GuestPhone'+(index+1)} 
                      placeholder="Enter your mobile number (Optional)" 
                      // required
                      minLength={10}
                      maxLength={10}
                      {...register('GuestPhone'+(index+1), {required:false , maxLength: 10 , minLength:10 })} 
                    />
                  </Form.Group>
                </div>
              )
            })
          }
         
          {/* <div className="guest-details">
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Enter your name" />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email Address</Form.Label>
              <Form.Control type="text" placeholder="Enter your Email Address" />
            </Form.Group>
            <Form.Group>
              <Form.Label>Phone Number</Form.Label>
              <Form.Control type="text" placeholder="This field is optional" />
            </Form.Group>
          </div> */}
          {/* cloned guest */}
          {/* <div className="guest-details">
            <div className="clone-details">
              <div className="clone-heading">
                <h5>Guest 2</h5>
              </div>
              <div className="clone-action-wrapper">
                <div className="clone-action">
                  <img src="/images/delete.png" />
                  <h4>Remove Guest</h4>
                </div>
              </div>
            </div>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Enter your name" />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email Address</Form.Label>
              <Form.Control type="text" placeholder="Enter your Email Address" />
            </Form.Group>
            <Form.Group>
              <Form.Label>Phone Number</Form.Label>
              <Form.Control type="text" placeholder="This field is optional" />
            </Form.Group>
          </div> */}
          {/* <button className="btn btn__link" type='button' onClick={()=>addData(0)}>+ Add another guest info</button> */}
        </div>
      </div>
      <div className="booking-action-button">
        <button className="btn btn__primary cus-btn " type='submit' >Confirm Details</button>
      </div>
      </form>
    </div>
  );
};

export default ContactInfo;