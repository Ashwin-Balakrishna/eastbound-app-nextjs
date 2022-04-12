import { Breadcrumb } from "react-bootstrap";
import { capitalizeText } from "../../../utils/helper";

const BreadCrumb = ({ name, query_data, code, city, page }) => {
  return (
    <Breadcrumb className="bg-transparent">
      <Breadcrumb.Item href="/" className="small">
        Home
      </Breadcrumb.Item>

      <Breadcrumb.Item
        className="small"
        href={`/home?search=${encodeURIComponent(JSON.stringify(query_data))}`}
      >
        Hotels in {capitalizeText(city)}
      </Breadcrumb.Item>

      <Breadcrumb.Item active className="small">
        {page}
      </Breadcrumb.Item>
    </Breadcrumb>
  );
};

export default BreadCrumb;
