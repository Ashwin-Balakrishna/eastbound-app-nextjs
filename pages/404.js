import { Button, Image } from "react-bootstrap";
import Link from "next/link";

const Custom404 = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
      <Image src="/images/404.svg" width="400" />
      <h3 className="mt-4">Looks like you’re lost!</h3>
      <p>We can’t seem to find the page you’re looking for.</p>
      <Link href="/" passHref>
        <Button variant="primary" className="mt-3">
          Go to home page
        </Button>
      </Link>
    </div>
  );
};

export default Custom404;
