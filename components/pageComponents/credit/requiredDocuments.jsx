import { Formik } from "formik";
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import * as Yup from "yup";
import Checkbox from "../../elements/checkbox";
import FileUpload from "../../elements/fileUpload";
import Styles from "./requiredDocuments.module.scss";
import { fetchDataWithAuth, fetchFormDataWithAuth,  } from "../../../utils/apiHelper";
import {NODE_API_URL} from "../../../utils/helper"
import { toast } from "react-toastify";
import _ from "lodash";

const FILE_SIZE = 10 * 1024 * 1024;
const SUPPORTED_FORMATS = [
  "image/jpg",
  "image/jpeg",
  "image/gif",
  "image/png",
  "application/pdf",
  "application/zip",
];

// const demo = Yup.lazy((obj) =>
//   Yup.object(
//     _.mapValues(obj, () =>
//       Yup.mixed().when("is_offline", {
//         is: (val) => !val,
//         then: Yup.mixed()
//           .required(`Please upload this document`)
//           .test(
//             "fileSize",
//             "File too large",
//             (value) => value && value.size <= FILE_SIZE
//           )
//           .test(
//             "fileFormat",
//             "Unsupported Format",
//             (value) => value && SUPPORTED_FORMATS.includes(value.type)
//           ),
//         otherwise: Yup.mixed().notRequired(),
//       })
//     )
//   )
// );

// const validationSchema = Yup.object({
//   is_offline: Yup.bool(),
//   demo,
// });

const RequiredDocuments = ({
  creditRequiredDocuments,
  documentList,
  next,
  takeAway,
  businessType
}) => {
  const [validationSchema, setValidationSchema] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [initialValues, setInitialValues] = useState(null);
  
    

  
  useEffect(() => {
    // console.log(documentList, creditRequiredDocuments)
    getDocumentList()
   
  }, []);

  const getDocumentList=async()=>{
    try{
      const response = await fetchDataWithAuth(
        // `${NODE_API_URL}/getBusinessType`,
        `${NODE_API_URL}/getDocumentTypes`,
        "GET",
        // null,
        `business_type_id=${businessType}`,
        null,
        null,
      );
      if(response && !response.status) {
        toast.error(response.message)
      }
      else{
  
    
    setDocuments(response.data)

    //set initial values
    let objDoc = {};
   response.data?.forEach((document) => {
      objDoc[document.business_document_id] = null;
    });
    objDoc.is_offline = false;
    
    setInitialValues(objDoc || {})

    //set validation schema
    const obj = {
      is_offline: Yup.bool(),
    };

    response.data.forEach((document) => {
      obj[document.business_document_id] = Yup.mixed().when("is_offline", {
        is: (val) => !val,
        then: Yup.mixed()
          .required(`${document.document_type} is required`)
          .test(
            "fileSize",
            "File too large",
            (value) => value && value.file.size <= FILE_SIZE
          )
          .test(
            "fileFormat",
            "Unsupported Format",
            (value) => value && SUPPORTED_FORMATS.includes(value.file.type)
          ),
        otherwise: Yup.mixed().notRequired(),
      });
    });

    //  response.data.forEach((document) => {
    //   obj[document.business_document_id] = Yup.mixed().when("is_offline", {
    //     is: (val) => !val,
    //     then: Yup.mixed()
    //       .required(`${document.document_type} is required`)
    //     });
    //     });

    setValidationSchema(Yup.object(obj));
      }
    }
    catch(err){
      toast.error("Something went wrong!")
      console.error('Something went wrong!', JSON.stringify(err));
    }
  }

  const uploadFile =async(file, setFieldValue, id, setErrors, errors, setFieldError, setTouched)=>{
    // let touched={};
    // touched[id] = true
    // await setTouched(touched)
    
  //   if(!SUPPORTED_FORMATS.includes(file?.type)){
     
  //     let errors={};
  //     errors[id] = 'Unsupported file format'
  //     setErrors(errors)
      
  //     // setFieldError(id, 'Unsupported file format')

  //   }
  //   else if(file?.size>FILE_SIZE){
  //     let errors={};
  //     errors[id] = 'File too large'
  //     setErrors(errors)
  //   }
  // else{
   let errorsParam={};
await setErrors(errorsParam)


   
  //  return;
  const formData = new FormData();
  formData.append('document',file)
      try {
        const response = await fetchFormDataWithAuth(
          `${NODE_API_URL}/uploadTempDocument`,
          "POST",
          null,
          null,
          formData

        );
        
        if(response && !response.status) {
          toast.error(response.message)
        }
        else{
          let obj={
            name:response.document_url,
            business_document_type_id:id,
            file:file
          }
          
          await setFieldValue(id, obj)
        }
      }
      catch (err) {
        toast.error("Something went wrong!")
        console.error('Something went wrong!', JSON.stringify(err));
       }
      }
  // }

  const checkDisable=(dataParam)=>{
    let data = _.cloneDeep(dataParam);
    let init = _.cloneDeep(initialValues)
  
    if(data){
      if(data.is_offline){
        return false
      }
      else{
        if(data?.is_offline==false){
          delete data.is_offline;
        }
        delete init.is_offline;
        var aKeys = Object.keys(data).sort();
  var bKeys = Object.keys(init).sort();
  delete data.is_offline
  console.log(JSON.stringify(aKeys) === JSON.stringify(bKeys))
  return ! (JSON.stringify(aKeys) === JSON.stringify(bKeys));
      }
    }
    else{
    return true;
    }
  }

  return (
    <>
    
  {initialValues!=null?  <Formik
      key="required_document_key"
      validationSchema={validationSchema}
      // validationSchema={Yup.object(obj)}
      onSubmit={(data) => {
        if (data.is_offline) {
          takeAway(data);
        } else {
          next(data);
        }
      }}
      initialValues={initialValues}
    >
      {({
        handleSubmit,
        setFieldValue,
        setErrors,
        setFieldError,
        setTouched,
        values,
        touched,
        errors,
        handleBlur,
      }) => (
        <Form onSubmit={handleSubmit}>
          <p className="text-jetblack mb-3">1. Offline Process</p>

          <Checkbox name="is_offline" id="is_offline">
            <span className="text-md font-weight-bold text-muted">
              I would like to submit the documents offline.
            </span>
          </Checkbox>

          <p
            className={`mt-3 small font-weight-bold text-primary text-center ${Styles.lineThrough}`}
          >
            OR
          </p>

          <p className="text-jetblack mb-3">2. Upload the required documents</p>
          {documents.length>0 && documents.map((doc) => (
            <div key={doc.doc_id}>
              <div className="text-muted small font-weight-bold mb-2">
                {doc.document_type}
              </div>
              <FileUpload
                id={doc.business_document_id}
                fileselected={values[doc.business_document_id]}
                data-browse="Upload"
                accept=".jpg,.png,.jpeg,.pdf,.zip"
                label="Please upload jpg,png,jpeg,pdf,zip"
                name={doc.business_document_id}
                fileChanged={(f) => {uploadFile(f, setFieldValue, doc.business_document_id,setErrors, errors, setFieldError, setTouched, touched); 
                // setFieldValue(doc.doc_id, f)
              }}
              fileSize ={FILE_SIZE}
              supportedFormats = {SUPPORTED_FORMATS}
                errorText={
                  errors[doc.business_document_id] && touched[doc.business_document_id]
                    ? errors[doc.business_document_id]
                    : ""
                }
                onBlur={handleBlur}
              />
            </div>
          ))}

          <Button
            className="p-2 mb-5 mt-4"
            block
            variant="primary"
            type="submit"
            // disabled={checkDisable(values)}
          >
            Submit
          </Button>
        </Form>
      )}
    </Formik>:<></>}
    </>
  );
};

export default RequiredDocuments;
