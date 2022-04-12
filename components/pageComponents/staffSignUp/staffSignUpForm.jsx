import React from 'react';
import { Form } from 'react-bootstrap';
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import { API_URL, getSessionToken, ADMIN_API_URL} from "../../../utils/helper";
import { fetchDataWithAuth } from '../../../utils/apiHelper';
const staffSignUpForm = () => {
  const toks= getSessionToken();
  const router = useRouter();
  var url = new URL(API_URL + router.asPath);
  var params = new URLSearchParams(url.search);
  const [name, setName] = useState(params.get("username") || "ASH");
  const [email, setEmail] = useState(params.get("email") || "ash@gmail.com");
  const [tokens, setTokens] = useState(params.get("token") || toks);
  const [sub,setSub]=useState(false);
  const [pass, setPass] = useState("");
  // onchange
  const values = {}
   const handleChange = (e) => {
     values[e.target.name] = e.target.value;
     console.log("initialpass=>",values.password)
     setPass(values.password)
   }
  const handleChangepass = (e) => {
    values[e.target.name]=e.target.value;
    {pass!="" && pass === values.recheckpass ? setSub(true) : setSub(false) }
      console.log("passwords",pass,values.recheckpass)
    }
  const createStaff = async (e) => {
    e.preventDefault();
    const payload = {
      email: email,
      auth_token: tokens,
      password: pass
    }
    console.log(payload)
    const staffs = await fetchDataWithAuth(
      `${ADMIN_API_URL}/api/dashboard/auth/passwordSetup`,
      "POST",
      null,
      { "Content-Type": "application/json" },
      payload,
      tokens
    );
 
    let temp = staffs;
    router.push(`/login`)
  }
    return (
    <>
      <div className="mb-4">
        <h4 style={{color:"black", }}>Staff Sign Up</h4>
      </div>
      <Form  onSubmit={createStaff}>
          <div>
                    <Form.Group>
                      <Form.Label>Name</Form.Label>
                      <input disabled style={{background:"none"}} class="form-control" value={name} type="text" placeholder='enter staff name'/>
                    </Form.Group>
          </div>
          <div>
                    <Form.Group>
                      <Form.Label>email</Form.Label>
                      <input disabled style={{background:"none"}} class="form-control" value={email} type="text" placeholder='enter staff name'/>
                    </Form.Group>
          </div>
          <div>
                   <Form.Group>
                      <Form.Label>Password</Form.Label>
                      <input class="form-control" name="password" onChange={handleChange} type="password" placeholder='Enter Password'/>
                    </Form.Group>
          </div>
          <div>
                    <Form.Group>
                      <Form.Label>Renter password</Form.Label>
                      <input class="form-control" name="recheckpass" onChange={handleChangepass} onkey type="password" placeholder='Re-enter Password'/>
                    </Form.Group>
          </div>
         <button disabled={!sub} class="btn btn-primary btn-block" type="submit" >SUBMIT</button>
      </Form>
    </>
  )
}
export default staffSignUpForm