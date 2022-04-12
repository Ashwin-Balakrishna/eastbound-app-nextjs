import React, { useState, useEffect } from "react";
import withAuth from "../../utils/withAuth";
import Link from "next/link";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";
import PageLayout from "../../components/layouts/pageLayout";
import BaseLayout from "../../components/layouts/baseLayout";
import ThankYou from "../../components/pageComponents/thankyou";
import { fetchFormDataWithAuth } from "../../utils/apiHelper";
import ProfileStaffForm from "../../components/pageComponents/profileStaff/profileStaffForm";
import { fetchgetServerSidePropsWithAuth, fetchDataWithAuth } from "../../utils/apiHelper";
import CircularChart from '../../components/elements/circularChart'
import Cookies from "js-cookie";
import { Router } from "next/router";
import { useRouter } from "next/router";

const API_URL = process.env.global_url;
const NODE_API_URL  = process.env.customNodeUrl;
import { setLogo } from "../../utils/helper";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ProfileStaff({ profile }) {
    const [changeRequest, setChangeRequest] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [profilePercent, setProfilePercent] = useState(0);
    const [profileData, setProfileData] = useState("");
    const router = useRouter();
const getData=async()=>{
    const profile = await fetchDataWithAuth(
        `${NODE_API_URL}/user/agent/agentUser`,
        "GET",
        null,
        null,
        null,
       
      );
      setProfileData(profile)
      console.log("staff profile", profile)
        if(profile?.data){
            let tempPercent = 0;
            if(profile?.data?.name!=''){
                tempPercent+=20;
            }
            if(profile?.data?.email!=''){
                tempPercent+=20;
            }
            if(profile?.data?.mobile!=''){
                tempPercent+=20;
            }
            if(profile?.data?.designation!=''){
                tempPercent+=10;
            }
            if(profile?.data?.branch!=''){
                tempPercent+=10;
            }
            if(profile?.data?.manager!=''){
                tempPercent+=10;
            }
            if(profile?.data?.group_name!=''){
                tempPercent+=10;
            }

            setProfilePercent(tempPercent)
        }
}
    useEffect(()=>{
    
       getData();
        
    },[])

    const handleUpdateStaffProfile = async (data) => {
        // console.log("called123", data)
        const payload={
            agentName: data.name,
  email: data.email,
  mobile:  data.mobile,
        }
        try {
      
            const res = await fetchDataWithAuth(
              // `${API_URL}/api/agent/auth/changeProfileDetails`,
              `${NODE_API_URL}/user/agent/update`,
              "POST",
              null,
              {"Content-Type":"application/json"},
              payload
            );
            console.log("final response", res)
            if (!res.status) {
              if(res.message)
              toast.error(res.message)
            } else if (res.status) {
              // router.reload();
              toast.success('Profile Updated Successfully',)
              setTimeout(function() {
                   router.reload();
                }, 3000); 
            } else {
              // setIsError(true);
              toast.error('Something went wrong!')
              setErrorMessage(`Something went wrong! Please try again later.`);
            }
          } catch (err) {
            // setIsError(true);
            console.log("Something went wrong", err)
            setErrorMessage(`Something went wrong! Please try again later.`);
          }
    }

    return (
        <PageLayout title="2Hub | Staff Profile">
          <BaseLayout>
          <Container className="profile-top-margin">
          <Col xs={12} md={12} lg={8} className="mx-auto">
          <Row className="mb-3" className="complete-card">
            <Col xs={8} md={8} lg={8} className="mx-auto my-auto">
              <p className="mb-0" className="complete-card-header">
                {profilePercent == 100 ? '' : 'Complete'}  {profileData?.data?.name}
              </p>
              {/* <p className="mb-0" className="complete-card-text">{profile?.agent_data?.agency_name}</p>
              <p className="mb-0" className="complete-card-text">
                +{profile?.agent_data?.dial_code} {profile?.agent_data?.phone_number}
              </p>
              <p className="mb-0" className="complete-card-text">{profile?.agent_data?.email}</p> */}
            </Col>
            <Col xs={4} md={4} lg={4} className="justify-content-md-end text-right">
              <div class="single-chart">
                <CircularChart percent={profilePercent} />
              </div>
            </Col>

          </Row>
        </Col>

      <section className="pb-5 pt-1 mt-4">
        {/* <Card body className="border-0 shadow-sm"> */}
        <Container>
          <Row className="mb-3">
            <Col xs={12} md={12} lg={8} className={"mx-auto profile-mobile"}>
             
            {profileData!=''&&!profileData?.status? (
                <Alert variant="danger" dismissible onClose={() => setIsError(false)} className="mt-4">
                  {errorMessage}
                </Alert>
              ):
            profileData != "" && <ProfileStaffForm profile={profileData.data} handleSubmitProfile={(data) => handleUpdateStaffProfile(data)} />}
              
            </Col>
          </Row>
        </Container>
        {/* </Card> */}
      </section>
              </Container>
              </BaseLayout>
              </PageLayout>
    );
}


  
  export default withAuth(ProfileStaff);