const NavPillItem = ({ itemName, onCLick, checked }) => {
  return (
    <li
      className={`nav-item nav-pill-item highlight-pill text-xs mr-2 mb-2`}
      onClick={onCLick}
    >
      <div
        className={`cursor-pointer nav-link nav-pill-link ${
          checked ? "active" : "text-jetblack"
        }`}
      >
        {itemName}
      </div>
    </li>
  );
};

export default NavPillItem;
