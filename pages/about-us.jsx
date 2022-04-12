import { Card, Col, Container, Image, Row } from "react-bootstrap";
import PageLayout from "../components/layouts/pageLayout";
import Footer from "../components/pageComponents/footer/footer";

const AboutUs = () => {
  return (
    <PageLayout title="2Hub | About Us">
      <section className="bg-info text-white d-flex align-items-center pb-5 mb-5 mb-lg-7 text-center">
        <Container className="pt-5 about-container">
          <Row>
            <Col xs={12} className="mx-auto">
              <h1>ABOUT 2HUB</h1>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="mb-5 mb-lg-7">
        <Container className="about-container">
          <Row>
            <Col xs={12} className="mx-auto">
              <p className="mb-lg-4 mb-3">
                2HUB provides Travel Agents, Group Travelers and Corporates 
                a superior booking experience with the best deals, choicest 
                properties, flexibility and convenience in planning their stay 
                in 150,000 rooms across over a 1,000 locations.
              </p>
              <p className="mb-lg-4 mb-3">
                Leveraging on the 16 years of experience provided by our 
                parent company Eastbound, we have strong relationships 
                with hotel operators in India and across the globe.
              </p>
              <p className="mb-lg-4 mb-3">
                We facilitate travel aspirations of customers by offering 
                a platform that offers a plethora of global accommodation 
                options. We help you to co-create your travel experience 
                with our personalised concierge service that helps you 
                find the right solutions for your travel and MICE needs.
              </p>
              <p className="mb-lg-4 mb-3">
                Come experience the 2HUB difference.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="mb-5 mb-lg-7 bg-shade1 py-5">
        <Container className="about-container">
          <Row className="mb-5 text-center">
            <Col xs={12}>
              <h1>OUR STRENGTHS</h1>
            </Col>
          </Row>
          <Row className="mb-5">
            <Col xs={12} className="mx-auto">
              <p className="mb-lg-4 mb-3">
                Our parent company Eastbound has the pedigree 
                to command the best rates among hotel chains 
                across this region. Coupled with the booking engine 
                and the experienced and dedicated staff to troubleshoot 
                and solve intricate travel issues, 2HUB is well poised to 
                serve demanding customers and provide the best solutions 
                for their travel needs.
              </p>
              <ul>
                <li>
                Widest network of Hotels/Venues (Over 150,000 rooms across 1,000+ locations)
                </li>
                <li>
                End to end Event Management
                </li>
                <li>
                Unmatched Quality Control
                </li>
                <li>
                Tech-Driven Automation and customer-friendly UX
                </li>
                <li>
                Robust Loyalty & rewards Programme
                </li>
                <li>
                24/7 Customer Support
                </li>
                <li>
                Tailor-made Products
                </li>
                <li>
                Sustainable Tourism & responsible Luxury
                </li>
              </ul>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="mb-5 mb-lg-7 py-5">
        <Container className="about-container">
          <Row className="mb-5 text-center">
            <Col xs={12}>
              <h1>WHY 2HUB</h1>
            </Col>
          </Row>
          <Row className="mb-5">
            <Col xs={12} className="mx-auto">
              <ul>
                <li className="pb-4" >
                <h6 style={{fontWeight: "bold"}}>Widest Network of Hotels : <br/></h6>
                With over 16 years of experience and longstanding 
                relationships with the top hotel brands we are able 
                to give you access to quality accommodations at 
                competitive rates
                </li>
                <li className="pb-4" >
                <h6 style={{fontWeight: "bold"}}>Technology and data-driven strengths : <br/></h6>
                We make optimum use of technology to ensure efficiency 
                and accuracy from in-depth Data Analytics to Deal 
                Tracking and detailed Reports
                </li>
                <li className="pb-4" >
                <h6 style={{fontWeight: "bold"}}>Competitive Pricing : <br/></h6>
                Our relationships combined with our exceptional negotiation 
                skill make sure that you get the best pricing
                </li>
                <li className="pb-4" >
                <h6 style={{fontWeight: "bold"}}>Sales & Training Support : <br/></h6>
                Dedicated sales team is available 24/7 to provide timely 
                assistance in case of need and ensure that your clients/group’s 
                travel is flawless and hassle-free
                </li>
                <li>
                <h6 style={{fontWeight: "bold"}}>Vast Range of Products : <br/></h6>
                2HUB possess the full capacity to offer solutions 
                for B2B hotel bookings, End-to-end event management, 
                Brand activation solutions, Business travel, Domestic 
                & outbound tours and Interactive eLearning for its clients 
                </li>
              </ul>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="mb-5 mb-lg-7 bg-shade1 py-5">
        <Container className="about-container">
          <Row className="mb-5 text-center">
            <Col xs={12}>
              <h1>WHO WE ARE</h1>
            </Col>
          </Row>
          <Row className="mb-5">
            <Col xs={12} className="mx-auto">
              <p className="mb-lg-4 mb-3">
              2HUB prides itself on its ability to consolidate 
              hotel inventory and distribute it to the partner 
              members through its portal equipped with state of 
              the art technology. Our past 16 years of experience 
              has given us the pedigree to get the best rates from 
              hotels and pass it on to our partners.
              </p>
              <p className="mb-lg-4 mb-3">
              Our site gives easy direct booking access to competitively 
              priced hotel rooms and supporting services. Our Customer 
              Support Team is spread strategically across to connect with 
              Travel Agents, GSAs, Hotel Chains and stand-alone properties. 
              Our Support Team is manned by professionally qualified staff 
              to cater to enquiries, doubts and assistance for all your 
              travel needs.
              </p>
              <p className="mb-lg-4 mb-3">
              Our clients are from all over the world – Agents, 
              Groups, Corporates, Organisations of all sizes work 
              with us when planning a trip to work out their travel 
              costs. We are a trusted partner for these clients in 
              ensuring that their travel is hassle free and at the 
              right price point.
              </p>
              <p className="mb-lg-4 mb-3">
              Come experience the difference at 2HUB.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="mb-5 mb-lg-7 py-5">
        <Container className="about-container">
          <Row className="mb-5 text-center">
            <Col xs={12}>
              <h1>THE BOARD</h1>
            </Col>
          </Row>
          <Row className="mb-5">
            <Col xs={12} md={3}>
              <Image
                src="/images/prritviraj.jpg"
                fluid
                className="mb-3 mb-lg-0"
              />
            </Col>
            <Col xs={12} md={9}>
              <h4 style={{fontWeight: "bold"}}>Prrithviraj Singh</h4>
              <h6 className="pb-1" style={{fontWeight: "bold"}}>Managing Director</h6>
              <p>
              A chartered accountant by training, Prrithviraj has 
              spent over three decades with his first love – the 
              travel and tourism industry. He brings his professional 
              training to bear on the process and practices at Eastbound 
              Group. Having headed some of India’s largest travel companies 
              he commands immense respect and cache within the travel 
              fraternity and clients.
              </p>
              <p>
              He has been visionary in driving the company’s presence 
              into new sectors – CHIME, Think Strawberries, BYOND; among 
              others. He connects natively with the ethos of the sub-continent 
              and is deeply rooted in its culture. A connoisseur of Indian 
              crafts and artefacts, he has a prized collection built over 
              years of travel.
              </p>
            </Col>
          </Row>

          <hr className="py-3" />

          <Row className="mb-5">
            <Col xs={12} md={3}>
              <Image src="/images/Amit.jpg" fluid className="mb-3 mb-lg-0" />
            </Col>
            <Col xs={12} md={9}>
              <h4 style={{fontWeight: "bold"}}>Amit Kishore</h4>
              <h6 className="pb-1" style={{fontWeight: "bold"}}>Co-Founder and Director</h6>
              <p>
              Career entrepreneur, investor and co-founder of some premium t
              ravel companies in the Sub-continent, Middle East and Asia Pacific, 
              Amit leads the growth strategy for Eastbound `. He has successfully 
              developed high value partnerships with iconic global brands like Ferrari 
              World, Warner Brothers-theme parks, Dragone- USA, etc. A philanthropist, 
              Amit is extremely active in restoration work and the running of his legacy 
              of institutions in education, as well as a heritage temple.
              </p>
            </Col>
          </Row>

          <hr className="py-3" />

          <Row className="mb-5">
            <Col xs={12} md={3}>
              <Image src="/images/anirbanSenguptaOrange.jpeg" fluid className="mb-3 mb-lg-0" />
            </Col>
            <Col xs={12} md={9}>
              <h4 style={{fontWeight: "bold"}}>Anirban Sengupta</h4>
              <h6 className="pb-1" style={{fontWeight: "bold"}}>Chief Operating Officer</h6>
              <p>
              Anirban is a senior management professional in the travel industry. 
              His career over 20 years has been in sales and marketing working with 
              hospitality brands such as Oberoi, Hyatt, Accor Hotels, Kempinski hotels. 
              He is driving the growth trajectory of 2HUB and is instrumental in the 
              success of this company.
              </p>
            </Col>
          </Row>

        </Container>
      </section>

      {/* <section className="mb-5 mb-lg-7">
        <Container className="about-container">
          <Row className="mb-4">
            <Col xs={12} className="mx-auto text-center">
              <h1>The Management</h1>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={4}>
              <Card className="mb-4 border-0 custom-shadow">
                <Card.Img
                  variant="top"
                  src="/images/Anirban.jpg"
                  className="w-100"
                  style={{
                    height: "300px",
                    objectFit: "cover",
                    objectPosition: "top",
                  }}
                />
                <Card.Body>
                  <Card.Title>Anirban Sengupta</Card.Title>
                  <Card.Text className="small">Senior Vice President</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={4}>
              <Card className="mb-4 border-0 custom-shadow">
                <Card.Img
                  variant="top"
                  src="/images/ami_parekh.jpg"
                  className="w-100"
                  style={{
                    height: "300px",
                    objectFit: "cover",
                    objectPosition: "top",
                  }}
                />
                <Card.Body>
                  <Card.Title>Ami Parekh</Card.Title>
                  <Card.Text className="small">
                    VP -Sales &amp; Marketing
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={4}>
              <Card className="mb-4 border-0 custom-shadow">
                <Card.Img
                  variant="top"
                  src="/images/rahil.jpg"
                  className="w-100"
                  style={{
                    height: "300px",
                    objectFit: "cover",
                    objectPosition: "top",
                  }}
                />
                <Card.Body>
                  <Card.Title>Rahil Shaikh</Card.Title>
                  <Card.Text className="small">Sr. GM-Operations</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={4}>
              <Card className="mb-4 border-0 custom-shadow">
                <Card.Img
                  variant="top"
                  src="/images/sameer.jpg"
                  className="w-100"
                  style={{
                    height: "300px",
                    objectFit: "cover",
                    objectPosition: "top",
                  }}
                />
                <Card.Body>
                  <Card.Title>Sameer Athalye</Card.Title>
                  <Card.Text className="small">
                    Sr. GM Vendor Development
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={4}>
              <Card className="mb-4 border-0 custom-shadow">
                <Card.Img
                  variant="top"
                  src="/images/Amod.jpeg"
                  className="w-100"
                  style={{
                    height: "300px",
                    objectFit: "cover",
                    objectPosition: "top",
                  }}
                />
                <Card.Body>
                  <Card.Title>Amod Kulkarni</Card.Title>
                  <Card.Text className="small">Branch Manager - Pune</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={4}>
              <Card className="mb-4 border-0 custom-shadow">
                <Card.Img
                  variant="top"
                  src="/images/Meeta.jpeg"
                  className="w-100"
                  style={{
                    height: "300px",
                    objectFit: "cover",
                    objectPosition: "top",
                  }}
                />
                <Card.Body>
                  <Card.Title>Meeta Kothari</Card.Title>
                  <Card.Text className="small">
                    Deputy General Manager - Gujarat Sales
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section> */}
      <Footer />
    </PageLayout>
  );
};

export default AboutUs;
