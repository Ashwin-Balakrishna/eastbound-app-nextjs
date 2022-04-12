import { Button, Form, Table } from "react-bootstrap";
import { AiOutlineClose } from "react-icons/ai";
import { FiMinus, FiPlus } from "react-icons/fi";
import Styles from "./room.module.scss";

const Room = ({
  roomNumber,
  room,
  reduceAdult,
  increaseAdult,
  reduceChildren,
  increaseChildren,
  numberOfRooms,
  removeRoom,
  addtoAgeList,
}) => {
  return (
    <Table className="table-borderless">
      <thead>
        <tr>
          <th className="border-0 small align-middle font-weight-bold text-left">
            Room <span>{roomNumber}</span>
          </th>
          <th className="border-0 text-right align-middle" colSpan="3">
            {numberOfRooms > 1 ? (
              <Button
                size="sm"
                variant="outline-secondary"
                className={`${Styles.button} room-remove-button`}
                onClick={() => removeRoom(room.roomId)}
              >
                <AiOutlineClose />
              </Button>
            ) : null}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="small align-middle text-left">Adult</td>
          <td className="small align-middle">
            <Button
              size="sm"
              variant="outline-primary"
              disabled={room.adults <= 0 || room.adults + room.children <= 1}
              onClick={() => reduceAdult(room.roomId)}
            >
              <FiMinus />
            </Button>
          </td>
          <td className="small align-middle">{room.adults}</td>
          <td className="small align-middle">
            <Button
              size="sm"
              variant="outline-primary"
              disabled={room.adults >= 4 || room.adults + room.children >= 4}
              onClick={() => increaseAdult(room.roomId)}
            >
              <FiPlus />
            </Button>
          </td>
        </tr>
        <tr>
          <td className="small align-middle text-left">Child <span className="text-muted">(0-11 Years)</span></td>
          <td className="small align-middle ">
            <Button
              size="sm"
              variant="outline-primary"
              disabled={room.children <= 0 || room.adults + room.children <= 1}
              onClick={() => reduceChildren(room.roomId)}
            >
              <FiMinus />
            </Button>
          </td>
          <td className="small align-middle">{room.children}</td>
          <td className="small align-middle">
            <Button
              size="sm"
              variant="outline-primary"
              disabled={room.children >= 4 || room.adults + room.children >= 4}
              onClick={() => increaseChildren(room.roomId)}
            >
              <FiPlus />
            </Button>
          </td>
        </tr>

        {/* {Array.from({ length: room.children }).map((_, index) => (
          <tr key="index">
            <td className="small text-left">{`Child ${index + 1} Age`}</td>
            <td className="small" colSpan="2">
              <Form.Group>
                <Form.Control
                  as="select"
                  onChange={(e) =>
                    addtoAgeList(e.target.value, index, room.roomId)
                  }
                  key={index}
                  className="px-2 mb-0"
                >
                  {[...Array(12)].map((select, i) => (
                    <option key={i} value={i}>
                      {i + 1}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </td>
          </tr>
        ))} */}
      </tbody>
    </Table>
  );
};

export default Room;
