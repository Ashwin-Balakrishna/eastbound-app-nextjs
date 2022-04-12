import { Formik } from "formik";
import { useEffect , useState} from "react";
import { Button, Form } from "react-bootstrap";
import * as Yup from "yup";
import SelectField from "../../elements/selectField";
import { fetchDataWithAuth, fetchFormDataWithAuth,  } from "../../../utils/apiHelper";
import {NODE_API_URL} from "../../../utils/helper"
import { toast } from "react-toastify";


const businessTypeSchema = Yup.object({
  business_type: Yup.string().required("Business is required"),
});

// const businessOptions = [
//   { value: "1", label: "Proprietorship" },
//   { value: "2", label: "Partnership/LLP" },
//   { value: "3", label: "Private Limited Company" },
// ];

const BusinessType = ({ creditBusinessType, next, takeAway }) => {
  const [businessOptions, setBusinessOptions] = useState(
   []
  );
  useEffect(()=>{
getBusinessTypes()
  },[])
  const getBusinessTypes=async()=>{
    try{
      const response = await fetchDataWithAuth(
        `${NODE_API_URL}/getBusinessType`,
        "GET",
        null,
        null,
        null,
      );
      if(response && !response.status) {
        toast.error(response.message)
      }
      else{
  
    let test= response.data.map((item, i)=>{
      return {label:item.business_type, value:item.business_type_id.toString()}
    })
    setBusinessOptions(test)
      }
    }
    catch(err){
      toast.error("Something went wrong!")
      console.error('Something went wrong!', JSON.stringify(err));
    }
  }
  return (
    <Formik
      key="business_type_key"
      validationSchema={businessTypeSchema}
      onSubmit={(data) => {
        
        next(data);
      }}
      initialValues={creditBusinessType}
    >
      {({
        handleSubmit,
        setFieldValue,
        values,
        touched,
        errors,
        handleBlur,
      }) => (
        <Form onSubmit={handleSubmit}>
          <SelectField
            label="Business Type"
            id="business-type"
            name="business_type"
            value={values.business_type}
            options={businessOptions}
            onOptionChanged={(e)=>setFieldValue("business_type",e)}
          />

          <Button
            className="p-2 mb-5 mt-4"
            block
            variant="primary"
            type="submit"
          >
            Next
          </Button>
        </Form>
      )}
    </Formik>
  );
};


export default BusinessType;
