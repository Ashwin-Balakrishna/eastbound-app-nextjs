import React, {useState} from "react";
import withAuth from "../../utils/withAuth";
import Link from "next/link";
import { Container, Row, Col, Card, Button, Alert} from "react-bootstrap";
import PageLayout from "../../components/layouts/pageLayout";
import BaseLayout from "../../components/layouts/baseLayout";
import ThankYou from "../../components/pageComponents/thankyou";
import { fetchFormDataWithAuth } from "../../utils/apiHelper";
import ProfileForm from "../../components/pageComponents/profile/profileForm";
import { fetchgetServerSidePropsWithAuth } from "../../utils/apiHelper";

const API_URL = process.env.global_url;

function Profile({profile}) {
  const [changeRequest, setChangeRequest] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleUpdateAgentProfile = async (data) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("agency_address", data.agency_address);
    formData.append("accreditation", data.accreditation);
    formData.append("agency_city", data.agency_city);
    formData.append("agency_guarantee_mode", data.agency_guarantee_mode);
    formData.append("agency_iata_regd", data.agency_iata_regd);
    formData.append("agency_pin_code", data.agency_pin_code);
    formData.append("dial_code", data.dial_code);
    formData.append("gst_regd", data.gst_regd);
    formData.append("pan_copy", data.pan_copy);
    formData.append("pan_number", data.pan_number);
    formData.append("phone_number", data.phone_number);
    formData.append("regd_doc", data.regd_doc);
    formData.append("year_in_business", data.year_in_business);
    if(data.agency_iata_regd == true) {
      formData.append("agency_iata_code", data.agency_iata_code);
    }
    if (data.gst_regd === "true" || data.gst_regd === true) {
      let gstDetailsList = [];
      data.gst_details.map((gst,i) => {
        if(gst.action == "delete") {
          gstDetailsList.push({
            gst_detail_id: gst.gst_detail_id,
            gstin: gst.gstin,
            place_of_supply: gst.place_of_supply_code,
            action: gst.action
          });
        }
        else if(gst.action == "add"){
          formData.append(gst.gstin, gst.gstin_cert);
          gstDetailsList.push({
            gstin: gst.gstin,
            place_of_supply: gst.place_of_supply_code,
            action: gst.action
          });
        }
       
        else if(gst.action == undefined)
        {
          if(profile.gst_details[i].gstin !== gst.gstin || profile.gst_details[i].place_of_supply_code !== gst.place_of_supply_code || (profile.gst_details[i].gst_certificate !== gst.gstin_cert && gst.gstin_cert !== undefined )) {
            formData.append(gst.gstin, gst.gstin_cert);
            gstDetailsList.push({
              gst_detail_id: gst.gst_detail_id,
              gstin: gst.gstin,
              place_of_supply: gst.place_of_supply_code,
              action: "update"
            });
          }
        }
       
      });
      formData.append("gst_details_list", JSON.stringify(gstDetailsList));
    } 
    try {
      const data = await fetchFormDataWithAuth(
        `${API_URL}/api/agent/auth/changeProfileDetails`,
        "PUT",
        null,
        null,
        formData
      );
      if (data.Error || data.error) {
        setIsError(true);
        setErrorMessage(data.Error);
      } else if (data.msg || data.Msg) {
        setSuccessMessage("Sent update request!");
        setChangeRequest(true);
      } else {
        setIsError(true);
        setErrorMessage(`Something went wrong! Please try again later.`);
      }
    } catch (err) {
      setIsError(true);
      setErrorMessage(`Something went wrong! Please try again later.`);
    }
  }

  return (
    <PageLayout title="2Hub | Profile">
      <BaseLayout>
        <Card
          body
          className="border-0 shadow-sm"
          style={{ backgroundImage: "url('../../images/Profile_BG02.jpg')" }}
        >
          <Container>
            <Row className="justify-content-md-center text-center pt-2 pb-4">
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
            </Row>
          </Container>
        </Card>

        <section className="pb-5 pt-5 mt-4">
          <Card body className="border-0 shadow-sm">
            <Container>
              <Row className="mb-3">
                <Col xs={12} md={7} lg={5} className="mx-auto">
                  {isError && (
                    <Alert variant="danger" dismissible onClose={() => setIsError(false)} className="mt-4">
                      {errorMessage}
                    </Alert>
                  )}
                  {changeRequest || profile.profile_status == "Change Request" ? (
                    <ThankYou
                      message="Update request has been sent"
                      subText="Allow us to review your request. We will come back
                      to you shortly!."
                    />
                  ) : (
                    <ProfileForm profile={profile} handleSubmitProfile={(data) => handleUpdateAgentProfile(data)} />
                  )}
                </Col>
              </Row>
            </Container>
          </Card>
        </section>
      </BaseLayout>
    </PageLayout>
  );
}

export const getServerSideProps = async (context) => {
  const profile = await fetchgetServerSidePropsWithAuth(
    `${API_URL}/api/agent/account/profile`,
    "GET",
    null,
    null,
    null,
    context
  );

  return { props: { profile } };
};

export default withAuth(Profile);
