import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Button,
  Card,
  Col,
  Container,
  Row,
  Tab,
  Tabs,
  Modal,
  Form,
  Alert,
  Spinner,
} from "react-bootstrap";
import DataTable from "react-data-table-component";
import BaseLayout from "../components/layouts/baseLayout";
import PageLayout from "../components/layouts/pageLayout";
import ModalComponent from "../components/elements/modal";
import IconButton from "../components/elements/iconButton";
import { fetchFormDataWithAuth  } from "../utils/apiHelper";
import withAuth from "../utils/withAuth";
import Select from "react-select";
import { FaEdit, FaTimes, FaCheck, FaDownload, FaEye } from "react-icons/fa";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import Payments from "../components/pageComponents/profile/payments";
import Link from "next/link";
import { reloadPage ,NODE_API_URL } from "../utils/helper";
import Cookies from "js-cookie";
const API_URL = process.env.global_url;

const options = [
  { value: "change of plan", label: "Change of plan" },
  { value: "duplicate booking", label: "Duplicate booking" },
  { value: "personal reason", label: "Personal reason" },
];

function Bookings() {
  const [bookings, setBookings] = useState("");
  const [payments, setPayments] = useState("");
  const [username, setUsername] = useState("");
  const [filter, setFilter] = useState("");
  const [action, setAction] = useState("");
  const [bookingAction, setBookingAction] = useState("");
  const [fetched, setFetched] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [bookingOption, setBookingOption] = useState("");
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [confirmCancelModal, setConfirmCancelModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [isBookingSelected, setIsBookingSelected] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [bookingOptionId, setBookingOptionId] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [actionFor, setActionFor] = useState(false);
  const [step, setStep] = useState("");
  const [reason, setReason] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [disable,setDisable] = useState(false)
  const [cancellationAmount,setCancellationAmount] = useState(0)
  const [refundAmount,setRefundAmount] = useState(0)
  const [reasonError,setReasonError] = useState(true);
  const router = useRouter();
  // console.log(bookingId,paymentId,reason)
  const [selectedCancellationIndex,setSelectedCancellationIndex] = useState('')

  useEffect(() => {
    if (fetched === false) {
      getMyBookings();
      getMyPayments();
    }
    setUsername(localStorage.getItem("firstName"));
  }, []);
  useEffect(()=>{

  },[action])
  const RecommendedOption = (data) => {
    return (
      <Table className="text-dark">
        <Thead>
          <Tr>
            <Th width="300px">Hotel</Th>
            <Th>Room</Th>
            <Th>Amount</Th>
            <Th>Due Date</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.data.map((option, i) => (
            <Tr key={i}>
              <Td width="300px">{option.hotel_info}</Td>
              <Td>{option.room_info}</Td>
              <Td>&#x20B9;{Math.trunc(option.payment_amount)}</Td>
              <Td>
                {new Date(option.payment_due_date)
                  .toLocaleDateString("en-GB")
                  .split("/")
                  .join("-")}
              </Td>
              <Td>
                {isBookingSelected === false ? (
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => {
                      setShowAcceptModal(true);
                      setBookingOptionId(option.booking_options_id);
                    }}
                  >
                    Accept
                  </Button>
                ) : (
                  ""
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    );
  };

  function MoreOptionsModal(props) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
      <>
        <Button
          variant="link"
          size="sm"
          className={props.className}
          onClick={handleShow}
        >
          <FaEye />
        </Button>

        <Modal
          show={show}
          onHide={handleClose}
          size="lg"
          scrollable={true}
          dialogClassName="100vh"
        >
          <Modal.Header closeButton>
            <Modal.Title>{props.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ height: 700 }}>
            <Table borderless>
              <thead>
                <tr>
                  <td className="text-muted" width="200px">
                    Hotel
                  </td>
                  <td className="text-muted">Room</td>
                  <td className="text-muted">Amount</td>
                  <td className="text-muted">Due Date</td>
                  <td className="text-muted">Action</td>
                </tr>
              </thead>
              <tbody>
                {props.data.map((option, i) => (
                  <tr key={i}>
                    <td width="200px">{option.hotel_info}</td>
                    <td>{option.room_info}</td>
                    <td>&#x20B9;{Math.trunc(option.payment_amount)}</td>
                    <td>
                      {new Date(option.payment_due_date)
                        .toLocaleDateString("en-GB")
                        .split("/")
                        .join("-")}
                    </td>
                    <td>
                      {props.isBookingSelected === true ? (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => {
                            setShowAcceptModal(true);
                            setBookingOptionId(option.booking_options_id);
                          }}
                        >
                          Accept
                        </Button>
                      ) : (
                        ""
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Modal.Body>
        </Modal>
      </>
    );
  }

  const acceptBooking = async (bookingId, bookingOptionId) => {
    try {
      const bookings = await fetchFormDataWithAuth(
        `${API_URL}/api/agent/bookings/bookingOptions/${bookingId}/${bookingOptionId}/accept/`,
        "GET",
        null,
        null,
        null
      );
      if (bookings.Error) {
        console.error("Something went wrong!");
      } else {
        location.reload();
      }
    } catch (err) {
      location.reload();
      console.error(`Something went wrong! Error: ${JSON.stringify(err)}`);
    }
  };

  const handlePayment = async (paymentBookingId, paymentId) => {
    const payload = JSON.stringify({
      booking_id: paymentBookingId,
      payment_id: paymentId,
      redirect_url: `${API_URL}/payment/success`,
      cancel_url: `${API_URL}/payment/cancel`,
    });
    try {
      const resp = await fetchFormDataWithAuth(
        `${API_URL}/api/agent/payment/checkout`,
        "POST",
        null,
        null,
        payload
      );
      if (resp.Error) {
        console.error("Something went wrong!");
      } else {
        location.href = `${resp.redirect_url}`;
      }
    } catch (err) {
      console.error(`Something went wrong! Error: ${JSON.stringify(err)}`);
    }
  };

  const paginationOptions = {
    rowsPerPageText: "Items per page",
    rangeSeparatorText: "of",
  };

  let columns;
  if (action == 1) {
    columns = [
      {
        name: "DETAILS",
        cell: (filter) => (
          <div
            style={{ whiteSpace: "pre-line", lineHeight: 1.5 }}
            className="py-3"
          >
            {filter.detail}
          </div>
        ),
        grow: 2,
      },
      {
        name: "CHECK IN",
        cell: (filter) => (
          <div>
            {new Date(filter.check_in)
              .toLocaleDateString("en-GB")
              .split("/")
              .join("-")}
          </div>
        ),
        grow: 1,
      },
      {
        name: "CHECK OUT",
        cell: (filter) => (
          <div>
            {new Date(filter.check_out)
              .toLocaleDateString("en-GB")
              .split("/")
              .join("-")}
          </div>
        ),
        grow: 1,
      },
      {
        name: "ACTION",
        cell: (filter) => (
          <div style={{ width: 800 }}>
            {filter.booking_options.length !== 0 ? (
              <IconButton
                variant="info"
                className="mr-3"
                tooltip="View"
                icon={<FaEye />}
                tooltipDirection="left"
                onClick={() => {
                  setShowModal(true);
                  setBookingOption(filter.booking_options);
                  setIsBookingSelected(filter.booking_option_selected);
                  setBookingId(filter.booking_id);
                }}
              />
            ) : null}
            <IconButton
              className="mr-3"
              tooltip="Edit"
              icon={<FaEdit />}
              tooltipDirection="left"
              style={{
                color: "#fff",
                background: "#229acd",
                borderColor: "#229acd",
              }}
              onClick={() =>
                router.push(
                  {
                    pathname: "/bookings/[bookingId]",
                    query: {
                      data: JSON.stringify(filter),
                    },
                  },
                  {
                    pathname: `/bookings/${filter.booking_id}`,
                    query: {
                      data: JSON.stringify(filter),
                    },
                  }
                )
              }
            />
           <IconButton
              className="mr-3"
              tooltip="Cancel"
              icon={<FaTimes />}
              style={{
                color: "#fff",
                backgroundColor: "#c82333",
                borderColor: "#bd2130",
              }}
              tooltipDirection="left"
              onClick={() => {
                setBookingAction("reject");
                setBookingId(filter.booking_id);
                setPaymentId(filter.payment_id);
                setActionFor(true);
                setStep(1);
                setShowConfirmModal(true);
              }}
            />
          </div>
        ),
      },
    ];
  } else if (action == 2) {
    columns = [
      {
        name: "DETAILS",
        selector: "detail",
        cell: (filter) => (
          <div
            style={{ whiteSpace: "pre-wrap", lineHeight: 2 }}
            className="py-3"
          >
            {filter.detail}
          </div>
        ),
        grow: 2,
      },
      {
        name: "CHECK IN",
        selector: "check_in",
        cell: (filter) => (
          <div>
            {new Date(filter.check_in)
              .toLocaleDateString("en-GB")
              .split("/")
              .join("-")}
          </div>
        ),
        grow: 1,
      },
      {
        name: "CHECK OUT",
        selector: "check_out",
        cell: (filter) => (
          <div>
            {new Date(filter.check_out)
              .toLocaleDateString("en-GB")
              .split("/")
              .join("-")}
          </div>
        ),
        grow: 1,
      },
      {
        name: "PENDING AMOUNT",
        selector: "amount",
        cell: (filter) => (
          <div>
            {filter.payment_amount > 0 ? (
              <span>&#x20B9; {Math.trunc(filter.payment_amount)} </span>
            ) : (
              "--"
            )}
          </div>
        ),
        grow: 1,
      },
      {
        name: "PAID AMOUNT",
        cell: (filter) => (
          <div>
            {filter.paid_amount > 0 ? (
              <span>&#x20B9; {Math.trunc(filter.paid_amount)}</span>
            ) : (
              "--"
            )}
          </div>
        ),
        grow: 1,
      },
      {
        name: "DUE DATE",
        cell: (filter) => (
          <div>
            {filter.booking_due_date !== null ? (
              <>
                {new Date(filter.booking_due_date)
                  .toLocaleDateString("en-GB")
                  .split("/")
                  .join("-")}
              </>
            ) : (
              "--"
            )}
          </div>
        ),
        grow: 1,
      },
      {
        name: "ACTION",
        cell: (filter) => (
          <div className="ml-n2" style={{ width: 800 }}>
            {bookings.is_credit_agent === true &&
            filter.payment_amount !== null ? (
              <IconButton
                className="mr-3"
                tooltip="Accept"
                icon={<FaCheck />}
                style={{
                  color: "#fff",
                  background: "#28a745",
                  borderColor: "#28a745",
                }}
                tooltipDirection="left"
                onClick={() => {
                  setBookingAction("accept");
                  setBookingId(filter.booking_id);
                  setPaymentId(filter.payment_id);
                  setActionFor(true);
                  setStep(2);
                  setShowConfirmModal(true);
                }}
              />
            ) : filter.payment_amount !== null &&
              bookings.is_credit_agent == false ? (
              <Button
                variant="link"
                size="sm"
                className="mr-2 text-success"
                style={{ minWidth: 50 + "px" }}
                onClick={() =>
                  handlePayment(filter.booking_id, filter.payment_id)
                }
              >
                Pay
              </Button>
            ) : null}
            <IconButton
              className="mr-3"
              tooltip="Edit"
              icon={<FaEdit />}
              tooltipDirection="left"
              style={{
                color: "#fff",
                background: "#229acd",
                borderColor: "#229acd",
              }}
              onClick={() =>
                router.push(
                  {
                    pathname: "/bookings/[bookingId]",
                    query: {
                      data: JSON.stringify(filter),
                    },
                  },
                  {
                    pathname: `/bookings/${filter.booking_id}`,
                    query: {
                      data: JSON.stringify(filter),
                    },
                  }
                )
              }
            />
            <IconButton
              className="mr-3"
              tooltip="Cancel"
              icon={<FaTimes />}
              style={{
                color: "#fff",
                backgroundColor: "#c82333",
                borderColor: "#bd2130",
              }}
              tooltipDirection="left"
              onClick={() => {
                setBookingAction("reject");
                setBookingId(filter.booking_id);
                setPaymentId(filter.payment_id);
                setActionFor(true);
                setStep(2);
                setShowConfirmModal(true);
              }}
            />
          </div>
        ),
        grow: 2,
      },
    ];
  } else if (action == 0) {
    columns = [
      {
        name: "DETAILS",
        selector: "detail",
        cell: (filter) => (
          <div
            style={{ whiteSpace: "pre-line", lineHeight: 1.5 }}
            className="py-3"
          >
            {filter.detail}
          </div>
        ),
        grow: 5,
      },
      {
        name: "CHECK IN",
        selector: "check_in",
        cell: (filter) => (
          <div>
            {new Date(filter.check_in)
              .toLocaleDateString("en-GB")
              .split("/")
              .join("-")}
          </div>
        ),
        grow: 3,
      },
      {
        name: "CHECK OUT",
        selector: "check_out",
        cell: (filter) => (
          <div>
            {new Date(filter.check_out)
              .toLocaleDateString("en-GB")
              .split("/")
              .join("-")}
          </div>
        ),
        grow: 3,
      },
      {
        name: "PAYMENT MODE",
        selector: "payment_mode",
        cell: (filter) => (
          <div>
            {filter.payment_mode ? filter.payment_mode : "--"}
          </div>
        ),
        grow: 3,
      },
      {
        name: "PENDING AMOUNT",
        cell: (filter) => (
          <div>
            {filter.payment_amount > 0 ? (
              <span>&#x20B9; {Math.trunc(filter.payment_amount)}</span>
            ) : (
              <span>&#x20B9; 0 </span>
            )}
          </div>
        ),
        grow: 3,
      },
      {
        name: "PAID AMOUNT",
        cell: (filter) => (
          <div>
            {filter.paid_amount > 0 ? (
              <span>&#x20B9; {Math.trunc(filter.paid_amount)}</span>
            ) : (
              "--"
            )}
          </div>
        ),
        grow: 3,
      },
      {
        name: "ACTION",
        cell: (filter) => (
          <>
            {bookings.is_credit_agent === true &&
            filter.payment_amount !== null ? (
              <IconButton
                className="mr-3"
                tooltip="Accept"
                icon={<FaCheck />}
                tooltipDirection="left"
                style={{
                  color: "#fff",
                  background: "#28a745",
                  borderColor: "#28a745",
                }}
                onClick={() => {
                  setBookingAction("accept");
                  setStep(3);
                  setBookingId(filter.booking_id);
                  setPaymentId(filter.payment_id);
                  setShowConfirmModal(true);
                }}
              />
            ) : filter.payment_amount !== null &&
              bookings.is_credit_agent == false ? (
              <Button
                variant="link"
                size="sm"
                className="mr-2 text-success"
                style={{ minWidth: 50 + "px" }}
                onClick={() =>
                  handlePayment(filter.booking_id, filter.payment_id)
                }
              >
                Pay
              </Button>
            ) : null}
            {/* <IconButton
              className="mr-3 p-2"
              tooltip="Edit"
              icon={<FaEdit />}
              tooltipDirection="left"
              style={{
                color: "#fff",
                background: "#229acd",
                borderColor: "#229acd",
              }}
              onClick={() =>
                router.push(
                  {
                    pathname: "/bookings/[bookingId]",
                    query: {
                      data: JSON.stringify(filter),
                    },
                  },
                  {
                    pathname: `/bookings/${filter.booking_id}`,
                    query: {
                      data: JSON.stringify(filter),
                    },
                  }
                )
              }
            /> */}
         {Cookies.get('accesses')&&JSON.parse(Cookies.get('accesses')).includes(20)&&   <IconButton
              className="mr-3 p-2"
              tooltip="Cancel"
              icon={<FaTimes />}
              style={{
                color: "#fff",
                backgroundColor: "#c82333",
                borderColor: "#bd2130",
              }}
              tooltipDirection="left"
              onClick={() => {
                setBookingAction("reject");
                setBookingId(filter.booking_id);
                setPaymentId(filter.payment_id);
                setActionFor(true);
                setStep(3);
                setCancellationAmount(filter.cancellation_charges)
                setRefundAmount(filter.refund)
                setShowConfirmModal(true);
              }}
            />}
            {/* <IconButton
              variant="secondary"
              className="mr-3"
              tooltip="Download"
              icon={<FaDownload />}
              tooltipDirection="left"
              onClick={() => downloadBookingFile(165, "invoice")}
            /> */}
            {
              filter.booking_id && Cookies.get('accesses')&&JSON.parse(Cookies.get('accesses')).includes(21) ? (
              <Link href={`/documents/${filter.booking_id}`}>
              <a>Invoices & Vouchers</a>
            </Link>
              ):''
          }
          </>
        ),
        grow: 8,
      }
    ];
  } else if (action == 4) {
    columns = [
      {
        name: "DETAILS",
        selector: "detail",
        cell: (filter) => (
          <div
            style={{ whiteSpace: "pre-line", lineHeight: 1.5 }}
            className="py-3"
          >
            {filter.detail}
          </div>
        ),
        grow: 3,
      },
      {
        name: "CANCELLATION STATUS",
        cell: (filter) => (
          <div>{filter.booking_cancellation.booking_cancellation_status}</div>
        ),
      },
      {
        name: "REASON",
        cell: (filter) => (
          <div>{filter.booking_cancellation.booking_cancellation_reason ||'--'}</div>
        ),
      },
      {
        name: "CANCELLATION AMOUNT",
        cell: (filter) => (
          <div>
            {filter.booking_cancellation.booking_cancellation_amount > 0 ? (
              <span>
                &#x20B9;{" "}
                {Math.trunc(
                  filter.booking_cancellation.booking_cancellation_amount
                )}
              </span>
            ) : (
              "0"
            )}
          </div>
        ),
      },
      {
        name: "REFUND AMOUNT",
        cell: (filter) => (
          <div>
            {filter.booking_cancellation.booking_refund_amount > 0 ? (
              <span>
                &#x20B9;{" "}
                {Math.trunc(filter.booking_cancellation.booking_refund_amount)}
              </span>
            ) : (
              "--"
            )}
          </div>
        ),
      },
      // {
      //   name: "ACTION",
      //   cell: (filter) =>
      //     filter.booking_cancellation.booking_cancellation_status ==
      //     "Request Confirmation" ? (
      //       <>
      //         <IconButton
      //           className="mr-3"
      //           tooltip="Accept"
      //           icon={<FaCheck />}
      //           style={{
      //             color: "#fff",
      //             backgroundColor: "#218838",
      //             borderColor: "#1e7e34",
      //           }}
      //           bookings
      //           tooltipDirection="left"
      //           onClick={() => {
      //             setBookingAction("accept");
      //             setBookingId(filter.booking_id);
      //             setStep(5);
      //             setConfirmCancelModal(true);
      //           }}
      //         />
      //         <IconButton
      //           className="mr-3"
      //           tooltip="Reject"
      //           icon={<FaTimes />}
      //           style={{
      //             color: "#fff",
      //             backgroundColor: "#c82333",
      //             borderColor: "#bd2130",
      //           }}
      //           tooltipDirection="left"
      //           onClick={() => {
      //             setBookingAction("reject");
      //             setBookingId(filter.booking_id);
      //             setStep(5);
      //             setConfirmCancelModal(true);
      //           }}
      //         />
      //       </>
      //     ) : (
      //       "--"
      //     ),
      // },
    ];
  } 
  else if (action == 5 ){
    columns = [
      {
        name: "Hotel Name",
        selector: "hotel_name",
        cell: (filter) => (
          <div
            style={{ whiteSpace: "pre-line", lineHeight: 1.5 }}
            className="py-3"
          >
            {filter.hotel_name}
          </div>
        ),
        grow: 3,
      },
      {
        name: "City",
        selector: "city",
        cell: (filter) => (
          <div
            style={{ whiteSpace: "pre-line", lineHeight: 1.5 }}
            className="py-3"
          >
            {filter.city}
          </div>
        ),
        grow: 3,
      },
      {
        name: "CHECK IN",
        selector: "check_in",
        cell: (filter) => (
          <div>
            {new Date(filter.check_in)
              .toLocaleDateString("en-GB")
              .split("/")
              .join("-")}
          </div>
        ),
        grow: 1,
      },
      {
        name: "CHECK OUT",
        selector: "check_out",
        cell: (filter) => (
          <div>
            {new Date(filter.check_out)
              .toLocaleDateString("en-GB")
              .split("/")
              .join("-")}
          </div>
        ),
        grow: 1,
      },
      
      {
        name: "Status",
        selector: "status",
        cell: (filter) => (
          <div
            style={{ whiteSpace: "pre-line", lineHeight: 1.5 }}
            className="py-3"
          >
            {filter.status}
          </div>
        ),
        grow: 3,
      },
    ];
  }
  else {
    columns = [
      {
        name: "DETAILS",
        selector: "detail",
        cell: (filter) => (
          <div
            style={{ whiteSpace: "pre-line", lineHeight: 1.5 }}
            className="py-3"
          >
            {filter.detail}
          </div>
        ),
        grow: 3,
      },
      {
        name: "CHECK IN",
        selector: "check_in",
        cell: (filter) => (
          <div>
            {new Date(filter.check_in)
              .toLocaleDateString("en-GB")
              .split("/")
              .join("-")}
          </div>
        ),
        grow: 1,
      },
      {
        name: "CHECK OUT",
        selector: "check_out",
        cell: (filter) => (
          <div>
            {new Date(filter.check_out)
              .toLocaleDateString("en-GB")
              .split("/")
              .join("-")}
          </div>
        ),
        grow: 1,
      },
    ];
  }

  const handleBookingAction = async (id, paymentId, reason) => {
    let payload = JSON.stringify({
      payment_id: paymentId,
      reason:reason
    });
    // else if(reason == "") {
    //   payload = null
    // }
    // setLoading(true)
    try {

      const data = await fetchFormDataWithAuth(
        `${API_URL}/api/agent/bookings/booking/${bookingAction}/${id}/`,
        "POST",
        null,
        null,
        payload
      );
      if (data.Error) {
        console.log("error");
      } else {
        setShowConfirmModal(false);
        setIsSuccess(true);
        if (bookingAction == "accept") {
          setSuccessMessage("Accepted successfully!");
          // router.reload(router.pathname)
          reloadPage()
        } else {
          setSuccessMessage("Rejected successfully");
          reloadPage()
          // reloadPage()
        }
        // reloadBookings(step);
      }
      // setLoading(false)
    } catch (err) {
      // setLoading(false)
      console.error(`Something went wrong! Error: ${JSON.stringify(err)}`);
    }
  };

  const handleCancellation = async () => {
    // setLoading(true)
    try {
      const data = await fetchFormDataWithAuth(
        `${API_URL}/api/agent/bookings/cancellation/${bookingAction}/${bookingId}/`,
        "POST",
        null,
        null,
        null
      );
      if (data.Error) {
        console.log("error");
      } else {
        setConfirmCancelModal(false);
        reloadBookings(step);
        setIsSuccess(true);
        if (bookingAction == "accept") {
          setSuccessMessage("Cancellation Accepted!");
          // router.reload(router.pathname)
          reloadPage()
        } else {
          // reloadPage()
          setSuccessMessage("Cancellation Rejected!");
          reloadPage()
          // router.reload()
        }
      }
      // setLoading(false)
    } catch (err) {
      // setLoading(false)
      console.error(`Something went wrong! Error: ${JSON.stringify(err)}`);
    }
  };

  const reloadBookings = async () => {
    setLoading(true)
    try {
      const bookings = await fetchFormDataWithAuth(
        `${API_URL}/api/agent/bookings/listing`,
        "GET",
        null,
        null,
        null
      );
      const manualBooking = await fetchFormDataWithAuth(`${NODE_API_URL}/manualBooking/list`,'GET',null,null,null,null)
      if (bookings.Error || ! manualBooking.status ) {
      } else {
        // setBookings(bookings);
        setBookings({... bookings,'Manual Booking':manualBooking?.data});
        let objectKeys1 = Object.values(bookings);
        let tabList1 = objectKeys1.slice(1)
        tabList1.unshift(tabList.splice(2,1)[0])
        
        setFilter(bookings[objectKeys[step]]);
        // setFilter(Object.values(tabList1)[step]);
        // setFilter(Object.values(bookings)[step]);
      }
      setLoading(false)
    } catch (err) {
      // setLoading(false)
      console.error(`Something went wrong! Error: ${JSON.stringify(err)}`);
    }
  };

  const getMyBookings = async () => {
    setLoading(true)
    try {
      const bookings = await fetchFormDataWithAuth(
        `${API_URL}/api/agent/bookings/listing`,
        "GET",
        null,
        null,
        null
      );
      const manualBooking = await fetchFormDataWithAuth(`${NODE_API_URL}/manualBooking/list`,'GET',null,null,null,null)
      if (bookings.Error) {
      } else {
        //remove Past and Provsional bookings
        

        setBookings({... bookings,'Manual Booking':manualBooking?.data});
        console.log(bookings)
        setFilter(bookings['Confirmed Bookings']);
        // setFilter(Object.values(bookings)[1]);
        setFetched(true);
      }
      setLoading(false)
    } catch (err) {
      setLoading(false)
      console.error(`Something went wrong! Error: ${JSON.stringify(err)}`);
    }
  };

  const getMyPayments = async () => {
    // setLoading(true)
    try {
      const payments = await fetchFormDataWithAuth(
        `${API_URL}/api/agent/account/payments`,
        "GET",
        null,
        null,
        null
      );
      if (payments.Error) {
      } else {
        setPayments(payments);
      }
      // setLoading(false)
    } catch (err) {
      // setLoading(false)
      console.error(`Something went wrong! Error: ${JSON.stringify(err)}`);
    }
  };

  const filterBookings = (value) => {
    setIsSuccess(false);
    setAction("");
    setFilter("");
    setAction(value);
    // let objectKeys1 = Object.values(bookings);
    // let tabList1 = objectKeys1.slice(1)
    // tabList1.unshift(tabList.splice(2,1)[0])
    setFilter(bookings[objectKeys[value]]);
    // console.log(Object.values(bookings)[value + 1]);
  };

  let objectKeys = Object.keys(bookings);
  let tabList = objectKeys.slice(1)
  tabList.unshift(tabList.splice(2,1)[0])
  objectKeys = tabList

  const checkForDisable=()=>{
    if(bookingAction!='accept'){
      if(reason!='')
      return false;
      else
      return true
    }
    else{
      return true;
    }
  }

  const getCancellationAmount=()=>{
    console.log(filter)
    if(filter){
    const index = filter.findIndex(element => element.booking_id==bookingId);
    if(index>=0){
      return filter[index].cancellation_charges
    }
    else{
      return '';
    }
  }
  }

  const getRefundAmount=()=>{
    if(filter){
      const index = filter.findIndex(element => element.booking_id==bookingId);
      if(index>=0){
        return filter[index].refund
      }
      else{
        return '';
      }
    }
  }


  return (
    <PageLayout title="2Hub | Bookings">
      <BaseLayout>
        <Card
          body
          className="border-0 shadow-sm mb-5"
          style={{
            backgroundImage: "url('../../images/Profile_BG.jpg')",
            backgroundPosition: "center",
          }}
        >
          <Container fluid>
            <Row className="pt-2 pb-4">
              <Col md={12}>
                <p
                  className="mb-0 text-primary text-capitalize"
                  style={{ fontSize: 40 }}
                >
                  Hello {username}
                </p>
                <p className="text-muted">Welcome back to 2HUB</p>
              </Col>
            </Row>
          </Container>
        </Card>

        <Card className="border-0 shadow-sm">
          <Card.Body>
            <Tabs defaultActiveKey="bookings" id="uncontrolled-tab-example">
              <Tab eventKey="bookings" title="Bookings" className="mt-4">
                <Tabs
                  variant="pills"
                  defaultActiveKey="0"
                  onSelect={(selectedKey) => {
                    console.log(selectedKey)
                    filterBookings(parseInt(selectedKey));
                  }}
                  className="nav-tab-pills mb-2"
                  style={{
                    overflowX: "auto",
                    overflowY: "hidden",
                    flexWrap: "nowrap",
                  }}
                >
                  {objectKeys.map((key, index) => {
                    if(key=='Past Bookings' || key =='Provisional Bookings'){
                        return <></>
                      }                    
                    else{
                   return <Tab eventKey={index} title={key} key={index}>
                      {isSuccess && (
                        <Alert
                          variant="success"
                          dismissible
                          onClose={() => setIsSuccess(false)}
                          className="mt-4"
                        >
                          {successMessage}
                        </Alert>
                      )}
                      {
                        loading && columns ? 
                        <div className="mt-4 justify-content-center text-center align-items-center">
                          <Spinner animation="border" variant="primary" />
                        </div>
                        :
                        <DataTable
                        noHeader={true}
                        columns={columns}
                        data={filter}
                        pagination
                        paginationComponentOptions={paginationOptions}
                      />
                      }
                      
                    </Tab>
                    }
                    
}
)}
                </Tabs>
              </Tab>
              <Tab eventKey="payments" title="Payments">
                <Payments payments={payments} />
              </Tab>
            </Tabs>
            {/* <h5 className="mb-4">Bookings</h5> */}
          </Card.Body>
        </Card>
        <ModalComponent
          size="lg"
          show={showModal}
          scrollable={true}
          onHide={() => setShowModal(false)}
          title="Recommended Options"
          body={<RecommendedOption data={bookingOption} />}
        />
        <ModalComponent
          size="md"
          show={showConfirmModal}
          classDialog="null"
          scrollable={false}
          onHide={() => {setShowConfirmModal(false)}}
          title={bookingAction == "accept" ? "Accept" : "Cancel"}
          body={
            bookingAction == "accept" ? (
              <p>Are you sure?</p>
            ) : (
              <Form>
                <Form.Group>
                  <Form.Label>Provide reason *</Form.Label>
                  {actionFor ? (
                    <>
                    <Select
                      options={options}
                      value={options.find((obj) => obj.value === reason)}
                      onChange={(e) => {setReason(e.value),setReasonError(false)}}
                    />
                   
                    </>
                  ) : (
                    <Form.Control
                      as="textarea"
                      name="reason"
                      value={reason}
                      onChange={(e) => {setReason(e.target.value),setReasonError(false)}}
                    />
                  )}
                </Form.Group>
              </Form>
            )
          }
          footer={
            <Button
              // disabled={reasonError}
              variant="primary"
              disabled={checkForDisable()}
              onClick={() => {
              
                if(bookingAction == "accept")
                handleBookingAction(bookingId, paymentId, reason);
                else{
                  setShowConfirmModal(false);
                  setConfirmModal(true);
                  // setReason('')
                }
              }}
            >
              Yes
            </Button>
          }
        />
        <ModalComponent
          size="lg"
          show={showAcceptModal}
          scrollable={true}
          onHide={() => setShowAcceptModal(false)}
          title="Accept"
          body={<p>Accept Booking Option?</p>}
          footer={
            <>
              <Button
                type="button"
                className="px-5 font-weight-bold"
                onClick={() => {
                  acceptBooking(bookingId, bookingOptionId);
                }}
              >
                Yes
              </Button>
            </>
          }
        />
        <ModalComponent
          size="md"
          show={confirmCancelModal}
          classDialog="null"
          onHide={() => setConfirmCancelModal(false)}
          title={bookingAction == "accept" ? "Accept" : "Reject"}
          body={<p>Are you sure?</p>}
          footer={
            <Button variant="primary" onClick={() => handleCancellation()}>
              Yes
            </Button>
          }
        />
        <ModalComponent
          size="md"
          show={confirmModal}
          classDialog="null"
          onHide={() => setConfirmModal(false)}
          title={bookingAction == "accept" ? "Accept" : "Cancellation"}
          body={
              <>
                <p>Are you sure you want to cancel this booking?</p>
                <p className="mt-1">Cancellation Amount : {getCancellationAmount()}</p>
                <p className="mt-1">Refund Amount : {getRefundAmount()}</p>
              </> 
            }
          footer={
            <Button variant="primary" disabled={disable} onClick={() => {handleBookingAction(bookingId, paymentId, reason);setDisable(true)}}>
              Yes
            </Button>
          }
        />
      </BaseLayout>
    </PageLayout>
  );
}

export default withAuth(Bookings);
