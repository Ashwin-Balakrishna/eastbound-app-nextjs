import React, { useEffect, useState } from 'react'
import TextField from "./textField/textField";
import { useDropzone } from 'react-dropzone'
import Dropzone from "react-dropzone";
import ErrorText from "./errorText";
//icons
import { AiOutlineUpload } from "react-icons/ai";

//Style
import Styles from './uploadImage.module.scss'
const UploadImage = (props) => {
  // const [error, setError] = useState('');
  // useEffect(() => {
  //   console.log("props123", props);
  //   console.log("Cjecl12345", props.image);
  // }, [props]);

  const changeHandler = (event) => {
    var preview = URL.createObjectURL(event.target.files[0])
    validateFileAndAdd(event.target.files[0], preview)
    // if(event.target.files[0])
    // if (event.target.files[0]['size'] < 5097152) {
    //   event.target.files[0]['preview'] = URL.createObjectURL(event.target.files[0])

    //   let img = new Image()
    //   img.src = event.target.files[0]['preview']
    //   var image = event.target.files[0];
    //   if (props?.docName == "Upload Agent Logo") {
    //     img.onload = () => {
    //       // console.log("image123", img)
    //       if (img.width == 150 && img.height == 50) {
    //         props.setImage([image]);
    //       }
    //       else {
    //         props.setError('Please upload 150x50 image')
    //       }
    //     }


    //   }
    //   else {
    //     props.setImage([event.target.files[0]]);
    //   }
    // }
    // else {
    //   props.setError('File size exceeded')
    // }

  };

  const validateFileAndAdd=(file, preview, image)=>{
    if(file)
    if(file['size']<5097152){
    //validate agent logo
    if (props?.docName == "Upload Agent Logo") {
      if(file['type']=="image/jpeg"||file['type']=="image/png"){
      let img = new Image()
      img.src = preview
      img.onload = () => {
          if (img.width == 150 && img.height == 50) {
            // console.log("INside", file, preview, image)
            if(!file['preview']){
              file['preview'] = preview
            }
            if(image)
            props.setImage(image);
            else
            props.setImage([file]);
          }
          else {
            props.setError('Please upload 150x50 image')
          }
        }
    }
    else{
      props.setError('Invalid file type')
    }
  }
    //validate other files
    else{
      // console.log("INside123", file, preview, image)
      if(!file['preview']){
        file['preview'] = preview
      }
      if(file['type']=="image/jpeg"||file['type']=="image/png" ||file['type']=="application/pdf"){
      props.setImage([file]);
      }
      else{
        props.setError('Invalid file type')
      }
    }
  }
  else{
    props.setError('File size exceeded')
  }
  }

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*, .pdf',
    onDrop: acceptedFiles => {
          var image = acceptedFiles.map(file => Object.assign(file, {

            preview: URL.createObjectURL(file)

          }));
      validateFileAndAdd(event.target.files[0], image[0]['preview'], image)
      // if (event.target.files[0]['size'] < 5097152) {
        
      //   if (getInputProps().ref.current.id === "front") {

      
      //     // console.log('image', image)
      //     let img = new Image()
      //     img.src = image[0]['preview']
      //     img.onload = () => {
      //       if (props?.docName == "Upload Agent Logo") {
      //         if (img.width == 150 && img.height == 50) {
      //           props.setImage(image);
      //         }
      //         else {
      //           props.setError('Please upload 150x50 image')
      //         }
      //       }
      //       else {
      //         props.setImage(image);
      //       }

      //     }
      //   }
      //   // console.log('check')
      // }
      // else {
      //   props.setError('File size exceeded')
      // }

    
  }
  });
  const frontFunc = props?.image?.map(file => (
    <>
      {props.docName == "Upload Agent Logo" ? <>

        <div className="upload-show-wrapper upload-show-wrapper-logo">
          <div className="upload-show">
            <div className="upload-img-wraper">
              <div className="upload-img">
                <img src={file.preview} className={Styles.img} alt={file.name} onClick={()=>{window.open(file.preview, '_blank')}}/>
                
              </div>
            </div>
            {/* <div className="upload-show-action action-mobile">
                    <div className="btwn-btn upload-show-wrapper-logo">
                      <button class="btn btn__primary" type="submit">Change</button>
                      <button class="btn btn__outline">Remove</button>
                    </div>
                    </div> */}

            <div className="upload-img-text upload-img-text-logo">
              <h3>{file.name}</h3>
              <span>{(file?.size / (1024 * 1024)).toFixed(2)} MB</span>
              <div className="upload-show-action action-mobile">
                <div className={props.edit?"upload-show-wrapper btwn-btn":"upload-show-wrapper btwn-btn disable"}>
                  <button class="btn btn__primary">Change</button>
                  <input type="file" name="myfile" onChange={changeHandler} />
                </div>
              </div>
            </div>
          </div>
          <div className={props.edit?"upload-show-action action-desktop":'upload-show-action action-desktop disable'}>
            <div className="btwn-btn btwn-btn-logo">
              <button class="btn btn__primary" >Change</button>
              <input type="file" name="myfile" onChange={changeHandler} />

            </div>
          </div>
        </div>

      </> :
        <>
          <div className="upload-show-wrapper">
            <div className="upload-show">
              <div className="upload-img-wraper">
                <div className="upload-img" >
                  {file.name.includes('.pdf')?<img src='/images/pdf-preview.png' className={Styles.img} alt={file.name} onClick={()=>{window.open(file.preview, '_blank')}}/>
                  :
                  <img src={file.preview} className={Styles.img} alt={file.name} onClick={()=>{window.open(file.preview, '_blank')}}/>
}
                </div>
              </div>

              <div className="upload-img-text">
                
                <h3>{file.name}</h3>
                <span>{(file?.size / (1024 * 1024)).toFixed(2)} MB</span>
                <div className="upload-show-action action-mobile">
                <div className={props.edit?"upload-show-wrapper btwn-btn":"upload-show-wrapper btwn-btn disable"}>
                    <button class="btn btn__primary">Change</button>
                    <input type="file" name="myfile" onChange={changeHandler} />
                  </div>
                </div>
              </div>
            </div>
            <div className={props.edit?"upload-show-action action-desktop":'upload-show-action action-desktop disable'}>
              <div className="btwn-btn">
                <button class="btn btn__primary">Change</button>
                <input type="file" name="myfile" onChange={changeHandler} />
                {/* <button class="btn btn__outline">Remove</button> */}
              </div>
            </div>
          </div>
        </>


      }
    </>
    //  <div className={props.docName=="Agent Logo"?"upload-show-wrapper upload-show-wrapper-logo":"upload-show-wrapper"}>
    //         <div className="upload-show">
    //           <div className="upload-img-wraper">
    //             <div className="upload-img">
    //             <img src={file.preview} className={Styles.img} alt={file.name} />
    //             </div>
    //           </div>
    //          {!props.docName=="Agent Logo" &&
    //          <div className="upload-img-text">
    //             <h3>{file.name}</h3>
    //             <span>{(file?.size / (1024*1024)).toFixed(2)} MB</span>
    //             <div className="upload-show-action action-mobile">
    //               <div className={props.docName=="Agent Logo"?"btwn-btn upload-show-wrapper-logo":"upload-show-wrapper"}>
    //                 <button class="btn btn__primary" type="submit">Change</button>
    //                 <button class="btn btn__outline">Remove</button>
    //               </div>
    //             </div>
    //           </div>}
    //         </div>
    //         <div className="upload-show-action action-desktop">
    //         <div className={props.docName=="Agent Logo"?"btwn-btn btwn-btn-logo":"btwn-btn"}>
    //             <button class="btn btn__primary" type="submit">Change</button>
    //             {/* <button class="btn btn__outline">Remove</button> */}
    //           </div>
    //         </div>
    //       </div> 
  ));
  return (
    <>

      {props.image.length > 0 ?
        frontFunc :
        <div className={Styles.fileDropZone}>
          <div {...getRootProps({ className: 'dropzone dropzone-pan front-side new-dropzone' })}>
            <input id="front" {...getInputProps({ docType: "front" })} />

            <div class="dz-message needsclick dz-message-pan">
              {/* <div class="imgside-drop">
                                                                                Front
                                                                            </div> */}
              <AiOutlineUpload size="1.5rem" style={{ margin: "0px auto", width: "100%", color: '#F36B25' }} />
              <div className={Styles.uploadText}>

                {props.docName}<br /><span className={Styles.sizeText}>{props.sizeText}</span>
              </div>
              {/* <span className={Styles.sizeText}>

                                    
                                    </span> */}

            </div>

          </div>
        </div>
      }
      {/* {error.length > 0 ? <ErrorText className="mt-10" error={error} /> : ""} */}
    </>
  );

}

export default UploadImage;