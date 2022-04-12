import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Col, Image, ListGroup } from "react-bootstrap";
import { FaRegCalendarAlt, FaUserEdit, FaRegCreditCard, FaBuilding} from "react-icons/fa";
import {RiGroup2Fill} from "react-icons/ri";
import Styles from "./sideMenu.module.scss";
import Cookies from "js-cookie";




const SideMenu = () => {
  let flag1 = true;

  const data = [
    {
      name: "My Profile",
      active: false,
      icon: <FaUserEdit />,
      url: Cookies.get('user_type')=='staff'?'/profile-staff':"/profile",
    },
    ...(Cookies.get('accesses')&&JSON.parse(Cookies.get('accesses')).includes(19))?  [{
      name: "Bookings",
      active: false,
      icon: <FaRegCalendarAlt />,
      url: "/bookings",
    }]:[],
    ...(Cookies.get('accesses')&&JSON.parse(Cookies.get('accesses')).includes(17))? [{
      name: "My Credits",
      active: false,
      icon: <FaRegCreditCard />,
      url: "/mycredits",
    }]:[],
    ...(Cookies.get('accesses')&&JSON.parse(Cookies.get('accesses')).includes(3))?[ {
  
      name: "User Management",
      active: false,
      icon: <FaBuilding />,
      url: "/stafflisting",
    }] : [],  
    ...(Cookies.get('accesses')&&(JSON.parse(Cookies.get('accesses')).includes(8)))? [{
      name: "Branch Details",
      active: false,
      icon: <RiGroup2Fill />,
      url: "/branchdetails",
  
    }]:[],
    ...(Cookies.get('accesses')&&(JSON.parse(Cookies.get('accesses')).includes(10)||JSON.parse(Cookies.get('accesses')).includes(11)))? [{
      name: "Deposit Account",
      active: false,
      icon: <FaRegCreditCard />,
      url: "/wallet/home",
  
    }]:[],

    ...(Cookies.get('accesses')&&(JSON.parse(Cookies.get('accesses')).includes(13)))? [{
      name: "Transaction History",
      active: false,
      icon: <FaRegCreditCard />,
      url: "/wallet/transaction-history",
  
    }]:[],


    ...(Cookies.get('accesses')&&(JSON.parse(Cookies.get('accesses')).includes(14)))? [{
      name: "Offline Payment",
      active: false,
      icon: <FaRegCreditCard />,
      url: "/wallet/offline-payment",
  
    }]:[],
  ];
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [wallet, setWallet] = useState(true);
  const [staffBranch, setStaffBranch] = useState(true);
  const userm = ["stafflisting", "addbranch", "addstaff", "branchdetails", "viewstaff"]
  useEffect(() => {
    // console.log("ttttttt",Cookies.get('accesses'), Cookies.get('accesses'))
    if (window.location.toString().includes('wallet'))
      setWallet(false)

    // if(userm.some((e)=>{ console.log("steps=>",e);window.location.toString().includes(e)}))
    // setStaffBranch(false)
    if (window.location.toString().includes("stafflisting" || "addbranch" || "addstaff" || "branchdetails" || "viewstaff"))
      setStaffBranch(false)
    // { staffBranch ? (data.findIndex((e) => e.name === "Branch Deatails")) ? data.splice(4, 1) : "NA") : "" }
  //     data.splice(3,0,{
  //   name: "Branch Deatails",
  //   active: false,
  //   icon: <FaBuilding />,
  //   url: "/stafflisting",
  // })

    setUsername(localStorage.getItem("email"));
  });
  return (
    <Col md={2} className="text-white sidebar d-lg-block d-none" style={{ zIndex: 1032, backgroundColor: "#04222f",wordWrap:'break-word' }}>
      <div className="sidebar-sticky">
        <ListGroup as="ul" className="pb-1 border-bottom-infoLight">
          <ListGroup.Item
            as="li"
            className="border-0 rounded-0 d-flex justify-content-center"
            style={{ backgroundColor: "#04222f" }}
          >
            <Link href="/">
              <Image src="/images/logo.png" />
            </Link>
          </ListGroup.Item>
          <ListGroup.Item
            as="li"
            className="border-0 rounded-0 text-center text-white"
            style={{ backgroundColor: "#04222f",fontSize:'12px' }}
          >
            {username}
          </ListGroup.Item>
        </ListGroup>
        <ListGroup as="ul" variant="flush" className="mb-2 position-relative">
          {data.map((item, index) => (
            <Link href={item.url} key={index}>
              <a>
                <ListGroup.Item
                  as="li"
                  className={
                    router.pathname == item.url
                      ? ` rounded-0 bg-white text-jetblack ${Styles.active} py-3 ${Styles.menuItem}`
                      : ` rounded-0 py-3 border-bottom-infoLight ${Styles.menuItem}`
                  }
                >
                  <span className="">
                    <span className="ml-2 mr-2">{item.icon}</span>
                    {item.name}
                  </span>
                </ListGroup.Item>

              </a>


              
            </Link>
          ))}

          {/* <div hidden={wallet}> */}
          {/* <div>
          {Cookies.get('accesses')&&JSON.parse(Cookies.get('accesses')).includes(13)&&      
          <Link href='/wallet/transaction-history'>
            <a>
                <ListGroup.Item
                  as="li"
                  className={
                    router.pathname.includes('transaction-history')
                    ?
                    ` rounded-0 bg-white text-jetblack ${Styles.active} py-3 ${Styles.menuItem}`
                    :
                    `rounded-0 py-3 border-bottom-infoLight ${Styles.menuItem}`}
                >
                  <span className="">
                   
                    {'Transaction History'}
                  </span>
                </ListGroup.Item>
              </a>
                  
            </Link>}

            {Cookies.get('accesses')&&JSON.parse(Cookies.get('accesses')).includes(14)&& 
            <Link href='/wallet/offline-payment'>
            <a>
                <ListGroup.Item
                  as="li"
                  className={
                    router.pathname.includes('offline-payment')
                    ?
                    ` rounded-0 bg-white text-jetblack ${Styles.active} py-3 ${Styles.menuItem}`
                    :
                    `rounded-0 py-3 border-bottom-infoLight ${Styles.menuItem}`}
                >
                  <span className="">
                   
                    {' Offline Payment'}
                  </span>
                </ListGroup.Item>
              </a>
                  
            </Link>}
          </div> */}

          {/* {Cookies.get('accesses')&&JSON.parse(Cookies.get('accesses')).includes(8)&&   
          <div hidden={staffBranch}>
                <Link href='/branchdetails'>
            <a>
                <ListGroup.Item
                  as="li"
                  className={
                    router.pathname.includes('branchdetails')
                    ?
                    ` rounded-0 bg-white text-jetblack ${Styles.active} py-3 ${Styles.menuItem}`
                    :
                    `rounded-0 py-3 border-bottom-infoLight ${Styles.menuItem}`}
                >
                  <span className="">
                   
                    {'Branch Details'}
                  </span>
                </ListGroup.Item>
              </a>
                  
            </Link>
              
              </div>
              } */}
              
        </ListGroup>


      </div>
      

      <style jsx>{`
        .sidebar {
          padding: 0;
          font-size: 12px;
        }
        .sidebar-sticky {
          position: -webkit-sticky;
          position: sticky;
          top: 48px;
          height: calc(100vh - 50px);
          padding-top: 0.5rem;
          border-bottom: 1px solid #fff;
          overflow-x: hidden;
          overflow-y: auto;
        }
        .list-group-item {
          background-color: blue;
        }
        .border-bottom-infoLight {
          border-bottom: 0.5px solid #0c374a;
        }
      `}</style>
    </Col>
  );
};

export default SideMenu;
