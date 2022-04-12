import Link from "next/link";
import { useState } from "react";
import { Image, NavDropdown } from "react-bootstrap";
import { logout } from "../../../utils/helper";

const ProfileMenu = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  return (
    <NavDropdown
      title={
        <Image roundedCircle src="/images/avatar2.svg" alt="" width="30px" />
      }
      onMouseEnter={() => setDropdownOpen(true)}
      onMouseLeave={() => setDropdownOpen(false)}
      onClick={() => setDropdownOpen(true)}
      show={dropdownOpen}
      id="collasible-nav-dropdown"
      className="px-3 mx-1 position-static"
    >
      <Link href="/mycredits" passHref>
        <NavDropdown.Item className="text-md text-muted">
          My Credits
        </NavDropdown.Item>
      </Link>
      <Link href="/bookings" passHref>
        <NavDropdown.Item className="text-md text-muted">
          My Bookings
        </NavDropdown.Item>
      </Link>
      <div
        className="dropdown-item text-md text-muted"
        onClick={() => logout()}
      >
        Logout
      </div>
    </NavDropdown>
  );
};

export default ProfileMenu;
