/* eslint-disable prettier/prettier */
import { useRouter } from 'next/router';
import { useEffect, useState , useCallback  } from 'react';
import Form from 'react-bootstrap/Form';
import { useForm } from "react-hook-form";
import Select from 'react-select';
import {toast,ToastContainer} from 'react-toastify'
import AsyncCreatableSelect from 'react-select/async-creatable';
import { API_URL, NODE_API_URL } from '../../../utils/helper';
import { fetchDataWithAuth } from '../../../utils/apiHelper';
const TravelerInfo = (props) => {
  const capitalize = (str) => {
    if(typeof str === 'string') {
      return str.toLowerCase().replace(/^\w|\s\w/g, function (letter) {
        return letter.toUpperCase();
    })
    } else {
        return '';
    }
  };
  const router = useRouter()
  var location = router.asPath;
  var params = new URLSearchParams(location);
  const [hotelName,setHotelName] = useState('')
  const [hotelOptions,setHotelOptions] = useState([])
  const room_type = capitalize(params.get('roomtype'))
  const room_plan = capitalize(params.get('roomplan'))
  const {register, unregister ,handleSubmit , setValue ,reset,formState: { errors }} = useForm();
  const [gst,setGst] = useState('');
  const [planOptions,setPlanOptions] = useState([  
    {label:'Room Only',value:{code:'EP' ,name:'Room Only'}},
    {label:'With Breakfast',value:{code:'CP' ,name:'With Breakfast'}},
    {label:'Breakfast & One Major Meal',value:{code:'MP' ,name:'Breakfast & One Major Meal'}},
    {label:'Breakfast, Lunch, Dinner',value:{code:'AP' ,name:'AP – Breakfast, Lunch, Dinner'}},
  ])
  // console.log()
  const gstOptions = props?.gstDetails?.map((details,index)=>{
    return {label:details.gst_no,value:details.gst_id}
  })
  const purposeOptions = [
    {label:'Social',value:'Social'},
    {label:'Corporate',value:'Corporate'},
    {label:'Leisure',value:'Leisure'},
  ]
  const onSubmit = (data) => {
    var values = {}
    values['roomPlan'] = room_plan
    values['roomType'] = room_type
    values['gst'] = gst?'Yes':'No'
    values['gstNumber'] = data.gst_number
    values['purpose_of_travel'] = data.purpose

    if (props.type){
      values['meal_plan'] = data.meal_plan
      if (data.hotel_id){
        values['hotel_id'] = data.hotel_id
        values['hotel_name'] = null
      }
      else{
        values['hotel_name'] = data.hotel_name
      }
    }
    props.setTravelInfo(values)
    // console.log(values)
    let arr = props.completed.map((value,index)=>{
      if (props.index === index)
      return true;
      else
      return value;
    })
    props.setCompeleted(arr)
    props.setExpanded(props.index+1)
  }
  const handleChange = useCallback((inputValue) => {setHotelName(inputValue?inputValue:'')}, []);

  const handleCreate = useCallback(
    (inputValue) => {
      const newValue = { value: inputValue, label: inputValue };
      setHotelOptions([...hotelOptions, newValue]);
      setHotelName(newValue.value);
    },
    [hotelOptions]
  );

  const loadOptions = (inputValue, callback) =>
    setTimeout(async() => {
      if (hotelName.trim().length !== 0){
        const response =  await fetchDataWithAuth(`${NODE_API_URL}/hotelnames?hotel_name=${hotelName}`,'GET',null,null,null);
        if (response.status){
          setHotelOptions(response.data)
        }
        callback(
          hotelOptions.filter((item) =>
            item.label.toLowerCase().includes(inputValue.toLowerCase())
          )
        );
      }
    }, 5000);
  return (
    <div className="booking-card-wrapper">
      <form onSubmit={handleSubmit(onSubmit)}>
      <div className="booking-overview-bottom">
        <div className="booking-form">
          <Form.Group hidden={props.type}>
            <Form.Label>Room Type</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Superior Room"
              name='room_type'
              id='room_type'
              className='bg-light'
              // {...register('room_type', { required:true })} 
              value={capitalize(room_type)}
              disabled
              // value={props.travelInfo['room_type']}
            />
            {errors['room_type'] && (
              <span className="text-danger mt-1">
                *This is a required field
              </span>
            )}

          </Form.Group>

          <Form.Group hidden={props.type}>
            <Form.Label>Room Plan</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Room Only"
              name='room_plan'
              className='bg-light'
              value={capitalize(room_plan)}
              disabled
              // {...register('room_plan', { required:true })}  
              // value={props.travelInfo['room_plan']}
             
            />
            {errors['room_plan'] && (
              <span className="text-danger mt-1">
                *This is a required field
              </span>
            )}
          </Form.Group>
          <Form.Group hidden={props.type !== 'ManualBooking'}>
            <Form.Label>Hotel Name</Form.Label>
            <AsyncCreatableSelect
                isSearchable
                placeholder={'Select Hotel'}
                value={hotelName?hotelOptions.filter((val)=>val.label === hotelName?val:''):''}
                options={hotelOptions}
                onChange={(e)=>{
                  // handleChange(e);
                  if(e.value !== e.id){
                    setValue('hotel_id',e.id)
                  }
                  else{
                    setValue('hotel_name',e.value)
                  }
                }}
                onCreateOption={handleCreate}
                onInputChange={handleChange}
                cacheOptions
                className='form-control m-0 p-2'
                loadOptions={loadOptions}
                {...register('hotel_name', { required:props.type === 'ManualBooking'?true:false })}  
            />
            {errors['room_plan'] && (
              <span className="text-danger mt-1">
                *This is a required field
              </span>
            )}
          </Form.Group>
          <Form.Group hidden={!props.type}>
            <Form.Label>Meal Plan</Form.Label>
            <Select {...register('meal_plan', { required:props.type?true:false })}  name='meal_plan' isClearable onChange={(e)=>e?setValue('meal_plan',e.value):setValue('meal_plan','')} className='form-control m-0 p-2' placeholder='Select Plan' options={planOptions} />
            {errors['meal_plan'] && (
              <span className="text-danger mt-1">
                *This is a required field
              </span>
            )}
          </Form.Group>
          <Form.Group >
            <Form.Label>Purpose of Travel</Form.Label>
            <Select {...register('purpose', { required:true})}  name='purpose' isClearable onChange={(e)=>e?setValue('purpose',e.value):setValue('purpose','')} className='form-control m-0 p-2' placeholder='Select purpose' options={purposeOptions} />
            {errors['purpose'] && (
              <span className="text-danger mt-1">
                *This is a required field
              </span>
            )}
          </Form.Group>
         
          <Form.Group>
            <Form.Label className='text-black-100' style={{color:'#1A1A1A'}}>Do you wish to claim GST input?</Form.Label>
            <Form.Check
              inline
              // className="form-check-input"
              label="Yes"
              value={'Yes'}
              className={gst === false?'text-muted checkbox-cus':'form-check checkbox-cus'}
              name="gst"
              {...register('gst', { required:true })}  
              onChange={(e)=>{
                setGst(true)
                props.setGst(true)
                if (props?.gstDetails?.length === 0 ){
                  toast.error('Add GSTIN in your profile')
                }
                unregister('gst_number')
                register('gst_number', { required:true })
              }}
              type="radio"
              id="inline-radio1"
            />
            <Form.Check
              inline
              // className="form-check-input"
              label="No"
              className={gst === true?'text-muted checkbox-cus':'form-check checkbox-cus'}
              value={'No'}
              name="gst"
              {...register('gst', { required:true })} 
              onChange={(e)=>{
                setGst(false)
                props.setGst(false)
                unregister('gst_number')
                register('gst_number', { required:false })
              }} 
              type="radio"
              id="inline-radio2"
            />
            {errors['gst'] && (
              <span className="text-danger mt-1">
                <br />*This is a required field
              </span>
            )}
          </Form.Group>
          <Form.Group hidden={!gst && !(gst === '') }>
            <Form.Label>GST identification number</Form.Label>
            {/* <Form.Control type="text" 
              placeholder="Enter your GST number"
              // value={props.travelInfo['gst_number']}
              {...register('gst_number', { required:gst })} 
              name={'gst_number'}
              id={'gst_number'} 
             
            /> */}
            <Select name='gst_number' isClearable onChange={(e)=>e?setValue('gst_number',e.value):setValue('gst_number','')} className='form-control m-0' placeholder='Select your GST number' options={gstOptions} />
            {errors['gst_number'] && (
              <span className="text-danger mt-1">
                *This is a required field
              </span>
            )}
          </Form.Group>
         
        </div>
      </div>
      <div className="booking-action-button">
        <button className="btn btn__primary cus-btn" type="submit">Continue</button>
      </div>
      </form>
    </div>
  );
};

export default TravelerInfo;