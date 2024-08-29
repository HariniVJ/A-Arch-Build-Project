import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';



function NavScrollExample() {
  // Define the style for the brand text
  const brandTextStyle = {
    fontFamily: 'YourCustomFont, sans-serif', // Replace with your desired font family
    fontSize: '1.5rem', // Adjust size as needed
    fontWeight: 'bold', // Adjust weight as needed
  };

  const bgStyle = {
    background: 'rgba(255, 255, 255, 0.1)', // Semi-transparent white background
    backdropFilter: 'blur(10px)', // Frosted glass effect
    borderRadius: '8px', // Rounded corners
    padding: '20px', // Padding for content spacing
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Light shadow for depth
    marginLeft: '219px', // Adjust margin-left as needed
  };

  return (
    <Navbar style={bgStyle} expand="lg" className="bg-body-tertiary">
      <Container fluid>
       
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Nav.Link href="#action1">Previous</Nav.Link>
            <NavDropdown title="Profile" id="navbarScrollingDropdown">
              <NavDropdown.Item href="#action3">Settings</NavDropdown.Item>
              <NavDropdown.Item href="#action4">Logout</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action5">Something else here</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="#">Next</Nav.Link>
          </Nav>
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success">Search</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavScrollExample;
