import { useEffect, useState } from "react";
import { Col, Container, Row, ProgressBar } from "react-bootstrap";
import creditFileJson from "../../../public/json/creditFile.json";
import { fetchDataWithAuth, fetchFormDataWithAuth } from "../../../utils/apiHelper";
import { NODE_API_URL } from "../../../utils/helper";
import withAuth from "../../../utils/withAuth";
import ErrorText from "../../elements/errorText";
import ThankYou from "../thankyou";
import Accepted from "../accepted";
import BusinessType from "./businessType";
import CreditForm from "./creditForm";
import RequiredDocuments from "./requiredDocuments";

const CREDIT_APPROVAL_STEP = {
  CREDIT_FORM: "creditForm",
  BUSINESS_TYPE: "businessType",
  REQUIRED_DOCUMENTS: "requiredDocuments",
  SENDING_CREDIT_DETAILS: "sendingCreditDetails",
  THANK_YOU: "thankYou",
  ACCEPTED:'accepted'
};

const Credit = (props) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [steps, setSteps] = useState("1");
  const [creditApprovalForm, setCreditApprovalForm] = useState({
    agency_name: "",
    billing_executive_name: "",
    billing_executive_role: "",
    billing_email_address: "",
    billing_address: "",
    // billing_credit_card_number: "",
    billing_phone_number: "",
    billing_dial_code: "91",
    phoneIsValid: null,
    is_accepted: false,
    submitted_place: "",
  });
  const [creditBusinessType, setCreditBusinessType] = useState({
    business_type: "",
  });
  const [creditRequiredDocuments, setCreditRequiredDocuments] = useState({
    is_offline: false,
  });
  const [creditApprovalStep, setCreditApprovalStep] = useState(
    CREDIT_APPROVAL_STEP.CREDIT_FORM
  );

  useEffect(()=>{
    
    if(props.status=='pending'){
      setCreditApprovalStep(CREDIT_APPROVAL_STEP.THANK_YOU);
      
    }
    if(props.status=='accepted'){
      setCreditApprovalStep(CREDIT_APPROVAL_STEP.ACCEPTED);
    }
  },[])

  useEffect(() => {
    const approveCredit = async (payload) => {
      try {
        // const data = await fetchFormDataWithAuth(
          const response = await fetchDataWithAuth(
          // `${process.env.global_url}/api/agent/credit/apply`,
          `${NODE_API_URL}/saveAgent`,
          // `http://0.0.0.0:3002/saveAgent`,
          "POST",
          null,
          { "Content-Type": "application/json" },
          // null,
          // formData
          payload,
          null
        );

        if (response && !response.status) {
          setErrorMessage(response.message);
        } else {
          // if (data.Msg) {
            setCreditApprovalStep(CREDIT_APPROVAL_STEP.THANK_YOU);
          // } else {
          //   setErrorMessage(`Something went wrong! Please try again later.`);
          // }
        }
      } catch (err) {
        setErrorMessage(`Something went wrong! Please try again later.`);
        console.error(`Something went wrong! Error: ${JSON.stringify(err)}`);
      }
    };

    if (creditApprovalStep === CREDIT_APPROVAL_STEP.SENDING_CREDIT_DETAILS) {
      setErrorMessage("");
      const creditApprovalStep = {
        ...creditApprovalForm,
        ...creditBusinessType,
        ...creditRequiredDocuments,
      };
      delete creditApprovalStep["phoneIsValid"];
      creditApprovalStep.billing_phone_number = creditApprovalStep.billing_phone_number.replace(
        creditApprovalStep.billing_dial_code,
        ""
      );
      creditApprovalStep.billing_phone_number = creditApprovalStep.billing_phone_number.replace(
        creditApprovalStep.billing_dial_code,
        ""
      );
      // creditApprovalStep.billing_credit_card_number = creditApprovalStep.billing_credit_card_number.replace(
      //   /-/g,
      //   ""
      // );

      // const formData = new FormData();
      // formData.append("credit_approval_phase", "1");
      let files=[];
      let payload={};
      // console.log("check123 new",creditApprovalStep)
      for (let key in creditApprovalStep) {
        if(creditApprovalStep[key]!=null){
        if(!creditApprovalStep[key].file){
          // delete creditApprovalStep[key].file
          // formData.append(key, creditApprovalStep[key]);
          payload[key] = creditApprovalStep[key];
        }
        else{
          let tempObj={name:creditApprovalStep[key].name,business_document_type_id: parseInt(creditApprovalStep[key].business_document_type_id)}
          // console.log("ee123", tempObj)
          files.push(tempObj)
        }
        // console.log("check123 new",key, creditApprovalStep[key], creditRequiredDocuments)
      }
      }
      if(files.length>0){
        // formData.append('files', files);
        payload['files'] = files;
      }
      // formData.set('business_type_id', formData.get('business_type'));
      payload['business_type_id'] = parseInt(payload.business_type);
      // formData.delete('business_type')
      // delete payload.business_type
      // let fil = formData.get('files')
      // console.log("ee",payload)
      approveCredit(payload);
    }
  }, [creditApprovalStep]);

  useEffect(() => {
    const filteredDocumentList = creditFileJson.businessType.filter(
      (businessType) =>
        businessType.business_id === creditBusinessType.business_type
    )[0]?.docs;

    let obj = {};
    filteredDocumentList?.forEach((document) => {
      obj[document.doc_id] = null;
    });

    setCreditRequiredDocuments(obj || {});
  }, [creditBusinessType]);

  let content = null;
  switch (creditApprovalStep) {
    case CREDIT_APPROVAL_STEP.CREDIT_FORM:
      content = (
        <CreditForm
          creditApprovalForm={creditApprovalForm}
          next={(data) => {
            setSteps("2");
            setProgress(33);
            setCreditApprovalForm(data);
            setCreditApprovalStep(CREDIT_APPROVAL_STEP.BUSINESS_TYPE);
          }}
        />
      );
      break;
    case CREDIT_APPROVAL_STEP.BUSINESS_TYPE:
      content = (
        <BusinessType
          creditBusinessType={creditBusinessType}
          next={(data) => {
            setSteps("3");
            setProgress(66);
            setCreditBusinessType(data);
            setCreditApprovalStep(CREDIT_APPROVAL_STEP.REQUIRED_DOCUMENTS);
          }}
        />
      );
      break;
    case CREDIT_APPROVAL_STEP.REQUIRED_DOCUMENTS:
      content = (
        <RequiredDocuments
          creditRequiredDocuments={creditRequiredDocuments}
          documentList={
            creditFileJson.businessType.filter(
              (businessType) =>
                businessType.business_id === creditBusinessType.business_type
            )[0].docs
          }
          next={(data) => {
            setProgress(100);
            setCreditRequiredDocuments(data);
            setCreditApprovalStep(CREDIT_APPROVAL_STEP.SENDING_CREDIT_DETAILS);
          }}
          takeAway={(data) => {
            setProgress(100);
            setCreditRequiredDocuments(data);
            setCreditApprovalStep(CREDIT_APPROVAL_STEP.SENDING_CREDIT_DETAILS);
          }}
          businessType={creditBusinessType.business_type}
        />
      );
      break;
    case CREDIT_APPROVAL_STEP.SENDING_CREDIT_DETAILS:
      content = (
        <>
          {errorMessage ? (
            <>
              <div>
                Oops! There seems to be an issue processing your application.
                Please contact us.
              </div>
              <ErrorText error={errorMessage} />
            </>
          ) : (
            <div>Please wait until your request is processed... </div>
          )}
        </>
      );
      break;
    case CREDIT_APPROVAL_STEP.THANK_YOU:
      content = (
        <ThankYou
          message="Thank you for applying for credit!"
          subText="Our representative will verify your credit application and get back to you soon."
        />
      );
      break;
      case CREDIT_APPROVAL_STEP.ACCEPTED:
      content = (
        <Accepted
          message="Your credit request has been accepted"
          // subText="Our representative will verify your credit application and get back to you soon."
        />
      );
      break;
    default:
      return null;
  }

  return (
    <Container className="mt-3">
      {creditApprovalStep !== CREDIT_APPROVAL_STEP.SENDING_CREDIT_DETAILS &&
      creditApprovalStep !== CREDIT_APPROVAL_STEP.THANK_YOU &&
      creditApprovalStep !== CREDIT_APPROVAL_STEP.ACCEPTED ? (
        <Row className="mb-2 text-center">
          <Col xs={12} md={7} lg={5} className="mx-auto">
            <p className="mb-0 small font-weight-bold text-primary py-2">
              STEP {steps} of 3
            </p>
          </Col>
        </Row>
      ) : null}

      {creditApprovalStep !== CREDIT_APPROVAL_STEP.SENDING_CREDIT_DETAILS &&
      creditApprovalStep !== CREDIT_APPROVAL_STEP.THANK_YOU  &&
      creditApprovalStep !== CREDIT_APPROVAL_STEP.ACCEPTED ?  (
        <Row className="mb-3">
          <Col xs={12} md={7} lg={5} className="mx-auto">
            <ProgressBar
              now={progress}
              className="mb-4 custom-progress-height"
            />
          </Col>
        </Row>
      ) : null}

      {creditApprovalStep !== CREDIT_APPROVAL_STEP.SENDING_CREDIT_DETAILS &&
      creditApprovalStep !== CREDIT_APPROVAL_STEP.THANK_YOU  &&
      creditApprovalStep !== CREDIT_APPROVAL_STEP.ACCEPTED ?  (
        <Row className="mb-3">
          <Col xs={12} md={7} lg={5} className="mx-auto">
            <>
              <h4>Credit Approval Steps</h4>
              <p className="text-muted">
                Please submit credit request by providing below details in
                request form
              </p>
            </>
          </Col>
        </Row>
      ) : null}

      <Row className="mb-5">
        <Col xs={12} md={7} lg={5} className="mx-auto">
          {content}
        </Col>
      </Row>
    </Container>
  );
};

export default withAuth(Credit);
