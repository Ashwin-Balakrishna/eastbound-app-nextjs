import React, { useState } from "react";
import { Form } from "react-bootstrap";
import ErrorText from "./errorText";
import HelpText from "./helpText";

const FileUpload = ({
  id,
  formGroupClassName,
  errorText,
  label,
  helptext,
  fileChanged,
  fileSize,
  supportedFormats,
  ...props
}) => {
  const [fileLabel, setFileLabel] = useState(
    props.fileselected ? props.fileselected.name : label
  );

  const handleChange = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    let error = false;
    if(supportedFormats){
      if(!supportedFormats.includes(file?.type)){
        error=true;
      }
    }
    if(fileSize){
      if(file?.size>fileSize){
        error=true;
      }
    }
    if(!error){
    setFileLabel(file ? file.name : label);
    
    }
    fileChanged(file);
  // document.getElementById(id).blur()
    // document.getElementById(`#${id}`).blur();
  };

  return (
    <Form.Group className={formGroupClassName}>
      <Form.File
     
        custom
        {...props}
        label={fileLabel}
        onChange={(event) => handleChange(event)}
      />
      {helptext && <HelpText help={helptext} />}
      {errorText && <ErrorText error={errorText} />}
    </Form.Group>
  );
};

export default FileUpload;
