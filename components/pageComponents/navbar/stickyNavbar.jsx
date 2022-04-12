const StickyNavbar = () => {
  return (
    <Navbar
      expand="lg"
      bg="white"
      variant="light"
      className="nav-height-lg p-2 py-lg-0 nav-absolute shadow"
    >
      <Container fluid>
        <Navbar.Brand>
          <Link href="/">
            <img src="/images/logo.png" alt="2hub_logo" />
          </Link>
        </Navbar.Brand>

        <Nav className="ml-lg-auto nav-menu-link align-items-center">
          {session ? (
            <>
              <Nav.Item className="position-static px-3 mx-1">
                <Link href="/profile" passHref>
                  <Nav.Link className="position-static">My profile</Nav.Link>
                </Link>
              </Nav.Item>
              <ProfileMenu />
            </>
          ) : (
            <>
              <Nav.Item className="position-static px-3 mx-1">
                <Link href="/login" passHref>
                  <Nav.Link className="position-static">Login</Nav.Link>
                </Link>
              </Nav.Item>
              <Nav.Item className="position-static px-3 mx-1">
                <Link href="/join-us" passHref>
                  <Nav.Link className="position-static">Sign Up</Nav.Link>
                </Link>
              </Nav.Item>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default StickyNavbar;
