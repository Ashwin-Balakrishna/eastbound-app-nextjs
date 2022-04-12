import React, { Component } from "react";
import Router from "next/router";
import Cookies from "js-cookie";
import { fetchDataWithAuth } from "../utils/apiHelper";
import { useRouter } from "next/router";
import { clearStorage } from "../utils/helper";
import cookies from "next-cookies";

export default function withAuth(Page) {
  const NODE_API_URL  = process.env.customNodeUrl;
  return class Authenticated extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isLoading: true,
      };
    }
     async componentDidMount () {
      // const router = useRouter()
      if (Cookies.get("token", { domain: "/" }) && Cookies.get("accesses", { domain: "/" })) {
      //  fetchDataWithAuth(
      //     `${NODE_API_URL}/auth/agent/getUserType`,
      //     "GET",
      //     null,
      //     null,
      //     null,
      //   )
      //   .then(async(res) =>{
          
          // if(res.status){
          //   if(res.user_type)
          //   Cookies.set("user_type", res.user_type)
          //   if(res.accesses)
          //   Cookies.set("accesses", res.accesses)
          //   if(res.role_id)
          //   Cookies.set("role", res.role_id)
          // }
          //test
          // res.accesses=[1,3,4,5]


          await this.checkRoleAuthRoutes(Router.route)
          //  this.checkRoleAuthRoutes(Router.route)
          this.setState({ isLoading: false });
            
        
        // }
        // )
      } else {
        let sessionExpiry = false;
        let redirect=''
        // if(localStorage.getItem('email')){//cookie expired
        //   sessionExpiry = true;
        // }
        if(Router.query?.redirect){
          redirect=Router.query?.redirect
        }
        await clearStorage();
        if(sessionExpiry){
        Router.push({pathname:"/login", query: { sessionExpiry: sessionExpiry }},
        '/login'
        );
        }
        else if(redirect!=''){
        Router.push({pathname:"/login", query:{redirect:'profile'}});
        }
        else{
          Router.push({pathname:"/login"});
        }
      }
    }
    render() {
      return (
        <div>
          {this.state.isLoading ? <div></div> : <Page {...this.props} />}
        </div>
      );
    }



     checkRoleAuthRoutes(route){
      //  console.log("CHECK")
      let res={};
      res.accesses  = Cookies.get("accesses")
      res.user_type  = Cookies.get("user_type")
      //profile
      if(route=='/profile'){
        if(res.user_type=='staff' && !res.accesses.includes(1)){
          Router.push('/profile-staff')
        }
      }

      if(route=='/profile-staff'){
        if(res.user_type=='agency'){
          Router.push('/profile')
        }
      }


      //user-management
      if(route=='/stafflisting'){
        if(!res.accesses.includes(3)){
          // Router.back();
          Router.push('/profile-staff')
        }
      }

      if(route=='/staffadd'){
        if(!res.accesses.includes(4)){
          // Router.back();
          Router.push('/profile-staff')
        }
      }

      if(route=='/staffedit'){
        if(!res.accesses.includes(5)){
          // Router.back();
          Router.push('/profile-staff')
        }
      }

      if(route=='/staffprofile'){
        if(!res.accesses.includes(7)){
          // Router.back();
          Router.push('/profile-staff')
        }
      }

      if(route=='/branchdetails'){
        if(!res.accesses.includes(8)){
          // Router.back();
          Router.push('/profile-staff')
        }
      }

      if(route=='/addbranch' ){
        if(!res.accesses.includes(9)){
          // Router.back();
          Router.push('/profile-staff')
        }
      }


      //wallet
      if(route=='/wallet/home'){
       
        if(!res.accesses.includes(10) && !res.accesses.includes(11)){
          // Router.back();
          Router.push('/profile-staff')
        }
      }

      //transaction history
      if(route=='/wallet/transaction-history'){
       
        if(!res.accesses.includes(13)){
          // Router.back();
          Router.push('/profile-staff')
        }
      }

      //offline payment
      if(route=='/wallet/offline-payment'){
       
        if(!res.accesses.includes(14)){
          // Router.back();
          Router.push('/profile-staff')
        }
      }

      //srp
      if(route=='/srp'){
       
        if(!res.accesses.includes(15)){
          // Router.back();
          Router.push('/profile-staff')
        }
      }

      //hotel info
      if(route=='/hotelinfo'){
       
        if(!res.accesses.includes(16)){
          // Router.back();
          Router.push('/profile-staff')
        }
      }

      //credit
      if(route=='/credit' || route=='/mycredit'){
       
        if(!res.accesses.includes(17)){
          // Router.back();
          Router.push('/profile-staff')
        }
      }

      //booking
      if(route=='/bookings'){
       
        if(!res.accesses.includes(19)){
          // Router.back();
          Router.push('/profile-staff')
        }
      }
    }
  };
}
