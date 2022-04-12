import React, { useEffect, useState } from 'react'
import TextField from "./textField/textField";
import Styles from "./otpBoxes.module.scss";

const OtpBoxes = (props) => {
    useEffect(()=>{
        console.log("props", Styles);

    },[])
    const [preventKeyCodes, setPreventDefaultKeyCodes] = useState([69,189,190,187,13,38,40 ])
    const re = /^[0-9\b]+$/;
    const onKeyUp1 = (e) => {
       
        if (e.keyCode == 8) {
            return true;
         }
         else if (e.keyCode == 13) {
             // alert("called")
             props.submitValue()
         }
         else{
             if (props.otp1.length > 0)
             props.OTP2.current.focus()
         }

    }

    const onKeyDown1 = (e) => {
        // console.log("hey", e.keyCode)
        if (preventKeyCodes.includes(e.keyCode)) {
            e.preventDefault()
        }
        else if (props.otp1.length >= 1 && e.keyCode !== 8) {

            props.setotp1('');
        }
        else {
            return true;
        }
    }

    const onKeyUp2 = (e) => {
      
        if (e.keyCode == 8) {
            return true;
         }
         else if (e.keyCode == 13) {
             // alert("called")
             props.submitValue()
         }
         else{
             if (props.otp2.length > 0)
             props.OTP3.current.focus()
         }
    }

    const onKeyDown2 = (e) => {
     
        if (preventKeyCodes.includes(e.keyCode)) {
            e.preventDefault()
        }
        else if (props.otp2.length >= 1 && e.keyCode !== 8) {

            props.setotp2('');
        }
        else if (e.keyCode == 8 && props.otp2.length == 0) {
            props.OTP1.current.focus()
        }
        else {
            return true;
        }
    }

    const onKeyUp3 = (e) => {
     
        if (e.keyCode == 8) {
            return true;
         }
         else if (e.keyCode == 13) {
             // alert("called")
             props.submitValue()
         }
         else{
             if (props.otp3.length > 0)
             props.OTP4.current.focus()
         }
    }

    const onKeyDown3 = (e) => {
        // alert(e.keyCode)
        if (preventKeyCodes.includes(e.keyCode)) {
            e.preventDefault()
        }
        else if (props.otp3.length >= 1 && e.keyCode !== 8) {

            props.setotp3('');
        }
        else if (e.keyCode == 8 && props.otp3.length == 0) {
            props.OTP2.current.focus()
        }
        else {
            return true;
        }
    }

    const onKeyUp4 = (e) => {
     
        if (e.keyCode == 8) {
            return true;
         }
         else if (e.keyCode == 13) {
             // alert("called")
             props.submitValue()
         }
         else{
             if(props.phone)
             if (props.otp4.length > 0)
             props.OTP5.current.focus()
         }
    }

    const onKeyDown4 = (e) => {
        if (preventKeyCodes.includes(e.keyCode)) {
            e.preventDefault()
        }
        else if (props.otp4.length >= 1 && e.keyCode !== 8) {

            props.setotp4('');
        }
        else if (e.keyCode == 8 && props.otp4.length == 0) {
            props.OTP3.current.focus()
        }
        else {
            return true;
        }
    }

    const onKeyUp5 = (e) => {
        // if (e.keyCode !== 8 && e.keyCode !== 13 && ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105))) {
        if (e.keyCode == 8) {
           return true;
        }
        else if (e.keyCode == 13) {
            // alert("called")
            props.submitValue()
        }
        else{
            if (props.otp5.length > 0)
            props.OTP6.current.focus()
        }
        
        // }
    }

    const onKeyDown5 = (e) => {
        if (preventKeyCodes.includes(e.keyCode)) {
            e.preventDefault()
        }
       
        else if (props.otp5.length >= 1 && e.keyCode !== 8) {

            props.setotp5('');
        }
        else if (e.keyCode == 8 && props.otp5.length == 0) {
            props.OTP4.current.focus()
        }
        else {
            return true;
        }
    }
    const onKeyUp6 = (e) => {
      

        if (e.keyCode == 8) {
            return true;
         }
         else if (e.keyCode == 13) {
             // alert("called")
             props.submitValue()
         }
        

    }

    const onKeyDown6 = (e) => {
        if (preventKeyCodes.includes(e.keyCode)) {
            e.preventDefault()
        }
        else if (props.otp6.length >= 1 && e.keyCode == 13) {

            // setotp6('');
            return true;
        }
        else if (e.keyCode == 8 && props.otp6.length == 0) {
            props.OTP5.current.focus()
        }
        else {
            props.setotp6('')
        }
    }

    const onWheel = () => {
        props.OTP1.current.blur();
        props.OTP2.current.blur();
        props.OTP3.current.blur();
        props.OTP4.current.blur();
        props.OTP5.current.blur();
        props.OTP6.current.blur();
    };

    
    return (
        <>
        <div className="d-flex">
        {/* <TextField  onChange={(e) => {props.setotp1(e.target.value);}} formGroupClassName="flex-fill" type="number" label="To Night" name="to_night" value={props.otp1}/> */}
            <input autocomplete="off" type="text" className={Styles.boxes} id="codeBox1"  onChange={e => { if (e.target.value === '' || re.test(e.target.value)) {props.setotp1(e.target.value); props.setOtpError('');props.setErrorMessage('');}  }} onKeyUp={onKeyUp1} onKeyDown={onKeyDown1} value={props.otp1} ref={props.OTP1} onWheel={onWheel}/>
            <input autocomplete="off" className={Styles.boxes} id="codeBox2" type="text" onChange={e => { if (e.target.value === '' || re.test(e.target.value)){props.setotp2(e.target.value);  props.setOtpError('');props.setErrorMessage('');}}} onKeyUp={onKeyUp2} onKeyDown={onKeyDown2} value={props.otp2} ref={props.OTP2} onWheel={onWheel}/>
            <input autocomplete="off" className={Styles.boxes} id="codeBox3" type="text" onChange={e => { if (e.target.value === '' || re.test(e.target.value)){props.setotp3(e.target.value); props.setOtpError('');props.setErrorMessage(''); }}} onKeyUp={onKeyUp3} onKeyDown={onKeyDown3} value={props.otp3} ref={props.OTP3} onWheel={onWheel}/>
            <input autocomplete="off" className={Styles.boxes} id="codeBox4" type="text" onChange={e => { if (e.target.value === '' || re.test(e.target.value)){props.setotp4(e.target.value); props.setOtpError('');props.setErrorMessage(''); }}} onKeyUp={onKeyUp4} onKeyDown={onKeyDown4} value={props.otp4} ref={props.OTP4} onWheel={onWheel}/>
            {props.phone==true&&<input autocomplete="off" className={Styles.boxes} id="codeBox5" type="text" onChange={e => { if (e.target.value === '' || re.test(e.target.value)){props.setotp5(e.target.value); props.setOtpError('');props.setErrorMessage(''); }}} onKeyUp={onKeyUp5} onKeyDown={onKeyDown5} value={props.otp5} ref={props.OTP5} onWheel={onWheel}/>}
             {props.phone==true&&<input autocomplete="off" className={Styles.boxes} id="codeBox6" type="text" onChange={e => { if (e.target.value === '' || re.test(e.target.value)){props.setotp6(e.target.value); props.setOtpError('');props.setErrorMessage(''); }}} onKeyUp={onKeyUp6} value={props.otp6} onKeyDown={onKeyDown6} ref={props.OTP6} onWheel={onWheel}/>}
        </div>
        </>
    )
}

export default OtpBoxes;