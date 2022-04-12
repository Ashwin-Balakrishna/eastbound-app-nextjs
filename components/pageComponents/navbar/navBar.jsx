import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import ProfileMenu from "./profileMenu";
import { AiOutlineArrowRight } from "react-icons/ai";
import { BsEnvelope } from "react-icons/bs";
import { FiPhoneCall, FiHome } from "react-icons/fi";
import { searchTabs, pathToTabs } from "../../../shared/searchTabs";
import { useSession } from "../../../context/sessionContext";
import { getLoggedInUser, getSessionToken, NODE_API_URL } from "../../../utils/helper";
import styles from "./navBar.module.scss";
import { urls,usermanagement } from "../../../shared/urls";
import { IconContext } from "react-icons/lib";

import {
  supportEmail,
  supportNumber,
  supportNumberFormated,
} from "../../../shared/contacts";
import { logout, S3_URL } from "../../../utils/helper";
const homePages = ["/", urls.hotels, urls.travelPackages];
import ModalComponent from "../../elements/modal";
import Login from "../../../components/pageComponents/login";
import { fetchDataWithAuth } from "../../../utils/apiHelper";
import { data } from "jquery";

import Cookies from "js-cookie";

const excludedTabs = [
  ...homePages,
  urls.profile,
  urls.credit,
  urls.listing,
  urls.bookings,
  urls.mycredits,
  urls.joinus,
  urls.paymentPolicy,
  urls.contactUs,
  urls.aboutUs,
  urls.privacyPolicy,
  urls.documents
];

const noSelectionTabs = [urls.paymentPolicy];

// const NavBar = () => {
//   const router = useRouter();
//   const session = useSession();
//   const [sessionToken, setSessionToken] = useState(null);
//   const activeTab = pathToTabs(router.pathname);

//   useEffect(() => {

// if(document.cookie.includes("firstName")==true && document.cookie.includes("token")==true){
//   setSessionToken(session);
//     console.log("sessionToken",session );

// }
// else{
//   console.log("sessionToken12");
//   setSessionToken('');
// }
//   }, []);

//   const displayNavTabs = !excludedTabs.includes(router.pathname.toLowerCase());

//   let rightContent = null;
//   switch (sessionToken) {
//     case null:
//       break;
//     case "":
//       rightContent = (
//         <>
//           {homePages.includes(router.pathname.toLowerCase()) ? (
//             <Nav.Item>
//               <p className="mb-0 text-primary text-md d-none d-lg-block">
//                 SIGN UP OR LOGIN TO UNLOCK EXCLUSIVE SAVINGS FOR AGENT PARTNERS
//                 ONLY <AiOutlineArrowRight />
//               </p>
//             </Nav.Item>
//           ) : null}
//           <Nav.Item className="px-3 mx-1">
//             <Link href={urls.login} passHref>
//               <Nav.Link>Login</Nav.Link>
//             </Link>
//           </Nav.Item>
//           <Nav.Item className="px-3 mx-1">
//             <Link href={urls.joinus} passHref>
//               <Nav.Link>Sign Up</Nav.Link>
//             </Link>
//           </Nav.Item>
//         </>
//       );
//       break;
//     default:
//       rightContent = (
//         <>
//           {!displayNavTabs && (
//             <>
//               <Nav.Item className="px-3 mx-1 text-md d-none d-lg-flex">
//                 <Link href={`tel:${supportNumber}`} passHref>
//                   <Nav.Link>
//                     <FiPhoneCall />
//                     <span className="ml-1">{supportNumberFormated}</span>
//                   </Nav.Link>
//                 </Link>
//               </Nav.Item>
//               <Nav.Item className="px-3 mx-1 text-md d-none d-lg-flex">
//                 <Link href={`mailto:${supportEmail}`} passHref>
//                   <Nav.Link>
//                     <BsEnvelope />
//                     <span className="ml-1">{supportEmail}</span>
//                   </Nav.Link>
//                 </Link>
//               </Nav.Item>
//               <Nav.Item className="px-3 mx-1 text-md d-none d-lg-flex">
//                 <Link href={urls.home} passHref>
//                   <Nav.Link>
//                     <FiHome />
//                     <span className="ml-1">Home</span>
//                   </Nav.Link>
//                 </Link>
//               </Nav.Item>
//             </>
//           )}
//           <Nav.Item className="px-3 mx-1 text-md">
//             <Link href={urls.profile} passHref>
//               <Nav.Link>{getLoggedInUser()}</Nav.Link>
//             </Link>
//           </Nav.Item>
//           <ProfileMenu />
//         </>
//       );
//   }

//   return (
//     <Navbar
//       expand="lg"
//       bg="white"
//       variant="light"
//       className="nav-height-lg p-2 py-lg-0 nav-absolute shadow"
//       id="navbar"
//     >
//       <Container fluid>
//         <Navbar.Brand className="px-3">
//           <Link href={router.pathname === "/" ? urls.home : "/"}>
//             <img
//               src="/images/logo.png"
//               alt="2hub_logo"
//               className="cursor-pointer"
//               width="100"
//             />
//           </Link>
//         </Navbar.Brand>
//         <Nav className="mx-auto">
//           {displayNavTabs && (
//             <ul className="list-unstyled d-flex align-items-center justify-content-around text-center mb-0 nav-menu-link">
//               {searchTabs.map(({ title, icon, path, tabName }) => (
//                 <Nav.Item
//                   className={`px-3 mx-1 d-none d-lg-flex cursor-pointer text-md ${
//                     activeTab === tabName
//                       ? styles.activeTab
//                       : styles.inactiveTab
//                   }`}
//                   key={title}
//                   onClick={() => router.push(path)}
//                 >
//                   <div className="d-flex flex-column justify-content-center align-items-center">
//                     <IconContext.Provider
//                       value={{ className: "search-nav-tab-icon" }}
//                     >
//                       {icon}
//                     </IconContext.Provider>
//                     <div className="text-md">{title}</div>
//                   </div>
//                 </Nav.Item>
//               ))}
//             </ul>
//           )}
//         </Nav>
//         <Nav className="nav-menu-link align-items-center flex-row">
//           {rightContent}
//         </Nav>
//       </Container>
//     </Navbar>
//   );
// };

// export default NavBar;

// import Link from "next/link";
// import { useRouter } from "next/router";
// import { useState, useEffect } from "react";
// import { Container, Nav, Navbar } from "react-bootstrap";
// import ProfileMenu from "./profileMenu";
// import { AiOutlineArrowRight } from "react-icons/ai";
// import { BsEnvelope } from "react-icons/bs";
// import { FiPhoneCall, FiHome } from "react-icons/fi";
// import { searchTabs, pathToTabs } from "../../../shared/searchTabs";
// import { useSession } from "../../../context/sessionContext";
// import { getLoggedInUser } from "../../../utils/helper";
// import styles from "./navBar.module.scss";
// import { urls } from "../../../shared/urls";
// import { IconContext } from "react-icons/lib";
// import {
//   supportEmail,
//   supportNumber,
//   supportNumberFormated,
// } from "../../../shared/contacts";

// const homePages = ["/", urls.hotels, urls.travelPackages];

// const excludedTabs = [
//   ...homePages,
//   urls.profile,
//   urls.credit,
//   urls.listing,
//   urls.bookings,
//   urls.mycredits,
//   urls.joinus,
//   urls.paymentPolicy,
//   urls.contactUs,
//   urls.aboutUs,
//   urls.documents
// ];

// const noSelectionTabs = [urls.paymentPolicy];

// const NavBar = () => {
//   const router = useRouter();
//   const session = useSession();
//   const [sessionToken, setSessionToken] = useState(null);
//   const activeTab = pathToTabs(router.pathname);

//   useEffect(() => {
//     setSessionToken(session);
//   }, []);

//   const displayNavTabs = !excludedTabs.includes(router.pathname.toLowerCase());

//   let rightContent = null;
//   switch (sessionToken) {
//     case null:
//       break;
//     case "":
//       rightContent = (
//         <>
//           {homePages.includes(router.pathname.toLowerCase()) ? (
//             <Nav.Item>
//               <p className="mb-0 text-primary text-md d-none d-lg-block">
//                 SIGN UP OR LOGIN TO UNLOCK EXCLUSIVE SAVINGS FOR AGENT PARTNERS
//                 ONLY <AiOutlineArrowRight />
//               </p>
//             </Nav.Item>
//           ) : null}
//           <Nav.Item className="px-3 mx-1">
//             <Link href={urls.login} passHref>
//               <Nav.Link>Login</Nav.Link>
//             </Link>
//           </Nav.Item>
//           <Nav.Item className="px-3 mx-1">
//             <Link href={urls.joinus} passHref>
//               <Nav.Link>Sign Up</Nav.Link>
//             </Link>
//           </Nav.Item>
//         </>
//       );
//       break;
//     default:
//       rightContent = (
//         <>
//           {!displayNavTabs && (
//             <>
//               <Nav.Item className="px-3 mx-1 text-md d-none d-lg-flex">
//                 <Link href={`tel:${supportNumber}`} passHref>
//                   <Nav.Link>
//                     <FiPhoneCall />
//                     <span className="ml-1">{supportNumberFormated}</span>
//                   </Nav.Link>
//                 </Link>
//               </Nav.Item>
//               <Nav.Item className="px-3 mx-1 text-md d-none d-lg-flex">
//                 <Link href={`mailto:${supportEmail}`} passHref>
//                   <Nav.Link>
//                     <BsEnvelope />
//                     <span className="ml-1">{supportEmail}</span>
//                   </Nav.Link>
//                 </Link>
//               </Nav.Item>
//               <Nav.Item className="px-3 mx-1 text-md d-none d-lg-flex">
//                 <Link href={urls.home} passHref>
//                   <Nav.Link>
//                     <FiHome />
//                     <span className="ml-1">Home</span>
//                   </Nav.Link>
//                 </Link>
//               </Nav.Item>
//             </>
//           )}
//           <Nav.Item className="px-3 mx-1 text-md">
//             <Link href={urls.profile} passHref>
//               <Nav.Link>{getLoggedInUser()}</Nav.Link>
//             </Link>
//           </Nav.Item>
//           <ProfileMenu />
//         </>
//       );
//   }

//   return (
//     <Navbar
//       expand="lg"
//       bg="white"
//       variant="light"
//       className="nav-height-lg p-2 py-lg-0 nav-absolute shadow"
//       id="navbar"
//     >
//       <Container fluid>
//         <Navbar.Brand className="px-3">
//           <Link href={router.pathname === "/" ? urls.home : "/"}>
//             <img
//               src="/images/logo.png"
//               alt="2hub_logo"
//               className="cursor-pointer"
//               width="100"
//             />
//           </Link>
//         </Navbar.Brand>
//         <Nav className="mx-auto">
//           {displayNavTabs && (
//             <ul className="list-unstyled d-flex align-items-center justify-content-around text-center mb-0 nav-menu-link">
//               {searchTabs.map(({ title, icon, path, tabName }) => (
//                 <Nav.Item
//                   className={`px-3 mx-1 d-none d-lg-flex cursor-pointer text-md ${
//                     activeTab === tabName
//                       ? styles.activeTab
//                       : styles.inactiveTab
//                   }`}
//                   key={title}
//                   onClick={() => router.push(path)}
//                 >
//                   <div className="d-flex flex-column justify-content-center align-items-center">
//                     <IconContext.Provider
//                       value={{ className: "search-nav-tab-icon" }}
//                     >
//                       {icon}
//                     </IconContext.Provider>
//                     <div className="text-md">{title}</div>
//                   </div>
//                 </Nav.Item>
//               ))}
//             </ul>
//           )}
//         </Nav>
//         <Nav className="nav-menu-link align-items-center flex-row">
//           {rightContent}
//         </Nav>
//       </Container>
//     </Navbar>
//   );
// };

// export default NavBar;

// New
// import Link from "next/link";

const NavBar = (props) => {
  const router = useRouter();
  const session = useSession();
  const [sessionToken, setSessionToken] = useState(null);
  const [amount,setAmount] = useState('')
  const [creditAmount,setCreditAmount] = useState('')
  // const activeTab = pathToTabs(router.pathname);
  const [activeTab, setActiveTab] = useState(router.pathname);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [logoLink, setLogoLink] = useState('/images/updatedLogo.png');
  let counter = 0;
  useEffect(() => {
    if (document.cookie.includes("token") == true) {
      setLoggedIn(true);
    }
    
    checkLogo();
    
      // if (document.cookie.includes("token") == true) {
      //   setLoggedIn(true);
      // }
      createWallet();
      fetchData();
      fetchCreditInfo()
  }, []);
  useEffect(()=>{
    fetchData()
    fetchCreditInfo();
  },[props.changed])
  const checkLogo=()=>{
    
    if(Cookies.get('logo')){
      setLogo();
    }
    else{
      if(counter<10){
        // if(logoLink.includes('https')){
        //   counter =4;
        // }
        setTimeout(function(){
          if(Cookies.get('logo'))
          setLogo();
          counter= counter+1;
        },200);
     
    }
    }
  }

  const setLogo=()=>{
    setLogoLink(S3_URL+Cookies.get('logo'))
  }
  useEffect(() => {
    setActiveTab(router.pathname)
  }, [router.pathname]);
  const createWallet = async () =>{
    const data = await fetchDataWithAuth(`${NODE_API_URL}/wallet/create`,'POST','',[],[]);
    // console.log(data)
  }
  // Wallet Integration API 
  const fetchData = async () => {
    const data = await fetchDataWithAuth( 
      `${NODE_API_URL}/wallet/info`, 
      'GET',
      '',
      [],
      null
    )
    // console.log('Wallet Integration',data.data.amount);
    setAmount(data?.data?.amount||'')
  }
  const fetchCreditInfo = async () =>{
    const response = await fetchDataWithAuth(`${NODE_API_URL}/getAgentCredit`, "GET", "", [], null);
    // console.log(response?.data?.credit?.credit_agent_id === undefined)
    // setVisible(response?.data?.credit?.credit_agent_id === undefined?false:true)
    // setCreditData(response?.data?.credit)
    setCreditAmount(response?.data?.credit?.available_limit);
  }
  const linkClicked = (link) => {
    if (link == '/home') {
      router.push(link)
    }
    else {
      if (loggedIn) {
        router.push(link)
      }
      else {
        setShowLoginModal(true);
      }
    }
  }
  return (
    // <header className="header__wrapper">
    //   <div className="header__brand">
    //     <Link href="/">
    //       <img src="/images/logo.png" alt="2hub_logo" width="100" />
    //     </Link>
    //     <div className="header__hamburger"></div>
    //   </div>
    //   <div className="header__navbar">
    //     <ul className="list-unstyled d-flex">
    //       <li className={activeTab === '/home'
    //                   ? styles.activeTab
    //                   : styles.inactiveTab}>
    //         <span style={{cursor:"pointer"}} onClick={()=>linkClicked('/home')}>Home</span>
    //       </li>
    //       <li className={activeTab === '/bookings'
    //                   ? styles.activeTab
    //                   : styles.inactiveTab}>
    //         <span style={{cursor:"pointer"}} onClick={()=>linkClicked('/bookings')}>Bookings</span>
    //       </li>

    //       <li className={activeTab === '/credit'
    //                   ? styles.activeTab
    //                   : styles.inactiveTab}>
    //         <span style={{cursor:"pointer"}} onClick={()=>linkClicked('/credit')}>My Credits</span>
    //       </li>
    //       <li  className={activeTab === '/profile'
    //                   ? styles.activeTab
    //                   : styles.inactiveTab}>
    //         <span style={{cursor:"pointer"}} onClick={()=>linkClicked('/profile')}>My Profile</span>
    //       </li>

    //     </ul>
    //   </div>
    //   <div style={{display:"flex"}}>
    //   <div className="header__price">
    //     <img src="/images/wallet.svg" alt="wallet" />
    //     <span>₹27,180</span>

    //   </div>
    //   {loggedIn&&<div className="header__price" style={{marginLeft:"10px", cursor:"pointer"}}>
    //     <span onClick={()=>{setLoggedIn(false); logout()}}>Logout</span>
    //   </div>}
    //   </div>
    //   <ModalComponent

    //     show={showLoginModal}
    //     onHide={() => setShowLoginModal(false)}
    //     bodyClassName="p-5 mb-3"
    //     body={
    //       <Login
    //         loggedIn={() => {
    //           setShowLoginModal(false);
    //           router.reload();
    //         }}
    //       />
    //     }
    //   />
    // </header>
    <Navbar collapseOnSelect expand="lg" className="header__wrapper">
      <div className="header__brand">
        <Navbar.Brand href="/">


          <img src={logoLink} alt="2hub_logo" width="100" />

        </Navbar.Brand>
        </div>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
         <div className="header__navbar">
       <ul className="list-unstyled">
        {loggedIn==true?
        <>
        <li className={activeTab === '/home'
                     ? styles.activeTab
                     : styles.inactiveTab}>
           <span style={{cursor:"pointer"}} onClick={()=>linkClicked('/home')}>Home</span>
         </li>
         {Cookies.get('accesses')&&JSON.parse(Cookies.get('accesses')).includes(19)&&  <li className={activeTab === '/bookings'
                     ? styles.activeTab
                     : styles.inactiveTab}>
           <span style={{cursor:"pointer"}} onClick={()=>linkClicked('/bookings')}>Bookings</span>
         </li>}

        {Cookies.get('accesses')&&JSON.parse(Cookies.get('accesses')).includes(17)&& <li className={activeTab === '/credit'
                     ? styles.activeTab
                     : styles.inactiveTab}>
           <span style={{cursor:"pointer"}} onClick={()=>linkClicked('/credit')}>My Credits</span>
         </li>}
         <li  className={activeTab === '/profile'||activeTab=='profile-staff'
                     ? styles.activeTab
                     : styles.inactiveTab}>
           <span style={{cursor:"pointer"}} onClick={()=>{ if(Cookies.get('user_type')=='staff') linkClicked('/profile-staff'); else linkClicked('/profile')}}>My Profile</span>
         </li>
          <li  className="logout">
           <span style={{cursor:"pointer"}} className={activeTab === '/stafflisting'
                     ? styles.activeTab
                     : styles.inactiveTab} onClick={()=>{linkClicked('/stafflisting')}}>User Management</span>
         </li>

          <li  className="logout">
           <span style={{cursor:"pointer"}} className={activeTab === '/branchdetails'
                     ? styles.activeTab
                     : styles.inactiveTab} onClick={()=>{linkClicked('/branchdetails')}}>Branch Details</span>
         </li>

         <li  className="logout">
           <span style={{cursor:"pointer"}} className={activeTab === '/wallet/transaction-history'
                     ? styles.activeTab
                     : styles.inactiveTab} onClick={()=>{linkClicked('/wallet/transaction-history')}}>Transaction History</span>
         </li>


          <li  className="logout">
           <span style={{cursor:"pointer"}} className={activeTab === '/wallet/offline-payment'
                     ? styles.activeTab
                     : styles.inactiveTab} onClick={()=>{linkClicked('/wallet/offline-payment')}}>Offline Payment</span>
         </li>

          <li  className="logout">
           <span style={{cursor:"pointer"}} className={activeTab === '/wallet/home'
                     ? styles.activeTab
                     : styles.inactiveTab} onClick={()=>{linkClicked('/wallet/home')}}>Deposit Account</span>
         </li>
         
         <li  className="logout">
           <span style={{cursor:"pointer"}} onClick={()=>{setLoggedIn(false); logout()}}>Logout</span>
         </li>
        </>
        :
        <>
         <li className="logout">
           <span style={{cursor:"pointer"}} onClick={()=>router.push('/join-us')}>Sign Up</span>
         </li>
         <li className="logout">
           <span style={{cursor:"pointer"}} onClick={()=>router.push('/login')}>Login</span>
         </li>
        </>}
       </ul>
     </div>
   
        </Navbar.Collapse>
     {loggedIn? <div className="left__header">
     <div className="header__price" style={{cursor:"pointer", display:'block', minWidth:'100px',textAlign: 'center'}} onClick={()=>{router.push('/wallet/home')}}>
       {/* <img src="/images/wallet.svg" alt="wallet" /> */}
       <div className="wallet_text mb-1">Deposit Account</div>
       <div className="wallet_text_money">₹ {Number(amount).toLocaleString('en-IN')}</div>

     </div>
     <div className="header__price ml-3" style={{cursor:"pointer", display:'block', minWidth:'100px',textAlign: 'center'}} onClick={()=>{router.push('/credit')}}>
       {/* <img src="/images/wallet.svg" alt="wallet" /> */}
       <div className="wallet_text mb-1">Credit</div>
       <div className="wallet_text_money">₹ {Number(creditAmount).toLocaleString('en-IN')}</div>

     </div>
     <div className="header__price" style={{marginLeft:"10px", cursor:"pointer"}}>
       <span onClick={()=>{setLoggedIn(false); logout()}}>Logout</span>
     </div>
     </div>:
     <div className="left__header">
     <div className="header__price">
     <span style={{cursor:"pointer"}} onClick={()=>router.push('/join-us')}>Sign Up</span>

     </div>
     <div className="header__price" style={{marginLeft:"10px", cursor:"pointer"}}>
     <span onClick={()=>router.push('/login')}>Login</span>
     </div>
     </div>
     
     }
    </Navbar>
  );
};

export default NavBar;
