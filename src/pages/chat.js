import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";

const Chat = () => {
  const uri = process.env.REACT_APP_ENDPOINT;
  const { chatId } = useParams();
  const avatarVideo = chatId + ".mp4";
  const [loading, setLoading] = useState(true);
  const [sessId, setSessId] = useState("");
  const [dummVid, setDummVid] = useState(null);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState([]);
  const [actualVid, setActualVid] = useState(null);

  const handleChatMessage = (e) => {
    e.preventDefault();
    setMsgs((prev) => [...prev, { message: input, type: "User" }]);

    const data = new URLSearchParams();
    data.append("input_text", input);
    data.append("session_id", sessId);

    setInput("");

    axios
      .post(`${uri}/chat`, data, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((res) => {
        const newMsgs = res.data.text_chunk_list.map((text) => ({
          message: text,
          type: "Bot",
        }));
        setMsgs((prev) => [...prev, ...newMsgs]);

        const checkVideoStatus = () => {
          axios
            .get(`${uri}/stream_actual_video`, {
              params: {
                avatar_video: avatarVideo,
                session_id: sessId,
              },
            })
            .then((res) => {
              console.log(res);
              if (res.data.status === false) {
                console.log("Video not ready, retrying...");
                setTimeout(checkVideoStatus, 3000);
              } else {
                console.log("Video is ready, perform your action");
                const blob = new Blob([res.data], { type: "video/mp4" });
                const videoUrl = URL.createObjectURL(blob);
                setActualVid(videoUrl);
              }
            })
            .catch((err) => {
              console.error("Error fetching video status:", err);
            });
        };

        checkVideoStatus();
      })
      .catch((err) => {
        console.error("Error fetching chat response:", err);
      });
  };

  console.log(actualVid, dummVid);

  useEffect(() => {
    if (avatarVideo) {
      const data = new URLSearchParams();
      data.append("avatar_video", avatarVideo);

      axios
        .post(`${uri}/create_session`, data, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
        .then((res) => {
          setSessId(res.data.session_id);
          axios
            .get(`${uri}/stream_dummy_video`, {
              params: {
                avatar_video: avatarVideo,
                session_id: sessId,
              },
              responseType: "arraybuffer",
            })
            .then((res) => {
              const blob = new Blob([res.data], { type: "video/mp4" });
              const videoUrl = URL.createObjectURL(blob);
              setDummVid(videoUrl);
              setLoading(false);
            })
            .catch((err) => {
              console.error("Error fetching video:", err);
              setLoading(false);
            });
        })
        .catch((error) => {
          setLoading(false);
          console.error("Error:", error);
        });
    }
  }, []);

  return loading ? null : (
    <Container style={{ height: "100vh" }}>
      <Row>
        <Col>
          {actualVid ? (
            <video
              controls={false}
              playsInline
              autoPlay={true}
              src={actualVid}
              className="w-100 h-100"
            />
          ) : (
            <video
              controls={false}
              loop="loop"
              playsInline
              autoPlay={true}
              src={dummVid}
              className="w-100 h-100"
            />
          )}
        </Col>
        <Col xs={8} className="chat">
          <p className="highlightText">In Conversation with {chatId}</p>
          <div className="position-relative h-100">
            <div className="d-flex flex-column">
              {msgs.map((msg, index) => (
                <p
                  className={`messages px-3 rounded py-2 ${
                    msg.type === "User"
                      ? "text-end bg-body-secondary align-self-end"
                      : "bg-dark text-white"
                  }`}
                  key={index}
                >
                  {msg.type}: {msg.message}
                </p>
              ))}
            </div>
            <Form onSubmit={handleChatMessage}>
              <InputGroup>
                <Form.Control
                  placeholder="Message"
                  aria-label="Message"
                  aria-describedby="basic-addon2"
                  name="text"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <Button
                  variant="outline-secondary"
                  id="button-addon2"
                  type="submit"
                >
                  Button
                </Button>
              </InputGroup>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Chat;
