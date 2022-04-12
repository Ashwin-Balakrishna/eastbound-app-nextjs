/* eslint-disable prettier/prettier */
import React, { useState,useEffect} from "react";
import Link from "next/dist/client/link";
import {
  useLoadScript,
  GoogleMap,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
export default function Maps(props) {
  const [mapRef, setMapRef] = useState(null);
  const [markerMap, setMarkerMap] = useState({});
  const [zoom,] = useState(12)
  const [marker,setMarkers] = useState([])
  const { isLoaded } = useLoadScript({
    // Enter Google Maps API key
    googleMapsApiKey: "AIzaSyAuVewDfdIH0NJqUyRK3y4Kv3713qOD3Ao",
  });
  
  useEffect(()=>{
      renderMap();
  },[props]) 
  const loadHandler = (map) => {
    setMapRef(map);
  };
  const markerLoadHandler = (marker, place,id) => {
    return setMarkerMap((prevState) => {
      return { ...prevState, [id]: marker };
    });
  };
//   console.log(parseFloat(props.data[0]?.lat),parseFloat(props.data[0]?.lng))
  function renderMap(){
      return (
        <>
           {
                isLoaded && (
                <GoogleMap
                    onLoad={loadHandler}
                    center={{lat:parseFloat(props.data[0]?.lat),lng:parseFloat(props.data[0]?.lng)}}
                    zoom={zoom}
                    options={
                        {
                            disableDefaultUI: true,
                        }
                    }
                    mapContainerStyle={{
                    height: "300px",
                    width: "100%",
                    }}
                >
                {
                    props.data.map((place, id) => {
                        return (
                            <Marker
                                key={id}
                                id={id}
                                position={{ lat: parseFloat(place.lat), lng: parseFloat(place.lng) }}
                                // name={place.name}
                                // price={props.price[place.hotelCode]?.srp_info?.minRate}
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
                                // onClick={async (event) => await markerClickHandler(event, place,id,true)}
                            />
                        );
                    }
                )}
                
                    <InfoWindow
                        anchor={markerMap[0]}
                    >
                        <div className="row p-0 m-0">
                            <Link href={"https://www.google.com/maps/place/"+props.data[0].lat+','+props.data[0].lng } >Open in Google Maps</Link>
                        </div>
                    </InfoWindow>
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
