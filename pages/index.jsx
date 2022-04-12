import nextCookie from "next-cookies";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Col, Container, Image, Navbar, Row } from "react-bootstrap";
import ThankYou from "../components/pageComponents/thankyou";
import { urls } from "../shared/urls";
import { fetchDataWithAuth } from "../utils/apiHelper";
import {
  API_URL,
  clearStorage,
  getLoggedInUser,
  getProfileStatus,
  getRejectReason,
  logout,
  reloadPageWithUrl,
} from "../utils/helper";
import { supportEmail, supportNumberFormated } from "../shared/contacts";

const Index = () => {
  const [profileStatus, setProfileStatus] = useState("initial");
  const [loggedInUser, setLoggedInUser] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    setProfileStatus(getProfileStatus());
    setLoggedInUser(getLoggedInUser());
    setRejectReason(getRejectReason());

    if (profileStatus === "pending") {
      const getStatus = async () => {
        try {
          const response = await fetchDataWithAuth(
            `${API_URL}/api/agent/account/profileStatus`,
            "GET"
          );
          if (!response.Error && !response.error) {
            let status = "pending";
            let rejectReason = "";
            if (response.is_approved && !response.is_rejected) {
              status = "complete";
            } else if (!response.is_approved && response.is_rejected) {
              status = "rejected";
              rejectReason = response.reject_reason;
            }
            localStorage.setItem("profileStatus", status);
            Cookies.set("profileStatus", status);
            localStorage.setItem("rejectReason", rejectReason);
            Cookies.set("rejectReason", rejectReason);
            setProfileStatus(status);
          }
        } catch (err) {
          console.error(err);
        }
      };

      getStatus();
    }
  }, []);

  let content = null;
  switch (profileStatus) {
    case "initial":
      break;
    case "partial":
      reloadPageWithUrl(urls.additionalInfo);
      break;
    case "pending":
      content = (
        <ThankYou
          defaultImage="/images/review_docs.svg"
          message={`Hello ${loggedInUser}`}
          subText={
            <p>
              We have received the information that you shared with us and your
              registration is under review. We will inform you as soon as your
              access to the portal is activated. Please feel free to contact us
              at <strong>{supportEmail}</strong> or
              <strong> {supportNumberFormated}</strong> for any assistance
            </p>
          }
        />
      );
      break;
    case "rejected":
      content = (
        <ThankYou
          defaultImage="/images/sad.svg"
          message={`Hello ${loggedInUser}`}
          subText={
            <>
              <div>{`${rejectReason}`}</div>
              <span>
                {`We are sorry to let you know that the information shared with us
              was not sufficient for us to activate your access to the portal.
             . Please feel free to contact us at`}
                <strong> {supportEmail}</strong> or
                <strong> {supportNumberFormated}</strong> for any assistance
              </span>
            </>
          }
          // link={urls.additionalInfo}
          // linkTitle="Resubmit application"
          // variant="outline-info"
        />
      );
      break;
    case "complete":
      reloadPageWithUrl(urls.home);
      break;
    default:
      clearStorage();
      reloadPageWithUrl(urls.joinus);
      break;
  }
  return (
    <>
      <Navbar
        bg="light"
        className=" mb-5 justify-content-center text-center"
        fixed="top"
      >
        <Navbar.Brand>
          <Image src="/images/logo.png" alt="2hub_logo" width="100px" />
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse
          className="justify-content-end cursor-pointer"
          onClick={() => logout()}
        >
          <Navbar.Text>Log out</Navbar.Text>
        </Navbar.Collapse>
      </Navbar>
      <Container className="mt-5 pt-5">
        <Row>
          <Col xs={12} md={8} lg={6} className="mx-auto">
            {content}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export const getServerSideProps = async (context) => {
  const { token } = nextCookie(context);

  if (!token) {
    context.res.writeHead(302, { Location: urls.home });
    context.res.end();
    return;
  }
  return { props: {} };
};

export default Index;
