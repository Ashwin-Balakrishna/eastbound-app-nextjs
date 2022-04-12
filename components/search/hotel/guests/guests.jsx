import React, { useEffect, useState } from "react";
import { Button, Dropdown, Form } from "react-bootstrap";
import Styles from "./guests.module.scss";
import {AiOutlineUser} from "react-icons/ai"
import Room from "./room";

const Guest = ({ onRoomSelect, rooms }) => {
  const [guestList, setGuestList] = useState(
    rooms || [
      {
        roomId: 1,
        adults: 1,
        children: 0,
        children_age: [],
      },
    ]
  );
  const [title, setTitle] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [currId, setCurrId] = useState(1);

  useEffect(() => {
    const total = guestList.reduce(function (sum, room) {
      return sum + room.adults + room.children;
    }, 0);

    let text = "";

    if (total > 0) {
      text =
        guestList.length > 1
          ? `${guestList.length} Rooms,`
          : ` ${guestList.length} Room,`;
      text += total > 1 ? ` ${total} Guests` : ` ${total} Guest `;
    } else {
      text = "Room, Guest";
    }

    setTitle(text);
    onRoomSelect({ guestList });
  }, [guestList]);

  const closeMenu = (event) => {
    const dropdownMenu = document.getElementById("guest-dropdown-menu");

    if (dropdownMenu && !dropdownMenu.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.body.addEventListener("click", closeMenu);
    return () => {
      document.body.removeEventListener("click", closeMenu);
    };
  }, []);

  const handleResetRoom = () => {
    setCurrId(1);
    setGuestList([
      {
        roomId: 1,
        adults: 1,
        children: 0,
        children_age: [],
      },
    ]);
  };

  const handleRemoveRoom = (roomId) => {
    const newGuestList = guestList.filter((room) => room.roomId !== roomId);
    setGuestList(newGuestList);
  };

  const handleAddRoom = () => {
    if (guestList.length < 5) {
      setGuestList([
        ...guestList,
        {
          roomId: currId + 1,
          adults: 1,
          children: 0,
          children_age: [],
        },
      ]);
      setCurrId(currId + 1);
    }
  };

  const handleReduceAdult = (roomId) => {
    const newGuestList = guestList.map((room) => {
      if (room.roomId === roomId) {
        room.adults -= 1;
      }
      return room;
    });
    setGuestList(newGuestList);
  };

  const handleIncreaseAdult = (roomId) => {
    const newGuestList = guestList.map((room) => {
      if (room.roomId === roomId) {
        room.adults += 1;
      }
      return room;
    });
    setGuestList(newGuestList);
  };

  const handleReduceChildren = (roomId) => {
    const newGuestList = guestList.map((room) => {
      if (room.roomId === roomId) {
        room.children -= 1;
        room.children_age.pop();
      }
      return room;
    });
    setGuestList(newGuestList);
  };

  const handleIncreaseChildren = (roomId) => {
    const newGuestList = guestList.map((room) => {
      if (room.roomId === roomId) {
        room.children_age[room.children] = 1;
        room.children += 1;
      }
      return room;
    });
    setGuestList(newGuestList);
  };

  const handleAddtoAgeList = (option_value, index, roomId) => {
    const newGuestList = guestList.map((room) => {
      if (room.roomId === roomId) {
        room.children_age[index] = parseInt(option_value) + 1;
      }
      return room;
    });

    setGuestList(newGuestList);
  };

  return (
    <Form.Group className="mb-lg-0">
      
      <div className="dropdown-custom position-relative">
        
        <Form.Control
          id="guest-room-input"
          readOnly
          className="dropdown-input form-control bg-white"
          value={title || "0 Room, 0 Guest"}
          onClick={() => setIsOpen(!isOpen)}
        />
        {isOpen ? (
          <div
            id="guest-dropdown-menu"
            className={`position-absolute bg-white w-100 rounded p-2 shadow-sm ${Styles.modal}`}
          >
            {guestList.map((room, i) => (
              <div key={room.roomId}>
                <Room
                  roomNumber={i + 1}
                  room={room}
                  numberOfRooms={guestList.length}
                  reduceAdult={(roomId) => handleReduceAdult(roomId)}
                  increaseAdult={(roomId) => handleIncreaseAdult(roomId)}
                  reduceChildren={(roomId) => handleReduceChildren(roomId)}
                  increaseChildren={(roomId) => handleIncreaseChildren(roomId)}
                  removeRoom={(roomId) => handleRemoveRoom(roomId)}
                  addtoAgeList={(option_value, index, roomId) =>
                    handleAddtoAgeList(option_value, index, roomId)
                  }
                />
                <Dropdown.Divider />
              </div>
            ))}
            <div className="d-flex justify-content-between justify-content-lg-end px-3 py-2 py-md-0">
              <div>
                <Button
                  size="sm"
                  className="mr-2"
                  variant="outline-info"
                  onClick={handleResetRoom}
                >
                  Reset
                </Button>
                <Button
                  size="sm"
                  className="mr-2"
                  variant="primary"
                  onClick={handleAddRoom}
                  disabled={guestList.length >= 5}
                >
                  Add Rooms
                </Button>
              </div>
              <Button
                size="sm"
                className="mr-2 d-md-none"
                onClick={() => setIsOpen(false)}
              >
                Apply
              </Button>
            </div>
          </div>
        ) : null}
      </div>
      {/* {errorText && <ErrorText error={errorText} />} */}
    </Form.Group>
  );
};

export default Guest;
