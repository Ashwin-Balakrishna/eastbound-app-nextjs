/* eslint-disable prettier/prettier */
import React, { useState,useEffect} from "react";
import {
  useLoadScript,
  GoogleMap,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
export default function Maps(props) {
  const [mapRef, setMapRef] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [markerMap, setMarkerMap] = useState({});
  const [zoom,] = useState(10);
  const [infoOpen, setInfoOpen] = useState(false);
  const [id,setId] = useState(-1);
  const [marker,setMarkers] = useState([])
  const { isLoaded } = useLoadScript({
    // Enter Google Maps API key
    googleMapsApiKey: "AIzaSyAuVewDfdIH0NJqUyRK3y4Kv3713qOD3Ao",
  });
  
  useEffect(()=>{
      renderMap();
      const mark = props.data.filter((marker,index)=>{
          if ( index === props.clicked)
          return marker
      }) 
      setMarkers(mark)
      async function setMakerInfo(){
        if (Object.keys(mark).length !== 0 ){
            if (selectedPlace || infoOpen ){
                await setSelectedPlace(null)
                await setInfoOpen(false)
            }
            markerClickHandler(mark[0],mark[0],props.clicked,false)
        }  
      }
    setMakerInfo();
  },[props.clicked]) 
  const loadHandler = (map) => {
    setMapRef(map);
  };
  const markerLoadHandler = (marker, place,id) => {
    return setMarkerMap((prevState) => {
      return { ...prevState, [id]: marker };
    });
  };

  const markerClickHandler = async (event, place,id, scroll) => {
    if (infoOpen){
        setInfoOpen(false)
    }
    await setId(id)
    await setSelectedPlace({...place,id:id,price:props?.price[place.hotelCode]?.srp_info?.minRate});
    await scroll ? props.HandleKey(id): ''
    await setInfoOpen(true);
  };
  function renderMap(){
      return (
        <>
           {
                isLoaded && (
                <GoogleMap
                    onLoad={loadHandler}
                    center={{lat:props.data[0]?.latitude,lng:props.data[0]?.longitude}}
                    zoom={zoom}
                    options={
                        {
                            disableDefaultUI: props.disableDefaultUI,
                        }
                    }
                    mapContainerStyle={{
                    height: "75vh",
                    width: "100%",
                    }}
                >
                {
                    props.data.map((place, id) => {
                        if (props.price[place.hotelCode]?.srp_info?.minRate)
                        return (
                            <Marker
                                key={id}
                                id={id}
                                position={{ lat: place.latitude, lng: place.longitude }}
                                name={place.name}
                                price={props.price[place.hotelCode]?.srp_info?.minRate}
                                icon={
                                    {
                                        url: 'https://cdn2.iconfinder.com/data/icons/IconsLandVistaMapMarkersIconsDemo/256/MapMarker_Marker_Inside_Azure.png',
                                        // anchor: new window.google.maps.Point(47, 58),
                                        scaledSize: new window.google.maps.Size(30 , 30)
                                    }
                                }
                                onLoad={(marker) => {
                                    return markerLoadHandler(marker, place,id);
                                }}
                                onClick={async (event) => await markerClickHandler(event, place,id,true)}
                            />
                        );
                    }
                )}
                {infoOpen && selectedPlace && (
                    <InfoWindow
                        anchor={markerMap[id]}
                        onCloseClick={() => setInfoOpen(false)}
                    >
                        <div className="row p-0 m-0">
                            <div className="p-2 m-0 col-3">
                                {/* <img src={this.props.data?.[this.state.selectedId]?.images[0]} alt="Hotel-Image" width={'45px'} height={'45px'}/> */}
                                <img src={selectedPlace?.images[0]} alt="Hotel-Image" width={'50px'} height={'50px'}/>
                            </div>
                            <div className="col-9">
                                {/* <h6>{this.props.data?.[this.state.selectedId]?.name}</h6> */}
                                <h6>{selectedPlace?.name}</h6>
                                {/* <h6>Price : {this.props.price[this.props.data[this.state.selectedId].hotelCode]?.srp_info?.minRate}</h6> */}
                                <h6>Price : {selectedPlace?.price}</h6>
                            </div>
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        )}
    </>
    )}
    return (
        <>
            {renderMap()}
        </>
    );
}
