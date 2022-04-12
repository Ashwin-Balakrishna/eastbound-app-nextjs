/* eslint-disable prettier/prettier */
import React, { Component } from "react";
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
// import Arrow from '../../../public/images/svg/up_arrow.svg'
class G_Map extends Component{
	constructor(props){
		super(props);
		this.state = {
			showHide: true,
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {},
            selectedId:null,
            markers:[],
		}
	};
    onMarkerClick = (props, marker, e) => {
        this.setState({
            selectedPlace: {...props,image_url:props.content.images[0],star:props.star},
            activeMarker: marker,
            showingInfoWindow: true,
            selectedId:props.index
        });
        // console.log(this.state);
        this.props.HandleKey(props.index)
    }
    onMapClicked = (props) => {
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null
            })
        }
    };
    onMouseoverMarker = (props, marker, e) => {
        // if (this.state.selectedPlace === {})
        // this.setState({
        //     selectedPlace: {...props,image_url:props.content.images[0],star:props.star},
        //     activeMarker: marker,
        //     showingInfoWindow: true
        // });
        // console.log(props)
    }
    getInitialState() {
        return { 
            loaded: false,
            showHide: true,
            activeMarker: this.props.clicked !== null ?
                <Marker 
                    key={this.props.clicked}
                    icon={{
                        // url: iconList.icon5,
                        anchor: new this.props.google.maps.Point(47, 58),
                        scaledSize: new this.props.google.maps.Size(37, 37)
                    }}
                    title={this.props.data[this.props.clicked].name}
                    // label={{text:this.props.data[this.props.clicked].name,color:'#fff'}}
                    position={{lat:this.props.data[this.props.clicked]?.latitude,lng:this.props.data[this.props.clicked]?.longitude}}
                    // onClick={this.onMarkerClick}
                    // onMouseover={this.onMouseoverMarker}
                    name={this.props.data[this.props.clicked].name}
                    price={this.props.price[this.props.data[this.props.clicked].hotelCode]?.srp_info?.minRate}
                    content={this.props.data[this.props.clicked]}
                    index={this.props.clicked}
                />:
                {},
            selectedPlace: {},
            selectedId:this.props.clicked !== null ? this.props.clicked:null,
            showingInfoWindow: this.state.selectedId !== null ? true : false,
        };
    }
    componentDidMount() {
        // if (this.props.data.length !== 0){
            this.setState({
                loaded:true,
                showHide: true,
                activeMarker: this.props.clicked !== null ?
                    <Marker 
                        key={this.props.clicked}
                        icon={{
                            // url: iconList.icon5,
                            anchor: new this.props.google.maps.Point(47, 58),
                            scaledSize: new this.props.google.maps.Size(37, 37)
                        }}
                        title={this.props.data[this.props.clicked].name}
                        // label={{text:this.props.data[this.props.clicked].name,color:'#fff'}}
                        position={{lat:this.props.data[this.props.clicked]?.latitude,lng:this.props.data[this.props.clicked]?.longitude}}
                        // onClick={this.onMarkerClick}
                        // onMouseover={this.onMouseoverMarker}
                        name={this.props.data[this.props.clicked].name}
                        price={this.props.price[this.props.data[this.props.clicked].hotelCode]?.srp_info?.minRate}
                        content={this.props.data[this.props.clicked]}
                        index={this.props.clicked}
                    />:
                    {},
                selectedPlace: {},
                selectedId:this.props.clicked !== null ? this.props.clicked:null,
                showingInfoWindow: this.state.selectedId !== null ? true : false,
            })
        // }
    }
	render(){
        console.log(this.state)
        const containerStyle = {
            position: 'absolute',  
            width: '100%',
            height: '65%'
          }
        const iconList = {
            // icon:require('../../../public/images/svg/up_arrow.svg'),
            icon1: 'https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Flag--Right-Chartreuse.png',
            icon2: 'https://cdn2.iconfinder.com/data/icons/IconsLandVistaMapMarkersIconsDemo/256/MapMarker_Marker_Outside_Chartreuse.png',
            icon3: 'https://cdn4.iconfinder.com/data/icons/basic-user-interface-elements/700/up-top-arrow-512.png',
            icon4: 'https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/256/Map-Marker-Marker-Outside-Pink.png',
            icon5:'https://cdn2.iconfinder.com/data/icons/IconsLandVistaMapMarkersIconsDemo/256/MapMarker_Marker_Inside_Azure.png'
          }
		return (
            <div>
                {
                    this.state.loaded 
                    ?
                        <Map 
                            // google={this.props.google}
                            google={window.google}
                            zoom={8} 
                            disableDefaultUI={this.props.disableDefaultUI} 
                            onClick={this.onMapClicked}
                            initialCenter={this.props.clicked?{lat:this.props.data[this.props.clicked].latitude,lng:this.props.data[this.props.clicked].longitude}:this.props.initialCenter}

                            containerStyle={containerStyle}
                        >
                            
                            {
                                this.props.data.map((position,index)=>{
                                    if (this.props.price[position.hotelCode]?.srp_info?.minRate)
                                    {
                                        // if (index === this.props.clicked)
                                        // this.setState({
                                        //     marker:
                                        // })
                                        return (
                                            <Marker
                                                onLoad={marker=>{
                                                    console.log(marker)
                                                }}
                                                key={index}
                                                icon={{
                                                    url: iconList.icon5,
                                                    anchor: new this.props.google.maps.Point(47, 58),
                                                    scaledSize: new this.props.google.maps.Size(37, 37)
                                                }}
                                                title={position.name}
                                                // label={{text:position.name,color:'#fff'}}
                                                position={{lat:position?.latitude,lng:position?.longitude}}
                                                onClick={this.onMarkerClick}
                                                onMouseover={this.onMouseoverMarker}
                                                name={position.name}
                                                price={this.props.price[position.hotelCode]?.srp_info?.minRate}
                                                content={position}
                                                index={index}

                                            />    
                                        )
                                    }
                                })
                            }
                            <InfoWindow
                                marker={this.state.activeMarker}
                                visible={this.state.showingInfoWindow}
                            >
                                <div className="row p-0 m-0">
                                    <div className="col-3">
                                        {/* <img src={this.props.data?.[this.state.selectedId]?.images[0]} alt="Hotel-Image" width={'45px'} height={'45px'}/> */}
                                        <img src={this.state.selectedPlace.image_url} alt="Hotel-Image" width={'45px'} height={'45px'}/>
                                    </div>
                                    <div className="col-9">
                                        {/* <h6>{this.props.data?.[this.state.selectedId]?.name}</h6> */}
                                        <h6>{this.state.selectedPlace?.name}</h6>
                                        {/* <h6>Price : {this.props.price[this.props.data[this.state.selectedId].hotelCode]?.srp_info?.minRate}</h6> */}
                                        <h6>Price : {this.state.selectedPlace?.price}</h6>
                                    </div>
                                </div>
                            </InfoWindow>
                        </Map>
                        
                    :
                    null
                }
            </div>	
		);
	}
}

export default GoogleApiWrapper({
  apiKey: ('AIzaSyAuVewDfdIH0NJqUyRK3y4Kv3713qOD3Ao')
})(G_Map)