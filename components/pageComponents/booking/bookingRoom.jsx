import moment from "moment";
import { useRouter } from "next/router";
import { useEffect , useState , useRef} from "react";
import { Card, Form, Spinner} from "react-bootstrap";
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";
import 'react-dates/initialize';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-dates/lib/css/_datepicker.css';
import AsyncSelect from "react-select/async";
import { API_URL } from "../../../utils/helper";
const Bookingroom =  (props) => {
  const router = useRouter()
  var location = router.asPath;
  const [show,setShow]=useState(false)
  var params = new URLSearchParams(location);
  var new_total_tax = 0;
  if (props.gst){
    new_total_tax += (Number (props.govt_tax_amount) + Number(props.hotel_tax_amount))
  }
  else{
    new_total_tax += Number (props.govt_tax_amount)
  }
  
  const total_price = new_total_tax + Number(props.net_price);
  props.setRate(total_price)


  var today = new Date();
  var dd = today.getDate() + 1;
  var mm = today.getMonth() + 1; //As January is 0.
  var yyyy = today.getFullYear();
  var todayDateString = dd + "/" + mm + "/" + yyyy;
  const [reload, setReload] = useState(false); 
  // console.log();

  // const query=router.query;

  var url = new URL(API_URL + router.asPath);
  var params = new URLSearchParams(url.search);
  // console.log(params.get("checkin"))

  // City Search Options and setting Value
  const [search, setSearch] = useState(false); //open and close
  const lightPickRef = useRef(null);
  const [citys,setCitys] =useState("")
  const [city, setCity] = useState(params.get("city") || "");
  const [errorText, setErrorText] = useState(false);
  const [guest, setGuest] = useState(false);
  const [adultCount, setadultCount] = useState(
    +(params.get("adult") || "1").split("_").reduce((prev, count) => +prev + +count)
  );
  const [childCount, setchildCount] = useState(
    +(params.get("child") || "0").split("_").reduce((prev, count) => +prev + +count)
  );
  const [fromdate, setFromdate] = useState(
    params.get("checkin") ? new Date(params.get("checkin")) : moment(today).add(1, "days")
  );

  const [todate, setTodate] = useState(
    params.get("checkout") ? new Date(params.get("checkout")) : moment(fromdate).add(1, "days")
  );
  const [intervalID, setIntervalID] = useState(0);

  const [rooms, setRooms] = useState(
    Array.from({ length: +params.get("rooms") || 1 }).map((_, i) => {
      let children_age = !(+params.get("child")?.split("_")[i]) ? [] :
        (params
          .get("children_age")
          ?.split("_")
          ?.[i]?.split("-")
          .map((a) => +a) || Array.from({ length: +(params.get("child") || "0").split("_")[i] || 0 }).map((_) => 0));
     
      return {
        roomId: i + 1,
        adults: +(params.get("adult") || "1").split("_")[i] || 1,
        children: +(params.get("child") || "0").split("_")[i] || 0,
        children_age,
      };
    })
  );
  const searchoptions = [
    { value: "Alapuzha", label: "Alapuzha" },
    { value: "Bangalore", label: "Bangalore" },
    { value: "Delhi", label: "Delhi" },
    { value: "Chennai", label: "Chennai" },
    { value: "Goa", label: "Goa" },
    { value: "Mumbai", label: "Mumbai" },
  ];

  // AsyncSelect INPUT FOR CITY
  const handleInputChange = (value) => {
     let c = value;
      c = c.charAt(0).toUpperCase() + c.slice(1);
      setCitys(c)
    setSearch(c);
  };

  const handleChange = (value) => {
    // setCity(value.value||"");
  
    if (value) {
      setCity(value.value || "");
      setErrorText(false);
    }
    else setCity("");
    
  };

  const loadOptions = async (inputText, callback) => {
    const response = await fetch(`${API_URL}/api/agent/cities?city=${citys || inputText}`);
    const json = await response.json();
    callback(json.map((i) => ({ label: i, value: i })));
  };

  const toggleGuest = () => {
    setGuest(!guest);
  };

  const addAdult = (index) => {
    const tempRooms = [...rooms];
    const singleRoom = { ...tempRooms[index] };
    if (singleRoom && singleRoom.adults < 3) {
      setadultCount((prevState) => prevState + 1);
      singleRoom.adults += 1;
      tempRooms[index] = singleRoom;
      setRooms(tempRooms);
    }
  };

  const subtractAdult = (index) => {
    const tempRooms = [...rooms];
    const singleRoom = { ...tempRooms[index] };

    if (singleRoom && singleRoom.adults > 1) {
      setadultCount((prevState) => prevState - 1);
      singleRoom.adults -= 1;
      tempRooms[index] = singleRoom;
      setRooms(tempRooms);
    }
  };

  const addChild = (index) => {
    const tempRooms = [...rooms];
    let singleRoom = { ...tempRooms[index] };
    
    if (singleRoom && singleRoom.children < 2) {
      console.log("called addChild func")
      setchildCount((prevState) => prevState + 1);

      singleRoom.children += 1;
      let childrenAge = [...singleRoom.children_age]
      childrenAge.push(0);
      singleRoom.children_age = childrenAge
      tempRooms[index] = singleRoom;
      setRooms(tempRooms);
      console.log("temp=>",tempRooms)
    }
  };

  const subtractChild = (index) => {
    const tempRooms = [...rooms];
    const singleRoom = { ...tempRooms[index] };

    if (singleRoom && singleRoom.children) {
      setchildCount((prevState) => prevState - 1);

      singleRoom.children -= 1;
      singleRoom.children_age.pop();
      tempRooms[index] = singleRoom;
      setRooms(tempRooms);
    }
  };

  const addRoom = async() => {
    setadultCount((prevState) => prevState + 1);
    await setRooms((prevState) => [
      ...prevState,
      {
        roomId: prevState.length + 1,
        adults: 1,
        children: 0,
        children_age: [],
      },
    ]);
    
  };

  const removeRoom = (index) => {
    setadultCount((prevState) => prevState - rooms[index].adults);
    setchildCount((prevState) => prevState - rooms[index].children);
    setRooms((prevState) => prevState.filter((room, idx) => idx !== index));
  };


  // Submit Form
  const submitForm = async (e) => {
    e.preventDefault()
    try{
        let fdate = moment(fromdate).format("YYYY-MM-DD");
        let tdate = moment(todate).format("YYYY-MM-DD");
        const booking = {
          checkin: fdate,
          checkout: tdate,
          adults: adultCount,
          children: childCount,
          rooms: rooms.length,
        };
        props.setContactInfo(new Array(rooms.length).fill(1))
        await localStorage.setItem('room_details',JSON.stringify(rooms))
        let query = {} 
        query['city'] = city
        query['checkin']=fdate
        query['checkout']=tdate
        query['adult']=adultCount
        query['child']=childCount
        query['rooms']=rooms.length
        query['type']='ManualBooking'
        router.push({pathname:'/bookingnew',query:query})
        props.setReload(!props.reload)
    } catch (error) {
      console.log(error);
    }

  };

  useEffect(()=>{

  },[props,props.reload])
   return (
     <div className="desktop-view">
        <div className="trip_cards" >
              <h2>Your Trip</h2>
         </div>
       {
         props.type !=='ManualBooking' &&  <div>
        
         <Form>
         <Form.Group className="form-controls">
               <div className="form-group-icon form-trip-cards">
                 <span className="icon-group">
                   <img src="/images/calender.svg"  alt=""/>
                 </span>
                 <div className=" date-picker">
                   <Form.Control disabled style={{background:"none"}} value={`${props.checkin} - ${props.checkout}`} />
                 </div>
               </div>
         </Form.Group>
         {/* selecting adult */}






         <Form.Group className="form-controls">
               <div className="form-group-icon form-trip-cards">
                 <span className="icon-group">
                   <img src="/images/guest.svg" />
                 </span>

                 <Form.Control
                   disabled style={{background:"none"}}
                   value={`${props.adult} Adult , ${props.child} Children , ${props.rooms}  ${props.rooms === 1 ?'Room':'Rooms'}`}
                 />
               </div>
             </Form.Group>
          </Form>
           <div className="bookingroom_cards_details" hidden={props.type === 'ManualBooking'}>
              <div className="bookingroom_identity_wrapper">
          <div className="rooms_identity">
                  {typeof(props.PDP)===typeof(Number("")) && !props.loading ?(
                 <>
                  <img src={props.image}  alt="room_pic" width={200} style={{borderRadius:"5px"}} />
                 </>
               ):(<div className="text-center mt-5 pt-1" ><Spinner animation="border" /> </div>)}
                    
                 </div>
                 <div className="room_description">
                    <div className="inner_room_wrapper">
                       <label>{props.rooms} Room</label>
                       <label> <span>.</span> {props.adult} Adults</label>
                       <label> <span>.</span> {props.child} Children</label>
                    </div>
                    <p>{props.name}</p>
                    <label>{props.city}</label>
                    <div className="reviews_count">
                       <h5> <img src="/images/starfilled.png" alt="star" /> {props.rating} </h5>
                       <h5>{props.rating_count} Review</h5>
                    </div>
                 </div>
             </div>
              <div className="price_details" hidden={props.type}>
                 <h2>Price details</h2>
                 <ul>
                 <li>
                   {typeof(props.PDP)===typeof(Number("")) ?(
                 <>
                  <label>₹{Math.ceil(props.PDP)} x {props.days} nights</label>
               
                 </>
               ):(<div style={{width:"50%"}}><Skeleton  /> </div>)}
               
                   {typeof(props.PDP)===typeof(Number("")) ?(
                 <>
                    <span>₹{Math.ceil(props.net_price)?.toLocaleString("en-In")}</span>
                 </>
               ):(<div style={{width:"30%"}}><Skeleton  /> </div>)}
                  
                 </li>
                 <li>
                   <label>Taxes & charges per day</label>
                  
                       {typeof(props.PDP)===typeof(Number("")) ?(
                 <>
                    <span>₹{Math.ceil(new_total_tax / props.days)?.toFixed(2).toLocaleString("en-In")}</span>
                 </>
               ):(<div style={{width:"30%"}}><Skeleton  /> </div>)}
               
                 </li>
                 <li>
                   <label style={{fontWeight:'revert'}}>Total (INR)</label>
                    {typeof(props.PDP)===typeof(Number("")) ?(
                 <>
                   <span className="mt-3">
                     <b>₹ {Math.ceil(total_price).toLocaleString("en-In")}</b>
                     <label>Inclusive of {Math.ceil(new_total_tax).toLocaleString("en-In")} total tax</label>
                   </span>
                 </>
               ):(<div style={{width:"30%"}}><Skeleton  /> </div>)}
               
                 </li>
               </ul>
             </div>
         </div>
   </div>
       }
       {
          props.type === 'ManualBooking' && <section className="m_active" style={{ background: `${'none'}`,width:'100%' }} >
          <Form onSubmit={submitForm}>
            <Form.Group className="form-controls">
              <Form.Label style={{ color: `${'#000'}` }}>Destination</Form.Label>
              <div className="form-group-icon form-trip-cards">
                <span className="icon-group">
                  <img src="/images/location.svg" />
                </span>
                <div className="ml-4 pl-2" style={{ width: "100%" }}>
                  <AsyncSelect
                    cacheOptions
                    value={city ? { value: city, label: city } : ""}
                    placeholder={"Select City"}
                    loadOptions={loadOptions}
                    // defaultInputValue={city}
                    onInputChange={handleInputChange}
                    onChange={handleChange}
                    isClearable={true}
                    // inputValue={city}
                  />
                </div>
              </div>
              
            </Form.Group>
            <Form.Group className="form-controls">
              <Form.Label style={{ color: `${'#000'}` }}>Check in - out</Form.Label>
              <div className="form-group-icon form-trip-cards ">
                <span className="icon-group">
                  <img src="/images/calender.svg" alt="" />
                </span>
                <div id="searchdatepicker" className=" date-picker ml-4 pl-2" style={{ width: "80%" }} >
                
                  <DateRangePicker 
                    onShowCalendar={()=>setShow(true)}
                    onHideCalendar={()=>setShow(false)}
                    onShow={show}
                    initialSettings={{
                      autoApply: true,
                      locale: {
                        format: "MMM DD",
                      },
                      minDate: todayDateString,
                    }}
                    onEvent={(event, picker) => {
                      if (event.type == "apply") {
                        setFromdate(picker.startDate.toISOString());
                        setTodate(
                          picker.endDate
                            .add({ days: picker.endDate.clone().diff(picker.startDate, "days") < 1 ? 1 : 0 })
                            .toISOString()
                        );
                      }
                    }}
                  >
                    <input
                      type="text"
                      className="form-control"
                      autoComplete={false}
                      style={{ paddingLeft: "5px" }}
                      value={`${moment(fromdate).format("MMM DD")} - ${moment(todate).format("MMM DD")}`}
                    />
                  </DateRangePicker> 
                </div>
                <span className="nights">
                  {moment(todate).diff(moment(fromdate), "days")}-
                  {moment(todate).diff(moment(fromdate), "days") === 1 ? "Night" : "Nights"}
                </span> 
              </div>
            </Form.Group>
            <Form.Group className="form-controls">
              <Form.Label style={{ color: `${'#000'}` }}>Guest</Form.Label>
              <div className="form-group-icon form-trip-cards">
                <span className="icon-group">
                  <img src="/images/guest.svg" />
                </span>
                <span className="icon-group-right" onClick={toggleGuest}>
                  <img src="/images/arrowdown.svg" alt="img" />
                </span>
                <div></div>
                <Form.Control
                  type="text"
                  value={`${adultCount} Adult ${childCount} Child ${rooms.length} Rooms`}
                  onClick={toggleGuest}
                />
                {/* use is-open class to open the dropdown */}
                <div
                  className={guest ? "c-dropdown is-open guestdropdown guestcard" : "c-dropdown guestdropdown guestcard"}
                >
                  {rooms.map((room, i) => (
                    <div key={i}>
                      <div className="room-line">
                        <div className="room-heading">
                          <h6>Room {i + 1}</h6>
                          {i > 0 ? (
                            <button
                              className="btn btn__link"
                              onClick={(e) => {
                                e.preventDefault();
                                removeRoom(i);
                              }}
                            >
                              Delete
                            </button>
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="guestdropdown__card">
                          <h5>Adult</h5>
                          <div className="guestdropdown__count">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                subtractAdult(i);
                              }}
                            >
                              <img src="/images/minus.svg" alt="plus" />
                            </button>
                            {/* <input type="text" value={adultCount} /> */}
                            <p className="m-1 mx-2 text-sm text-border">{room.adults}</p>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                addAdult(i);
                              }}
                            >
                              <img src="/images/plus.svg" alt="plus" />
                            </button>
                          </div>
                        </div>
                        <div className="guestdropdown__card">
                          <h5>
                            Child<span>(0-11 Years)</span>
                          </h5>
                          <div className="guestdropdown__count">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                subtractChild(i);
                              }}
                            >
                              <img src="/images/minus.svg" alt="plus" />
                            </button>
                            {/* <input type="text" value="2" /> */}
                            <p className="m-1 mx-2 text-sm text-border">{room.children}</p>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                addChild(i);
                              }}
                            >
                              <img src="/images/plus.svg" alt="plus" />
                            </button>
                          </div>
                        </div>
                        <div className="d-flex select-child">
                          {room.children_age.map((age, index) => {
                            return (
                              <select
                                required
                                key={index}
                                value={String(age) }
                                onChange={(e) => {
                                  const temp2 = +e.target.value? +e.target.value : 0;
                                  setRooms((prev) => {
                                    const temp = [...prev];
                                    temp[i].children_age[index] = temp2;
                                    return temp;
                                  });
                                }}
                              >
                                <option value="0" disabled>
                                  Child {index + 1} age
                                </option>
    
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                                <option value="10">10</option>
                                <option value="11">11</option>
                              </select>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="d-flex justify-content-between guest_rooms_count">
                    <div className="guestdropdown__addrooms">
                      {rooms.length <= 3 ? (
                        <button
                          className="btn btn__link"
                          onClick={(e) => {
                            e.preventDefault();
                            addRoom();
                          }}
                        >
                          Add Rooms
                        </button>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="guestdropdown__addrooms">
                      <button
                        className="btn btn__link"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleGuest();
                        }}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Form.Group>
            <button className="mt-3 btn btn__primary" type="submit">
              Apply Changes
            </button>
          </Form>
          {errorText && <div className="text-danger" style={{position:"absolute"}}> Enter City </div> }
        </section>
       }
    
    </div>
   )
}
export default Bookingroom