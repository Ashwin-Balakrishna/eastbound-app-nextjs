import React, { useState } from "react";
import { Formik } from "formik";
import _ from "lodash";
import moment from "moment";
import * as Yup from "yup";
import {Button} from "react-bootstrap";
import Checkbox from "../../elements/checkbox";
import DateRange from "../../elements/dateRange";
import PhoneNumber from "../../elements/phoneNumber/phoneNumber";
import AsyncSelect from 'react-select/async';
import SelectField from "../../elements/selectField";
import RadioGroup from "../../elements/radioGroup";
import Radio from "../../elements/radio";
import TextField from "../../elements/textField/textField";
import ErrorText from "../../elements/errorText";
import Guest from "../../search/hotel/guests/guests";
import { fetchFormDataWithAuth } from "../../../utils/apiHelper";
import { callback } from "util";
import nationalitiesData from "../../../public/json/nationalities.json";
const API_URL = process.env.global_url;

const ammendBookingForm = ({query,next}) => {
	const [errorMessage, setErrorMessage] = useState("");
	
	const loadOptions = async(inputText,callback) => {
		try {
      const bookings = await fetchFormDataWithAuth(
        `${API_URL}/api/agent/hotel/search`,
        "POST",
        null,
        null,
        JSON.stringify({
					"query": inputText
				})
      );
      if (bookings.Error) {
      } else {
				callback(bookings.response.hotels.map(i => ({ setFieldValuelabel: i.name, value: i.id})));
      }
    } catch (err) {
      console.error(`Something went wrong! Error: ${JSON.stringify(err)}`);
    }
	};

	// let initialRooms = 
	// 	[
	// 		query.rooms.map(room => {
	// 			{
	// 				roomId: 1,
	// 				adults: 1,
	// 				children: 0,
	// 				children_age: [],
	// 			}
	// 		})
	// 	]

	var initialRooms = query.rooms.map((room,i) => ({ roomId: i+1, adults: room.guests.filter(guest => guest.guest_age > 12).length , children: room.guests.filter(guest => guest.guest_age <= 12).length, children_age: [] }));

	
	console.log("initialRooms", initialRooms);
  return(
		<Formik
			initialValues={{ 
				checkin: query.check_in && moment(query.check_in),
				checkout: query.check_out && moment(query.check_out),
				rooms: initialRooms,
				nationality: "IN",
				code: query.hotel_info.code,
				hotelName: query.hotel_info.name,
			}}
			onSubmit={(values,{ setSubmitting }) => {
			
				const searchBookingHotel = async () => {
				try {
					const data = await fetchFormDataWithAuth(
						`${API_URL}/api/agent/hotel/search`,
						"POST",
						null,
						null,
						JSON.stringify(values)
					);
					if (data.Error) {
						setSubmitting(false);
					} else {
						data.response.length > 0
						? next(data.response, values)
						: setErrorMessage(
							"Sorry! This hotel is not available for these dates."
						);
					}
				} catch (err) {
					console.error(`Something went wrong here! Error: ${JSON.stringify(err)}`);
				}
			}
			searchBookingHotel();
		}}

			validationSchema = {Yup.object().shape({
				// first_name: Yup.string()
				// 	.required("First name is required"),
				
			})}
		>
			{props => {
				const { 
					handleSubmit,
					setFieldValue,
					values,
					isSubmitting
				} = props;

				return(

					<form className="mb-5"  onSubmit={handleSubmit} >
						{/* <h6 className="text-jetblack mb-4">Traveller Information</h6> */}
						{/* <SelectField
							label="Hotel Name"
							name="hotelname"
							
						/> */}
           			 <h6 className="text-jetblack mb-4">Search Hotels</h6>
						{/* <label className="small text-muted font-weight-bold undefined form-label">City/Hotel</label> */}
						
						{/* <AsyncSelect
							label="Hotel Name"
							id="hotel-name"
							name="code"
							placeholder="Start typing to search hotels"
							
							loadOptions={loadOptions}
							onChange={(option) => {
								setFieldValue("hotelName", option.label);
								setFieldValue("code", option.value);
							}}
							className="mb-3"
							// onOptionChanged={(option) => {
							// 	setFieldValue("hotelName", option.label);
							// 	setFieldValue("code", option.value);
							// }}
						/> */}
						<TextField
							name="code"
							label="Hotel Name"
							value={query.hotel_info.name}
							disabled
						/>
						<DateRange
							label="CheckIn - CheckOut Date"
							name="daterange"
							startDatePlaceholderText="Check in"
							endDatePlaceholderText="Check out"
							initialStartDate={query.check_in && moment(query.check_in)}
							initialEndDate={query.check_out && moment(query.check_out)}
							onStartDateChange={(startDate) =>
								setFieldValue("checkin", startDate)
							}
							onEndDateChange={(endDate) =>
								setFieldValue("checkout", endDate)
							}
							showClearDates={true}
						/>
						{/* <SelectField
							label="Nationality"
							name="nationality"
							options={nationalitiesData.nationalities}
						/> */}
						<Guest
							rooms={values.rooms}
							onRoomSelect={room => setFieldValue("rooms", room.guestList)}
						/>
						<Button
							variant="primary"
							type="submit"
							className="mt-4 font-weight-bold px-5"
						>
								{isSubmitting ? "Searching" : "Search"}
						</Button>
						<ErrorText error={errorMessage} />
					</form>
				)
			}}
		</Formik>
	)
}

export default ammendBookingForm;