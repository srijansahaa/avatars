import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import loader from "../assets/loader.gif";

const Avatars = () => {
  const [avatars, setAvatars] = useState([]);
  const [loading, setLoading] = useState(true);
  const uri = process.env.REACT_APP_ENDPOINT;

  useEffect(() => {
    axios.get(`${uri}/list_avatar`).then((res) => {
      setAvatars(res.data);
      setLoading(false);
    });
  }, []);

  return loading ? (
    <Container className="d-flex justify-content-center">
      <img src={loader} alt="Loading..." />
    </Container>
  ) : (
    <Container>
      <p className="highlightText">
        Select from the AI Avatars below to begin your conversation!
      </p>
      <Row xs={1} md={3} className="g-4">
        {avatars.map((ava, index) => (
          <Col key={index}>
            <Card className="avatarCards">
              <Card.Img variant="top" src={uri + ava.url} />
              <Card.Body>
                <Card.Title className="text-center">
                  {ava.avatar_name}
                </Card.Title>
                <Button variant="dark" className="w-100">
                  <Link to={`/chat/${ava.avatar_name}`}>
                    Chat with {ava.avatar_name}
                  </Link>
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Avatars;
