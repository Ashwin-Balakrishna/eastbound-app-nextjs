import React, { useState, useEffect } from "react";
import withAuth from "../../utils/withAuth";
import Link from "next/link";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";
import PageLayout from "../../components/layouts/pageLayout";
import BaseLayout from "../../components/layouts/baseLayout";
import ThankYou from "../../components/pageComponents/thankyou";
import { fetchFormDataWithAuth } from "../../utils/apiHelper";
import ProfileForm from "../../components/pageComponents/profile/profileForm";
import { fetchgetServerSidePropsWithAuth } from "../../utils/apiHelper";
import CircularChart from '../../components/elements/circularChart'
import Cookies from "js-cookie";
import { Router } from "next/router";
import { useRouter } from "next/router";

const API_URL = process.env.global_url;

import { setLogo } from "../../utils/helper";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Profile({ profile, accountManager }) {
  const [changeRequest, setChangeRequest] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [unAuthorised, setUnAuthorised] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [profilePercent, setProfilePercent] = useState(0);
  const [profileData, setProfileData] = useState("");
  const router = useRouter();
  useEffect(() => {
    
    if(profile&&!profile.agent_data){
      setUnAuthorised(true)
      return;
    }
    // toast.configure();
    // console.log('from profile', profile)
    //     if(profile?.agent_data?.phone_number){
    //       console.log('from profile3', profile.agent_data.phone_number)
    // profile.agent_data.phone_number = parseInt(profile?.agent_data?.phone_number)
    // profile.agent_data.dial_code = parseInt(profile?.agent_data?.dial_code)
    // console.log('from profile4', profile.agent_data.phone_number)
    //     }

    // setProfileData ({...profile.agent_data, ...profile.custom, ...profile.accreditation, ...profile.agency_guarantee_mode, ...profile.agency_iata_regd, 
    //   ...profile.gst_regd
    // }}
    // if(profile)
    // manipulateProfileData(profile)
    console.log('from profile', profile)
    setProfileData({ ...profile.agent_data, ...profile.custom, })
    console.log('from profile2', { ...profile.agent_data, ...profile.custom, })
    console.log('from profile account manager', accountManager)
    //setLogo
    if(profile?.custom){
      if (profile?.custom?.agency_logo != null) {
        setLogo(profile?.custom?.agency_logo.toString()?.split("/").pop())
      }
      else{
        if(profile?.agent_data){
          if (profile?.agent_data?.agency_logo != null) {
            setLogo(profile?.agent_data?.agency_logo.toString()?.split("/").pop())
          }
        }
      }
    }
    let customProfile = { ...profile.agent_data, ...profile.custom, }
    if (customProfile) {

      let tempPercent = 0;
     
      //pan
      // if (customProfile?.pan_status =="approved" &&customProfile?.pan_number != null && customProfile?.pan_copy!=null) {
      //   tempPercent+=20
      // }
      if (customProfile?.pan_status =="approved") {
        tempPercent+=20
      }

      //iata
      // if (customProfile?.iata_status  =="approved"&&customProfile?.agency_iata_regd == true && customProfile?.agency_iata_code != null && customProfile?.iata_regd_doc != null) {
      //   tempPercent+=20
      // }
      if (customProfile?.iata_status  =="approved") {
        tempPercent+=20
      }
      else if (customProfile?.agency_iata_regd == false) {
        tempPercent+=20
      }

      //gst and supporting doc
      // if (customProfile?.gst_status  =="approved"&&customProfile?.gst_regd == true && customProfile?.gst_details.length > 0) {
      //   tempPercent+=20
      // }
      if (customProfile?.gst_status  =="approved") {
        tempPercent+=20
      }
      
        // if (customProfile?.supporting_status  =="approved"&&customProfile?.gst_regd == false&&customProfile?.supporting_doc !=null && customProfile?.supporting_doc_copy !=null) {
        //   tempPercent+=20
        // }
        if (customProfile?.supporting_status  =="approved") {
          tempPercent+=20
        }

      //other doc

      

      // if (customProfile?.agency_guarantee_mode ==1&& customProfile?.accreditation !=null) {
      //   tempPercent+=20
      // }
      // else if (customProfile?.guarantee_status  =="approved"&&customProfile?.agency_guarantee_mode !=null&& customProfile?.accreditation !=null && customProfile?.guarantee_mode_doc !=null) {
      //   // setProfilePercent(profilePercent + 20)
      //   tempPercent+=20
      // }
      if(customProfile?.agency_guarantee_mode ==1){
        tempPercent+=20
      }
      else if (customProfile?.guarantee_status  =="approved"){
        tempPercent+=20
      }
      
      //basic
      // console.log("CHECK", customProfile)
      if (customProfile?.agency_address != null && customProfile?.agency_city != null
        && customProfile?.agency_name != null && customProfile?.agency_pin_code != null 
        && customProfile?.landline_code != null && customProfile?.landline_number != null && customProfile?.year_in_business != null
      ) {
        // setProfilePercent(profilePercent + 20)
        
        tempPercent+=20
      }
      setProfilePercent(tempPercent)
    }
  }, [])

  const handleUpdateAgentProfile = async (data, form) => {
    const formData = new FormData();

    // if(data.email!=null)
    // formData.append("email", data.email);
    // // if(data.agency_logo!=null)
    // // formData.append("agency_logo", data.agency_logo[0]);
    // // if(data.agency_name!=null)
    // // formData.append("agency_name", data.agency_name);
    // if(data.pan_number!=null)
    // formData.append("pan_number", data.pan_number);
    // if(data.pan_copy!=null)
    // formData.append("pan_copy", data.pan_copy[0]);
    // console.log("test", formData.get('agency_logo'))
    // try {
    //   const data = await fetchFormDataWithAuth(
    //     `${API_URL}/api/agent/auth/changeProfileDetails`,
    //     "PUT",
    //     null,
    //     // {"Content-Type":"multipart/form-data"},
    //     null,
    //     formData
    //   );
    //   if (data.Error || data.error) {
    //     setIsError(true);
    //     setErrorMessage(data.Error);
    //   } else if (data.msg || data.Msg) {
    //     setSuccessMessage("Sent update request!");
    //     // setChangeRequest(true);
    //     setChangeRequest(false);
    //   } else {
    //     setIsError(true);
    //     setErrorMessage(`Something went wrong! Please try again later.`);
    //   }
    // } catch (err) {
    //   setIsError(true);
    //   setErrorMessage(`Something went wrong! Please try again later.`);
    // }
    // return;
    if (data.email != null)
    formData.append("email", data.email);

      if (form =='basic')
        formData.append("doc_type", 'basic');
      if(form=='all')
        formData.append("doc_type", 'all');
      if(form=='pan')
        formData.append("doc_type", 'pan');
      if(form=='iata')
        formData.append("doc_type", 'iata');
      if(form=='gst'&&data.gst_regd == false)
        formData.append("doc_type", 'supporting');
      if(form=='gst'&&data.gst_regd == true)
        formData.append("doc_type", 'gst');
      if(form=='otherDoc')
        formData.append("doc_type", 'guarantee');

    
    //basic form
    
    // console.log("final data", form)
    // return;
    
    if(form=='basic' || form =='all'){
    if (data.agency_name != null)
      formData.append("agency_name", data.agency_name);
    if (data.agency_address != null)
      formData.append("agency_address", data.agency_address);
    if (data.agency_city != null)
      formData.append("agency_city", data.agency_city);
    if (data.state_name != null)
      formData.append("state_name", data.state_name);
    if (data.agency_pin_code != null)
      formData.append("agency_pin_code", data.agency_pin_code);
    if (data.dial_code != null)
      formData.append("dial_code", data.dial_code);
    if (data.phone_number != null)
      formData.append("phone_number", data.phone_number);
    if (data.year_in_business != null)
      formData.append("year_in_business", data.year_in_business);
    if (data.landline_code != null)
      formData.append("landline_code", data.landline_code);
    if (data.landline_number != null)
      formData.append("landline_number", data.landline_number);

          //logo
    if (data.agency_logo != null ){
      if (data.agency_logo_file_name != null && data.agency_logo_file_name )
      formData.append("agency_logo_file_name", data.agency_logo_file_name);
    if (data.agency_logo_file_size != null && data.agency_logo_file_size)
      formData.append("agency_logo_file_size", data.agency_logo_file_size);
      if (!data.agency_logo[0].existing)
      //   formData.append("agency_logo", data.agency_logo[0].data);
      // else
        formData.append("agency_logo", data.agency_logo[0]);

        
      // }
    }
    }


    //pan form
    if(form=='pan'||form=='all'){
    if (data.pan_number != null && data.pan_copy != null) {
      
      formData.append("pan_number", data.pan_number);
      formData.append("pan_file_name", data.pan_file_name);
      formData.append("pan_file_size", data.pan_file_size);
      if (!data.pan_copy[0].existing)
      //   formData.append("pan_copy", data.pan_copy[0].data);
      // else
        formData.append("pan_copy", data.pan_copy[0]);
    }
  }
   
    //iata form

    if(form=='iata'||form=='all'){
      formData.append("agency_iata_regd", data.agency_iata_regd);
    if (data.agency_iata_regd == true && data.iata_regd_doc != null) {
      formData.append("agency_iata_code", data.agency_iata_code);
      formData.append("iata_file_name", data.iata_file_name);
      formData.append("iata_file_size", data.iata_file_size);

      if (!data.iata_regd_doc[0].existing)
      //   formData.append("iata_regd_doc", data.iata_regd_doc[0].data);
      // else
        formData.append("iata_regd_doc", data.iata_regd_doc[0]);
    }
  }

 
  
    //gst form
    if(form=='gst'||form=='all'){
      if (data.gst_regd != null)
      formData.append("gst_regd", data.gst_regd);
    if (data.gst_regd === "true" || data.gst_regd === true) {
      let gstDetailsList = [];
     
      if(profile.custom.gst_details&&profile.custom.gst_details.length>0 && profile.custom.gst_details[0]['gst_certificate']){
        if (!data.gstCopy[0].existing){
          gstDetailsList.push({
            gstin: data.gstNumber,
            // gst_certificate:  data.gstCopy[0].existing? data.gstCopy[0].data:data.gstCopy[0],
            action: "update",
            place_of_supply:data.gst_state_id
          });
          
        }
        else{
          gstDetailsList.push({
            gstin: data.gstNumber,
            gst_certificate:  data.gstCopy[0].existing? data.gstCopy[0].data:data.gstCopy[0],
            action: "update",
            place_of_supply:data.gst_state_id
          });
        }
      }
      else{
        gstDetailsList.push({
          gstin: data.gstNumber,
          gst_certificate:  data.gstCopy[0].existing? data.gstCopy[0].data:data.gstCopy[0],
          action: "add",
          place_of_supply:data.gst_state_id
        });
        
      }

      formData.append("gst_details_list", JSON.stringify(gstDetailsList));


      // let gstDetailsList = [];
      // if (data.gstCopy != null && data.gstNumber != null) {
      //   if (data.gst_details.length > 0) {
      //     if (data.gst_details[0]['gstin'] == data.gstNumber) {
      //       // gstDetailsList.push({
      //       //   gstin: data.gstNumber,
      //       //   gst_certificate: data.gstCopy[0].existing? data.gstCopy[0].data:data.gstCopy[0],
      //       //   action: "update"
      //       // });
      //       if (!data.gstCopy[0].existing){
      //       gstDetailsList.push({
      //         gstin: data.gstNumber,
      //         // gst_certificate:  data.gstCopy[0].existing? data.gstCopy[0].data:data.gstCopy[0],
      //         action: "add"
      //       });
      //       formData.append("gst_details_list", JSON.stringify(gstDetailsList));
      //     }
      //     }
      //     else {
      //       gstDetailsList.push({
      //         gstin: data.gstNumber,
      //         // gst_certificate:  data.gstCopy[0].existing? data.gstCopy[0].data:data.gstCopy[0],
      //         action: "add"
      //       });
      //       formData.append("gst_details_list", JSON.stringify(gstDetailsList));
      //     }
      //   }
      //   else {

      //     gstDetailsList.push({
      //       gstin: data.gstNumber,
      //       // gst_certificate:  data.gstCopy[0].existing? data.gstCopy[0].data:data.gstCopy[0],
      //       action: "add"
      //     });
      //     formData.append("gst_details_list", JSON.stringify(gstDetailsList));
      //   }
      // }
      // // data.gst_details.map((gst, i) => {
      // //   if(i==0){
      // //   if (gst.action == "delete") {
      // //     gstDetailsList.push({
      // //       gst_detail_id: gst.gst_detail_id,
      // //       gstin: gst.gstin,
      // //       place_of_supply: gst.place_of_supply_code,
      // //       action: gst.action
      // //     });
      // //   }
      // //   else if (gst.action == "add") {
      // //     formData.append(gst.gstin, gst.gstin_cert);
      // //     gstDetailsList.push({
      // //       gstin: gst.gstin,
      // //       place_of_supply: gst.place_of_supply_code,
      // //       action: gst.action
      // //     });
      // //   }

      // //   else if (gst.action == undefined) {
      // //     if (profile?.agent_data?.gst_details[i].gstin !== gst.gstin || profile?.agent_data?.gst_details[i].place_of_supply_code !== gst.place_of_supply_code || (profile?.agent_data?.gst_details[i].gst_certificate !== gst.gstin_cert && gst.gstin_cert !== undefined)) {
      // //       formData.append(gst.gstin, gst.gstin_cert);
      // //       gstDetailsList.push({
      // //         gst_detail_id: gst.gst_detail_id,
      // //         gstin: gst.gstin,
      // //         place_of_supply: gst.place_of_supply_code,
      // //         action: "update"
      // //       });
      // //     }
      // //   }
      // // }
      // // });

      // console.log("check gst", JSON.parse(JSON.stringify(gstDetailsList)))
      // console.log("pancopy", JSON.parse(JSON.stringify(data.pan_copy[0])))
      
      if (!data.gstCopy[0].existing){
        formData.append(data.gstNumber, data.gstCopy[0]);
      }

        if(data.gst_file_name!=null)
        formData.append("gst_file_name", data.gst_file_name);
        if(data.gst_file_size!=null)
        formData.append("gst_file_size", data.gst_file_size);
    }
  }


  

    //other form
    if(form=='otherDoc'||form=='all'){
    if (data.accreditation != null)
      formData.append("accreditation", parseInt(data.accreditation));
    
      formData.append("agency_guarantee_mode", parseInt(data.agency_guarantee_mode));
      if (data.guarantee_mode_doc != null && data.agency_guarantee_mode!=1) {
      formData.append("agency_guarantee_file_name", data.agency_guarantee_file_name);
      formData.append("agency_guarantee_file_size", data.agency_guarantee_file_size);
      if (!data.guarantee_mode_doc[0].existing)
      //   formData.append("guarantee_mode_doc", data.guarantee_mode_doc[0].data);
      // else
        formData.append("guarantee_mode_doc", data.guarantee_mode_doc[0]);
    }
  }

  //supporting doc
  if(form=='gst'||form=='all'){
    if (data.gst_regd == false && data.supporting_doc != null && data.supporting_doc_copy != null) {
      formData.append("supporting_doc", data.supporting_doc);
      
      if(data.supporting_doc_file_name!=null)
      formData.append("supporting_doc_file_name", data.supporting_doc_file_name);

      if(data.supporting_doc_file_size!=null)
      formData.append("supporting_doc_file_size", data.supporting_doc_file_size);

      if (!data.supporting_doc_copy[0].existing)
      //   formData.append("supporting_doc_copy", data.supporting_doc_copy[0].data);
      // else
        formData.append("supporting_doc_copy", data.supporting_doc_copy[0]);
    }
  }
    console.log("final data", JSON.stringify(data));
    // return;
    try {
      
      const data = await fetchFormDataWithAuth(
        // `${API_URL}/api/agent/auth/changeProfileDetails`,
        `${API_URL}/api/agent/auth/agentProfile`,
        "PUT",
        null,
        null,
        formData
      );
      console.log("final response", data)
      if (data.Error || data.error || data.msg == "Invalid data") {

        if(data.msg)
        toast.error(data.msg)

        if(data.Error)
        toast.error(data.Error)

        if(data.error)
        toast.error(data.error)
        // setIsError(true);
        // setErrorMessage(data.Error);
      } else if (data.msg || data.Msg) {
        // router.reload();

        toast.success('Profile Updated Successfully',)
        setTimeout(function() {
             router.reload();
          }, 3000); 
        setSuccessMessage("Sent update request!");
        // setChangeRequest(true);
        setChangeRequest(false);
      } else {
        // setIsError(true);
        toast.error('Something went wrong!')
        setErrorMessage(`Something went wrong! Please try again later.`);
      }
    } catch (err) {
      // setIsError(true);
      setErrorMessage(`Something went wrong! Please try again later.`);
    }
  }

  return (
  
    <PageLayout title="2Hub | Profile">
        {unAuthorised?
      <></>
      :
      <BaseLayout>
      
      {/* <Card
          body
          className="border-0 shadow-sm"
          // style={{ backgroundImage: "url('../../images/Profile_BG02.jpg')" }}
        > */}
      <Container className="profile-top-margin">
        {/* <Row className="justify-content-md-center text-center pt-2 pb-4">
              <Col md={4} sm={6} className="position-relative">
                <p className="text-primary mb-0" style={{ fontSize: 50 }}>
                  {profile.first_name} {profile.last_name}
                </p>
                <p className="text-muted lead mb-0">{profile.agency_name}</p>
                <p className="text-muted mb-0">
                  +{profile.dial_code} {profile.phone_number}
                </p>
                <p className="text-muted pb-2">{profile.email}</p>
                <Card
                  body
                  className="border-0 shadow-lg position-absolute w-100"
                >
                  {profile.credit_info ? (
                    <h5>
                      <span className="text-muted">Wallet Balance</span>
                      <span className="text-primary ml-2">
                        &#x20B9;{Math.trunc(profile.credit_info.credit_amount)}
                      </span>
                    </h5>
                  ) : (
                    <Link href="/credit">
                      <a>
                        <Button variant="primary">Apply for credit</Button>
                      </a>
                    </Link>
                  )}
                </Card>
              </Col>
            </Row> */}
        <Col xs={12} md={12} lg={8} className={accountManager?.email?"mr-auto":"mx-auto"}>
          <Row className="mb-3" className="complete-card">
            <Col xs={8} md={8} lg={8} className="mx-auto">
              <p className="mb-0" className="complete-card-header">
                {profilePercent == 100 ? 'Welcome ' : 'Complete your profile '}  {profile?.agent_data?.first_name}
              </p>
              <p className="mb-0" className="complete-card-text">{profile?.agent_data?.agency_name}</p>
              <p className="mb-0" className="complete-card-text">
                +{profile?.agent_data?.dial_code} {profile?.agent_data?.phone_number}
              </p>
              <p className="mb-0" className="complete-card-text">{profile?.agent_data?.email}</p>
            </Col>
            <Col xs={4} md={4} lg={4} className="justify-content-md-end text-right">
              <div class="single-chart">
                <CircularChart percent={profilePercent} />
              </div>
            </Col>

          </Row>
        </Col>
      </Container>
      {/* </Card> */}

      <section className="pb-5 pt-1 mt-4">
        {/* <Card body className="border-0 shadow-sm"> */}
        <Container>
          <Row className="mb-3">
            <Col xs={12} md={12} lg={8} className={accountManager?.email?"mr-auto profile-mobile":"mx-auto profile-mobile"}>
              {isError && (
                <Alert variant="danger" dismissible onClose={() => setIsError(false)} className="mt-4">
                  {errorMessage}
                </Alert>
              )}
              {changeRequest ? (
                <ThankYou
                  message="Update request has been sent"
                  subText="Allow us to review your request. We will come back
                      to you shortly!."
                />
              ) : (
                profileData != "" && <ProfileForm profile={profileData} accountManager={accountManager} handleSubmitProfile={(data, form) => handleUpdateAgentProfile(data, form)} />
              )}
            </Col>
          </Row>
        </Container>
        {/* </Card> */}
      </section>
      </BaseLayout>}
    </PageLayout>
  );
}

export const getServerSideProps = async (context) => {
  // const formData = new FormData();
  // formData.append(email)
  const profile = await fetchgetServerSidePropsWithAuth(
    `${API_URL}/api/agent/account/profile`,
    "GET",
    null,
    null,
    null,
    context
  );
  let accountManager=''
    if(profile?.agent_data)
  accountManager = await fetchgetServerSidePropsWithAuth(
    `${API_URL}/api/agent/auth/accountManager`,
    "GET",
    `email=${profile.agent_data.email}`,
    null,
    null,
    context
  );

  // console.log()
  return { props: { profile: profile, accountManager: accountManager } };
};

export default withAuth(Profile);
