import Breadcrumb from "react-bootstrap/Breadcrumb";
import { useState, useEffect } from "react";
import { useRouter, isReady } from "next/router";
import { Form } from "react-bootstrap";
import PageLayout from "../../components/layouts/pageLayout";
import Footer from "../../components/pageComponents/footer/footer";
import HotelInfoDetail from "../../components/pageComponents/hotelInfoDetail";
import PreviewBanner from "../../components/pageComponents/previewBanner";
import SimilarHotel from "../../components/pageComponents/similarHotel";
import HotelInfoAppointment from "../../components/pageComponents/hotelInfoAppointment";
import { API_URL, replaceImageUrls , NODE_API_URL} from "../../utils/helper";
import { fetchFormDataWithAuth } from "../../utils/apiHelper";
import moment from "moment";
import ReactDOM from "react-dom";
const HotelInfo = () => {
  const router = useRouter();

  // const query=router.query;

  // var url = new URL(API_URL+router.asPath);

  const [data, setData] = useState({});
  const [price, setPrice] = useState({});
  const [code, setCode] = useState("");
  const [city,setCity] = useState('')
  const [source, setSource] = useState("");
  const [adultCount, setadultCount] = useState();
  const [childCount, setchildCount] = useState();
  const [roomCount, setroomCount] = useState();
  const [fromdate, setFromdate] = useState();

  const [todate, setTodate] = useState();
  const [rooms, setRooms] = useState([
    {
      roomId: roomCount,
      adults: 1,
      children: 0,
      // children_age: [],
    },
  ]);
  function handleTop(){
    var top = document.getElementById('topPage')
    var item = ReactDOM.findDOMNode(top)
    window.scrollTo({top: item,behavior: 'smooth'});
  }
  
  useEffect(()=>{
    handleTop()
    var url = window.location.search;
    var params = new URLSearchParams(url);
    setCode(parseInt(params.get("hotelcode")));
    setSource(params.get("source"));  
    setadultCount(params.get("adult") || 1);
    setchildCount(params.get("child") || 0);
    setCity(params.get('city')?params.get('city'):"")
    setRooms(JSON.parse(localStorage.getItem("room_details")));
    setFromdate(params.get("checkin") ? new Date(params.get("checkin")) : moment().add(1, "days"));
    setTodate(params.get("checkout") ? new Date(params.get("checkout")) : moment(fromdate).add(1, "days")._d);
  },[])
  
  
 

  useEffect(() => {
    handleTop()
    gethotels();
    
  }, [code,source]);

  const gethotels = async () => {
    var url = window.location.search;
    var params = new URLSearchParams(url);
  
    try{
      let fdate = moment(params.get("checkin")).format("YYYY-MM-DD");
      let tdate = moment(params.get("checkout")).format("YYYY-MM-DD");
       
        const payload = {
          code: parseInt(params.get("hotelcode")),
          source:params.get("source"),
          from: 0,
          checkin: fdate,
          checkout: tdate,
          rooms: JSON.parse(localStorage.getItem("room_details")),
          response_type: "min"
        };
        
     const res = await fetchFormDataWithAuth(
      `${NODE_API_URL}/hotel/prices`,
      "POST",
      null,
      { "Content-Type": "application/json" },
      JSON.stringify(payload)
    );
    
    setData(res["data"]?.response)

    console.log("amenities",data?.[0]?.amenities);
   
    }  

   catch(error){
    console.error("get hotel error=>",error)
   }
  }


  const hotels = {
    
    name: data?.[0]?.name || "",
    amenities: data?.[0]?.amenities || "",
    city: data?.[0]?.city || "",
    star: data?.[0]?.starRating || 0,
    rating: data?.[0]?.reviews?.[0]?.rate || "NA",
    rcount: data?.[0]?.reviews?.[0]?.reviewCount || "NA",
    images: data?.[0]?.images,
    adults: adultCount,
    children: childCount,
    rooms: rooms?.length,
    about: data?.[0]?.description,
    rackRate: data?.[0]?.srp_info?.bar?.toLocaleString("en-IN") || "NA",
    netPayable: data?.[0]?.srp_info?.minRate?.toLocaleString("en-IN") || "NA",
    marginRate: data?.[0]?.srp_info?.margin?.toLocaleString("en-IN") || "NA",
    roominfo: data?.[0]?.rooms,
    facility: data?.[0]?.facilities,
  };

  return (
    <div id="topPage">
    <PageLayout title="2hub | Hotels" >
      <div className="hotelinfo__container">
        <div className="hotelinfo__container__left">
          <div className="breadcrumb-wrapper">
            <Breadcrumb>
              <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
              {/* <Breadcrumb.Item
                onClick={() => {
                  router.back();
                }}
              >
                {hotels.city}
              </Breadcrumb.Item> */}
              <Breadcrumb.Item active>{hotels.name}</Breadcrumb.Item>
            </Breadcrumb>
            <PreviewBanner
              name={hotels.name}
              city={hotels.city}
              rating={hotels.rating}
              star={hotels.star}
              images={hotels.images}
            />
          </div>
          <HotelInfoDetail
            data={data}
            facility={hotels.facility}
            about={hotels.about}
            roominfo={hotels.roominfo}
            rating={hotels.rating}
            ratingcount={hotels.rcount}
            code={code}
            city={city}
            source={source}
            amenities={hotels.amenities}
            rooms={roomCount}
            adult={adultCount}
            child={childCount}
            rackRate={data?.[0]?.srp_info?.bar || 0}
            netpayable={data?.[0]?.srp_info?.minRate || 0}
            PDP={data?.[0]?.srp_info?.perDayPrice || 0}
            PDT={data?.[0]?.srp_info?.perDayTax || 0}
            totalTax={data?.[0]?.srp_info?.totalTax || 0}
            days={data?.[0]?.srp_info?.days || "Na"}
            margin={data?.[0]?.srp_info?.margin > 0 ? data[0]?.srp_info?.margin : 0}
            
            checkin={moment(fromdate).format("YYYY-MM-DD")}
            checkout={moment(todate).format("YYYY-MM-DD")}
          />
        </div>
        <div className="hotelinfo__mainappointments">
          <HotelInfoAppointment
            adult={adultCount}
            city={city}
            child={childCount}
            rackRate={data?.[0]?.srp_info?.bar || 0}
            netpayable={data?.[0]?.srp_info?.minRate || 0}
            PDP={data?.[0]?.srp_info?.perDayPrice || 0}
            PDT={data?.[0]?.srp_info?.perDayTax || 0}
            GTA={data?.[0]?.srp_info?.govt_tax_amount || 0}
            totalTax={data?.[0]?.srp_info?.totalTax || 0}
            days={data?.[0]?.srp_info?.days || "Na"}
            margin={data?.[0]?.srp_info?.margin > 0 ? data[0]?.srp_info?.margin : 0}
            rooms={hotels.rooms}
            data={data}
            checkin={moment(fromdate).format("MMM DD")}
            checkout={moment(todate).format("MMM DD")}
          />
        </div>
      </div>
      {/* <SimilarHotel /> */}
      <Footer id="footer" />
    </PageLayout>
    </div>
  );
};

export default HotelInfo;
