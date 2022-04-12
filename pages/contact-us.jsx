import { Formik } from "formik";
import { Col, Container, Form, Row, Button } from "react-bootstrap";
import FormLabel from "../components/elements/formLabel";
import PhoneNumber from "../components/elements/phoneNumber/phoneNumber";
import TextField from "../components/elements/textField/textField";
import PageLayout from "../components/layouts/pageLayout";
import Footer from "../components/pageComponents/footer/footer";
import * as Yup from "yup";
import { fetchDataWithAuth } from "../utils/apiHelper";
import { ToastContainer, toast } from 'react-toastify';
// const mandrill = require("mandrill-api/mandrill");

// // eslint-disable-next-line no-undef
// const mandrillObj = new mandrill.Mandrill(process.env.mandrill_key); // This will be public

// const PageState = {
//   Iniitial: "initial",
//   Submitted: "submitted",
// };

const validationSchema = Yup.object({
  first_name: Yup.string().required("Please enter your first name"),
  last_name: Yup.string().required("Please enter your last name"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Please enter an email address"),
  dial_code: Yup.string().nullable(),
  phoneIsValid: Yup.boolean().nullable(),
  phone_number: Yup.string().when(
    ["phoneIsValid", "dial_code"],
    (phoneIsValid, dial_code, schema) => {
      return phoneIsValid === false
        ? schema
          .test("requiredPhone", "Phone number is required", (value) => {
            return value && value.substr(dial_code.length) != "";
          })
          .test("validPhone", "Phone number is invalid", () => phoneIsValid)
        : schema.test("requiredPhone", "Phone number is required", (value) => {
          return value && value.substr(dial_code.length) != "";
        });
    }
  ).nullable(),
  // subject: Yup.string().required("Please enter a subject"),
  message: Yup.string().required("Please enter a message"),
});

const onSubmitForm=async(data, resetForm)=>{
  const payload={
    first_name:data.first_name,
    last_name:data.last_name,
    email:data.email,
    dial_code:data.dial_code,
    mobile:data.phone_number,
    message:data.message
  };
  try {
    const response = await fetchDataWithAuth(
      `${NODE_API_URL}/general/contactUs`,
      // `http://localhost:3002/general/contactUs`,
      "POST",
      null,
      {"Content-Type":"application/json"},
      payload
    );
    if(response && !response.status){
      toast.error(response.message,{autoClose:3000},{position: toast.POSITION.TOP_RIGHT})
    }
    else{
      toast.success('Your message has been recorded',{autoClose:3000},{position: toast.POSITION.TOP_RIGHT})
    resetForm()
    }
    }
    catch (err) {
      toast.error('Something went wrong!',{autoClose:3000},{position: toast.POSITION.TOP_RIGHT})
      }

}

const ContactUs = () => {
  // const [errorMessage, setErrorMessage] = useState("");
  // const [pageState, setPageState] = useState(PageState.Iniitial);
  return (
    <PageLayout title="2Hub | Contact Us">
      <section className="bg-info text-white d-flex align-items-center pb-5 mb-5 mb-lg-7 text-center">
        <Container className="pt-5">
          <Row>
            <Col xs={12} className="mx-auto">
              <h1>Contact us</h1>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="mb-5 mb-lg-7">
        {/* {pageState === PageState.Iniitial ? ( */}
        <Container>
          <Row>
            <Col xs={12} md={7} className="mx-auto mb-4">
              <h4>Fill out the form and we’ll be in touch soon!</h4>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={7} className="mx-auto">
              <Formik
                key="contact_us"
                validationSchema={validationSchema}
                onSubmit={async(data, { setSubmitting, resetForm}) => {
                  onSubmitForm(data, resetForm);
                }}
                initialValues={{
                  first_name: "",
                  last_name: "",
                  email: "",
                  phone_number: "",
                  dial_code: "91",
                  message: "",
                }}
                // onSubmit={(data, { setSubmitting, resetForm }) => {
                //   setErrorMessage("");

                //   try {
                //     mandrillObj.messages.send(
                //       {
                //         message: {
                //           to: [
                //             { email: "info@stepahead.global", name: "Contact" },
                //           ],
                //           from_email: "info@stepahead.global",
                //           from_name: data.name,
                //           subject: `Received message from ${data.name} - ${data.email}`,
                //           text: data.message,
                //         },
                //       },
                //       (response) => {
                //         if (
                //           !response ||
                //           response.length === 0 ||
                //           response[0].rejected_reason ||
                //           response[0].status.toLowerCase() === "rejected"
                //         ) {
                //           console.error(response);
                //           setErrorMessage(
                //             "Something went wrong! Please try again."
                //           );
                //         } else {
                //           resetForm();
                //           setSubmitting(false);
                //           setPageState(PageState.Submitted);
                //         }
                //       }
                //     );
                //   } catch (error) {
                //     console.error(error);
                //     setErrorMessage("Something went wrong! Please try again.");
                //   } finally {
                //     setSubmitting(false);
                //   }
                // }}
              >
                {({
                  handleSubmit,
                  setFieldValue,
                  touched,
                  errors,
                  handleBlur,
                  values
                }) => (
                  <>
                    <Form onSubmit={handleSubmit}>
                      <FormLabel label="Full name" />
                      <div className="d-lg-flex">
                        <TextField
                          formGroupClassName="mr-lg-2 flex-fill"
                          name="first_name"
                          placeholder="First Name"
                          value={values?.first_name}
                        />
                        <TextField
                          formGroupClassName="flex-fill"
                          name="last_name"
                          placeholder="Last Name"
                          value={values?.last_name}
                        />
                      </div>
                      <TextField
                        type="email"
                        name="email"
                        label="Email address"
                        helptext="We'll never share your email with anyone else."
                        value={values?.email}
                      />
                      <PhoneNumber
                        label="Mobile Number*"
                        name="phone_number"
                        country="in"
                        preferredCountries={["in"]}
                        onPhoneChange={(value, country, e, _, isValid) => {
                          setFieldValue("dial_code", country.dialCode);
                          setFieldValue("phone_number", value);
                          setFieldValue("phoneIsValid", isValid);
                        }}
                        searchPlaceholder="Search by Country name or code"
                        errorText={
                          errors.phone_number && touched.phone_number
                            ? errors.phone_number
                            : ""
                        }
                        touched={touched.phone_number}
                        onBlur={handleBlur}
                        value={values?.phone_number}
                      />
                      <TextField
                        type="textarea"
                        name="message"
                        label="Message"
                        value={values?.message}
                      />

                      <Button
                        className="p-2 mt-4"
                        variant="primary"
                        type="submit"
                        block
                      >
                        Submit
                      </Button>
                    </Form>
                  </>
                )}
              </Formik>
            </Col>
          </Row>
        </Container>
        {/* ) : (
        <div className={`${Styles.thankYou} spacing`}>
          <h3>
            Thank you for your response! We will get back to you shortly. //{" "}
          </h3>
          <Button onClick={() => setPageState(PageState.Iniitial)}>
            Submit another response //{" "}
          </Button>{" "}
        </div>
        )} */}
      </section>

      <Footer />
    </PageLayout>
  );
};

export default ContactUs;
