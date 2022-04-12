/* eslint-disable prettier/prettier */
import PageLayout from "../../components/layouts/pageLayout";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { API_URL, reloadPageWithUrl, NODE_API_URL, getUrlParameter } from "../../utils/helper";
import { fetchFormDataWithAuth, fetchDataWithAuth, fetchgetServerSidePropsWithAuth } from "../../utils/apiHelper";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
// import AcceptedIcon from '../../public/images/svg/approved.svg'
import Footer from "../../components/pageComponents/footer/footer";
import TravelerInfo from "../../components/pageComponents/booking/travelerInfo";
import ContactInfo from "../../components/pageComponents/booking/contactInfo";
import SpecialRequest from "../../components/pageComponents/booking/specialRequest";
import PaymentMethod from "../../components/pageComponents/booking/paymentMethod";
import RequestBooking from "../../components/pageComponents/booking/RequestBooking";
import BookingRoom from "../../components/pageComponents/booking/bookingRoom";
import HotelNotFound from "../../components/pageComponents/booking/hotelNotFound";
import { Card, Col, Row } from "react-bootstrap";
import { object } from "yup";
import moment from "moment";
import { toast } from "react-toastify";
const Booking = (props) => {
  const router = useRouter();
  const [gstDetails,setGstDetails]=useState([])
  const [data, setData] = useState({});
  const [price, setPrice] = useState({});
  const [reCheck,setReCheck] = useState({})
  const [rprice, setrprice] = useState(); //room price selected
  const [code, setCode] = useState("");
  const [source, setSource] = useState("");
  const [id, setId] = useState("");
  const [rate, setRate] = useState("");
  const [rid, setRid] = useState("");
  const [adultCount, setadultCount] = useState();
  const [childCount, setchildCount] = useState();
  const [roomCount, setroomCount] = useState();
  const [creditData,setCreditData] = useState('')
  var url = new URL(API_URL + router.asPath);
  var params = new URLSearchParams(url.search);
  const [fromdate, setFromdate] = useState(
    params.get("checkin") ? new Date(params.get("checkin")) : moment().add(1, "days")
  );

  const [todate, setTodate] = useState(
    params.get("checkout") ? new Date(params.get("checkout")) : moment(fromdate).add(1, "days")._d
  );
  const [completed, setCompeleted] = useState([false, false, false, false]);
  const [expanded, setExpanded] = useState(0);
  const [loader, setLoader] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState([
    {
      roomId: roomCount,
      adults: 1,
      children: 0,
      children_age: [],
    },
  ]);
  function Approved() {
    return <img src="/images/approved.svg" className="m-3" width={"15px"} height={"15px"} />;
  }
  const [hotelCode,setHotelCode] = useState('')
  const [reload,setReload] = useState(false)
  const [travelInfo, setTravelInfo] = useState({});
  const [specialRequest, setSpecialRequest] = useState({});
  const [contactInfo, setContactInfo] = useState([]);
  const [contactInfoValues, setContactInfoValues] = useState({});
  const [paymentMethod, setPaymentMethod] = useState({ method: "2Hub Wallet" });
  const [roomPlan, setRoomPlan] = useState("");
  const [walletAmount, setWalletAmount] = useState("");
  const [creditAmount, setCreditAmount] = useState("");
  const [visible,setVisible] = useState(false);
  const [type,setType] = useState('')
  const [gst,setGst] = useState(true)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (value) => {
    if (expanded === value) setExpanded(-1);
    else setExpanded(value);
  };
  async function handleSubmit() {
    if (Object.keys(travelInfo).length === 0) setExpanded(0);
    else if (Object.keys(contactInfoValues).length === 0) setExpanded(1);
    else {
      // alert("hi")
      setCompeleted([true, true, true, true,true,true]);
      if (!type){
        let body = {};
        body["flight_details"] = {};
        body["guest_detail"] = contactInfoValues;
        let room_detail = {};
        room_detail["hotel_code"] = code;
        room_detail['hotel_source'] = data?.[0]?.hotel_source
        room_detail['city'] = getUrlParameter('city')
        // room_detail["meal_plan"] = roomPlan;
        room_detail["room"] = data?.[0]?.rooms[id].code;
        room_detail["room_amount"] = reCheck?.net;
        room_detail["rate_key"] = reCheck?.ratekey;
        room_detail['rooms'] = localStorage.getItem('room_details')?JSON.parse(localStorage.getItem('room_details')):[]
        body["room_detail"] = room_detail;
        let bookingDetails = {};
        bookingDetails["nationality"] = "IN";
        bookingDetails["check_in"] = getUrlParameter('checkin') || fromdate;
        bookingDetails["purpose_of_visit"] = "Testing";
        bookingDetails["check_out"] = getUrlParameter('checkout') || todate;
        bookingDetails["spl_request"] = specialRequest;
        bookingDetails["is_gst_input_claimed"] = travelInfo.gst === "No" ? false : true;
        bookingDetails["gst_detail_id"] = travelInfo.gstNumber?travelInfo.gstNumber:null;
        bookingDetails["t_and_c_accepted"] = true;
        bookingDetails["booking_amount"] = rate;
        bookingDetails["net_price"] = reCheck?.net_price; //net_amount in recheck
        bookingDetails['hotel_tariff'] = reCheck?.hotel_tariff  
        bookingDetails["tax_amount"] = data?.[0]?.srp_info?.totalTax; //amount added in booking room card
        bookingDetails["markup_price"] = reCheck?.markup_price; //same markup in recheck 
        bookingDetails["tax_percent"] = 18;
        bookingDetails["commission_at"] = 0;
        bookingDetails['govt_tax_amount'] = reCheck?.govt_tax_amount
        bookingDetails['hotel_tax_amount'] = reCheck?.hotel_tax_amount
        bookingDetails["voucher_remarks"] = false;
        bookingDetails['purpose_of_visit'] = travelInfo.purpose_of_travel
        bookingDetails['meal_plan'] = travelInfo.meal_plan
        body["booking_detail"] = bookingDetails;
        let guest_room = [];
        for (let i = 1; i <= rooms.length ; i++) {
          guest_room.push([i.toString()]);
        }
        body["guest_room"] = guest_room;
        body["booking_intent"] = "";
        body["instant_booking"] = true ;
        body["create_payment"] = paymentMethod.method == "2Hub Wallet" ? false : true;
        body["payment_mode"] = paymentMethod.method === "2Hub Wallet" ? "Wallet" : paymentMethod.method;
        body["ratekeys"] = reCheck.ratekeys;
        body['cancellation_policies'] = reCheck.cancellation
        submit(body);
      }
      else{
        setLoader(true)
        let guest_room = [];
        for (let i = 1; i <= rooms.length ; i++) {
          guest_room.push([i.toString()]);
        }
        let body = {
          "city":params.get('city'),
          "check_in":moment(params.get('checkin')).format('YYYY-MM-DD'),
          "check_out":moment(params.get('checkout')).format('YYYY-MM-DD'),
          "rooms":JSON.parse(localStorage.getItem('room_details')),
          "guest_room":guest_room,
          "guest_detail":contactInfoValues,
          "is_gst_input_claimed" : travelInfo.gst === "No" ? false : true,
          "gst_detail_id" : travelInfo.gstNumber?travelInfo.gstNumber:null,
          "type": type === "ManualBooking"?"Manual Booking":"Request Booking",
          "meal_plan": travelInfo.meal_plan,
          "purpose_of_visit": travelInfo.purpose_of_travel,
        }
        if (type === 'ManualBooking'){
          body["hotel_name"]=travelInfo.hotel_name?travelInfo.hotel_name:null;
          body["hotel_id"]=travelInfo.hotel_id?travelInfo.hotel_id:null;
        }
        else{
          body["hotel_code"]=getUrlParameter('hotelcode')?getUrlParameter('hotelcode'):''
          body["hotel_source"]=getUrlParameter('source')?getUrlParameter('source'):''
        }
        // console.log(body)
        const response = await fetchDataWithAuth(`${NODE_API_URL}/manualBooking/create`,"POST",'',{'Content-Type':'application/json'},body)
        if (response.status){
          toast.success('Requesting Booking done')
        }
        else{
          toast.error(response.message);
        }
        setLoader(false)
      }
    }
  }
  const submit = async (body) => {
    setLoader(true);
    const data = await fetchFormDataWithAuth(
      `${API_URL}/api/agent/bookings/submit`,
      "POST",
      "",
      [],
      JSON.stringify(body)
    );
    // console.log(data);
    if (data.error || data['booking response']?.error !== undefined) {
      // console.log(data.error);
      setLoader(false);
      router.push(`/bookings/failure?message=${data['booking response']?.error?data['booking response']?.error?.message:data.error}`);
    } else {
      if (paymentMethod.method === "2Hub Wallet" || paymentMethod.method === 'Credit') {
        setLoader(false);
        router.push(`/bookings/success?reference=${data["booking response"]?.booking?.reference}&id=${data["booking response"]?.booking?.merchan_params2}`);
      } else  {
        if (data.redirect_url != "") {
          setLoader(false);
          reloadPageWithUrl(data.redirect_url);
        }
      }
    }
    setLoader(false);
  };
  const fetchWalletInfo = async () => {
    const data = await fetchDataWithAuth(`${NODE_API_URL}/wallet/info`, "GET", "", [], null);
    setWalletAmount(data?.data?.amount || "");
  };
  const fetchCreditInfo = async () =>{
    const response = await fetchDataWithAuth(`${NODE_API_URL}/getAgentCredit`, "GET", "", [], null);
    setVisible(response?.data?.credit?.credit_agent_id === undefined?false:true)
    setCreditData(response?.data?.credit)
    setCreditAmount(response?.data?.credit?.available_limit);
  }
  useEffect(()=>{
    window.scrollTo({top: 0,behavior: 'smooth'});
    fetchWalletInfo();
    fetchCreditInfo();
    var url = window.location.search;
    var params = new URLSearchParams(url);
    setCode(params.get("hotelcode") || "");
    setSource(params.get("source") || "");
    setadultCount(+params.get("adult") || 1);
    setchildCount(+params.get("child") || 0);
    setroomCount(params.get("rooms") || 1);
    setrprice(params.get("rooms") || "No Rate Plan selected");
    setRooms(JSON.parse(localStorage.getItem("room_details")));
    setRoomPlan(params.get("roomplan") || "");
    setType(params.get('type')?params.get('type'):'')
    setId(Number(params.get("pid")));
    setRid(Number(params.get("rid")));
    // setHotelCode(Number(params.get('hotel')))
  }, []);
  useEffect(() => {
    setContactInfo(new Array(params.get("rooms")).fill(1));
    getGSTList();
  }, [rooms]);
  useEffect(() => {
    gethotels();
  }, [code,source,id,rid]);

  const getGSTList = async () =>{
    try {
      const response =  await fetchDataWithAuth(
        `${NODE_API_URL}/user/agent/gstList`,
        "GET",
        null,
        null,
        null,
      );
      if (response.status)
      setGstDetails(response?.data)
    } catch (error) {
      console.log(error)
    }
  }
  const gethotels = async () => {
    let fdate = moment(fromdate).format("YYYY-MM-DD");
    let tdate = moment(todate).format("YYYY-MM-DD");
       setLoading(true)
    if (code || id || rid) {
      // Content data Fetch
      const payload = {
        code: parseInt(code),
        source: source,
        from: 0,
        checkin: fdate,
        checkout: tdate,
        rooms: rooms,
        roomIdx:id,
        rateIdx:rid,
      };
      const responses = await fetchFormDataWithAuth(
        `${NODE_API_URL}/hotel/prices`,
      "POST",
      null,
      { "Content-Type": "application/json" },
      JSON.stringify(payload)
      );
    
      setData(responses?.["data"]?.response);
      // Recheck Rates
      const reCheckPayload = {
        ...responses?.["data"]?.response?.[0]?.rooms?.[id]?.rates?.[rid],
        ...responses?.["data"]?.response?.[0]?.srp_info,
        'hotel_code':code,
      }
      if (!type){
        const reCheckData = await fetchDataWithAuth(`${API_URL}/api/agent/recheck-rates/`, 'POST', null, { 'Content-Type': 'appliction/json' }, reCheckPayload)
        setReCheck(reCheckData)
      }
      setLoading(false);
    }
    setLoading(false);
  };

        
  const hotels = {
    city: data?.[0]?.city || "",
    star: data?.[0]?.starRating || 0,
    images: data?.[0]?.images[0],
    adults:adultCount,
    children: childCount,
    rooms: rooms.length,
    about: data?.[0]?.description,                                                                                                                            
    rackRate: data?.[0]?.srp_info?.bar?.toLocaleString("en-IN") || "NA",
    netPayable: data?.[0]?.srp_info?.minRate?.toLocaleString("en-IN") || "NA",
    marginRate: data?.[0]?.srp_info?.margin?.toLocaleString("en-IN") || "NA",
  };
  return (
    <PageLayout title="2hub | Hotels">
      <div className="hotelbooking_wrapper">
        <div className="back-to">
          <a onClick={() => router.back()}>
            <img src="/images/back.png" />
            <span>Modify your booking</span>
          </a>
        </div>
        <div className="booking-flow-wrapper">
          <div className="booking-steps-wrapper">
            <Accordion style={{ boxShadow: "none" }} expanded={expanded === 0}>
              <AccordionSummary
                onClick={() => handleChange(0)}
                expandIcon={completed[0] && expanded !== 0 ? <Approved /> : ""}
                aria-controls="panel1a-content"
                id="panel1a-header"
                className="p-1"
                style={{ backgroundColor: "#F5F5F5",minWidth:'100$' }}
              >
                <Row>                                                 
                  <Col xs={1} sm={2} md={2}>
                    <img className='mx-3' src="/images/info.png" />
                  </Col>
                  <Col xs={8} sm={6} md={8}>
                    <h6 className="mt-1 mx-3" style={{fontWeight:'normal'}}>Traveller Info</h6>
                  </Col>
                </Row>
              </AccordionSummary>
              <AccordionDetails>
                <TravelerInfo
                  travelInfo={travelInfo}
                  setTravelInfo={setTravelInfo}
                  setCompeleted={setCompeleted}
                  type={type}
                  completed={completed}
                  index={0}
                  setExpanded={setExpanded}
                  gstDetails={gstDetails}
                  setGst={setGst}
                />
              </AccordionDetails>
            </Accordion>
            <Accordion className="mt-4" style={{ boxShadow: "none" }} expanded={expanded === 1}>
              <AccordionSummary
                onClick={() => handleChange(1)}
                expandIcon={completed[1] && expanded !== 1 ? <Approved /> : ""}
                aria-controls="panel1a-content"
                id="panel1a-header"
                className="p-1"
                style={{ backgroundColor: "#F5F5F5",minWidth:'100$' }}
              >
                <Row>
                  <Col xs={1} sm={2} md={2}>
                  <img className='mx-3' src="/images/contact.png" />
                  </Col>
                  <Col xs={10} sm={10} md={10}>
                    <h6 className="mt-1 mx-3" style={{fontWeight:'normal'}}>Contact Details</h6>
                  </Col>
                </Row>
              </AccordionSummary>
              <AccordionDetails>
                <ContactInfo
                  rooms={rooms}
                  room={hotels.rooms}
                  reload={reload}
                  contactInfo={contactInfo}
                  contactInfoValues={contactInfoValues}
                  setContactInfoValues={setContactInfoValues}
                  setContactInfo={setContactInfo}
                  setCompeleted={setCompeleted}
                  completed={completed}
                  index={1}
                  setExpanded={setExpanded}
                />
              </AccordionDetails>
            </Accordion>
            <Accordion className="mt-4" style={{ boxShadow: "none" }} expanded={expanded === 2}>
              <AccordionSummary
                onClick={() => handleChange(2)}
                expandIcon={completed[2] && expanded !== 2 ? <Approved /> : ""}
                aria-controls="panel1a-content"
                id="panel1a-header"
                className="p-1"
                style={{ backgroundColor: "#F5F5F5",minWidth:'100$' }}
              >
                <Row>
                  <Col xs={1} sm={2} md={2}>
                  <img className='mx-3' src="/images/request.png" />
                  </Col>
                  <Col xs={10} sm={10} md={10}>
                    <h6 className="mt-0 mx-3" style={{fontWeight:'normal'}}>Special Request</h6>
                  </Col>
                </Row>
              </AccordionSummary>
              <AccordionDetails>
                <SpecialRequest
                  specialRequest={specialRequest}
                  setSpecialRequest={setSpecialRequest}
                  setCompeleted={setCompeleted}
                  completed={completed}
                  index={2}
                  setExpanded={setExpanded}
                />
              </AccordionDetails>
            </Accordion>
            {
              !type &&  <Accordion hidden={type} className="mt-4 mb-4" style={{ boxShadow: "none" }} expanded={expanded === 3}>
              <AccordionSummary
                onClick={() => handleChange(3)}
                expandIcon={completed[3] && expanded !== 3 ? <Approved /> : ""}
                aria-controls="panel1a-content"
                id="panel1a-header"
                className="p-1"
                style={{ backgroundColor: "#F5F5F5",minWidth:'100$' }}
              >
                <Row>
                  <Col xs={1} sm={2} md={2}>
                  <img className='mx-3' src="/images/request.png" />
                  </Col>
                  <Col xs={10} sm={10} md={10}>
                    <h6 className="mt-0 mx-3" style={{fontWeight:'normal'}}>Payment Method</h6>
                  </Col>
                </Row>
              </AccordionSummary>
              <AccordionDetails>
                <PaymentMethod
                  loader={loader}
                  type={type}
                  visible={visible}
                  rate={rate}
                  walletAmount={walletAmount}
                  creditAmount={creditAmount}
                  paymentMethod={paymentMethod}
                  handleSubmit={handleSubmit}
                  setPaymentMethod={setPaymentMethod}
                  setCompeleted={setCompeleted}
                  completed={completed}
                  index={3}
                  setExpanded={setExpanded}
                />
              </AccordionDetails>
            </Accordion>
            }
            {
                type === 'RequestBooking' && <Accordion className="mt-4 mb-4" style={{ boxShadow: "none" }} expanded={expanded === 4}>
                <AccordionSummary
                  onClick={() => handleChange(4)}
                  expandIcon={completed[4] && expanded !== 4 ? <Approved /> : ""}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                  className="p-1"
                  style={{ backgroundColor: "#F5F5F5",minWidth:'100$' }}
                >
                  <Row>
                    <Col xs={1} sm={2} md={2}>
                    <img className='mx-3' src="/images/request.png" />
                    </Col>
                    <Col xs={10} sm={10} md={10}>
                      <h6 className="mt-0 mx-3" style={{fontWeight:'normal'}}>Request Booking</h6>
                    </Col>
                  </Row>
                </AccordionSummary>
                <AccordionDetails>
                  <RequestBooking
                    loader={loader}
                    type={type}
                    visible={visible}
                    walletAmount={walletAmount}
                    creditAmount={creditAmount}
                    paymentMethod={paymentMethod}
                    handleSubmit={handleSubmit}
                    setPaymentMethod={setPaymentMethod}
                    setCompeleted={setCompeleted}
                    completed={completed}
                    index={4}
                    setExpanded={setExpanded}
                  />
                </AccordionDetails>
              </Accordion>
             }
            {
                type === 'ManualBooking' && <Accordion className="mt-4 mb-4" style={{ boxShadow: "none" }} expanded={expanded === 5}>
                <AccordionSummary
                  onClick={() => handleChange(5)}
                  expandIcon={completed[5] && expanded !== 5 ? <Approved /> : ""}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                  className="p-1"
                  style={{ backgroundColor: "#F5F5F5",minWidth:'100$' }}
                >
                  <Row>
                    <Col xs={1} sm={2} md={2}>
                    <img className='mx-3' src="/images/request.png" />
                    </Col>
                    <Col xs={10} sm={10} md={10}>
                      <h6 className="mt-0 mx-2" style={{fontWeight:'normal'}}>Hotel Not Found Booking</h6>
                    </Col>
                  </Row>
                </AccordionSummary>
                <AccordionDetails>
                  <HotelNotFound
                    loader={loader}
                    type={type}
                    visible={visible}
                    walletAmount={walletAmount}
                    creditAmount={creditAmount}
                    paymentMethod={paymentMethod}
                    handleSubmit={handleSubmit}
                    setPaymentMethod={setPaymentMethod}
                    setCompeleted={setCompeleted}
                    completed={completed}
                    index={5}
                    setExpanded={setExpanded}
                  />
                </AccordionDetails>
              </Accordion>
            }
            
            {/* cancellation policy */}
            <div className="cancellation_policy">
              <h2>Cancellation policy</h2>
              <p>
                Photo ID proof with permanent address required for all guests before check in. Number of guests staying
                at the apartment must be as per the booking, additional guest stay overnight is not allowed . For a
                booking of two guests, one double bedroom will be provided, the other will be empty and locked.
              </p>
              <Card className="mt-2 mb-3" hidden={type} style={{backgroundColor:'#F5F5F5'}}> 
              <Card.Body style={{color:''}}  className="text-align-center text-center">
                <p className="mb-1" style={{fontWeight:"bolder",fontSize:'1rem'}}>Cancellation Charges :</p>
                INR {Math.ceil(Number(reCheck?.cancellation?.[0]?.amount))} , 
                {" "}from {" "}{moment(reCheck?.cancellation?.[0]?.from).format('LLLL')}
              </Card.Body>
            </Card>
            </div>
          </div>
          <div className="booking-trip-wrapper">
            <BookingRoom
              type={type}
              setContactInfo={setContactInfo}
              setRate={setRate}
              reload={reload}
              setReload={setReload}
              gst={gst}
              name={hotels.name}
              image={hotels.images}
              loading={loading}
              city={hotels.city}
              adult={hotels.adults}
              child={hotels.children}
              rprice={rprice}
              rackRate={hotels.rackRate}
              netpayable={data?.[0]?.srp_info?.minRate || " "}
              rating={ data?.[0]?.reviews?.[0]?.rate ? data?.[0]?.reviews?.[0]?.rate: " "}
              rating_count={data?.[0]?.reviews?.[0] ? data?.[0]?.reviews?.[0]?.reviewCount : " "}
              rooms={hotels.rooms}
              checkin={moment(fromdate).format("MMM DD")}
              checkout={moment(todate).format("MMM DD")}
              PDP={Number(reCheck.net_price/data?.[0]?.srp_info?.days) || 0}
              PDT={data?.[0]?.srp_info?.perDayTax || 0}
              govt_tax_amount={reCheck?.govt_tax_amount|| 0}
              hotel_tax_amount={reCheck?.hotel_tax_amount || 0}
              days={data?.[0]?.srp_info?.days || " "}
              cancellation={reCheck.cancellation}
              net_price = {reCheck.net_price}
            />
          </div>
        </div>
      </div>
      <Footer id="footer" />
    </PageLayout>
  );
};

export const getServerSideProps = async (context) => {
  const profile = await fetchgetServerSidePropsWithAuth(
    `${NODE_API_URL}/user/agent/gstList`,
    "GET",
    null,
    null,
    null,
    context
  );
  return {props:{profile}};
};

export default Booking;
