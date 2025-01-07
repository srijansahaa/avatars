import "./App.css";
import { Route, Routes } from "react-router-dom";
import Avatars from "./pages/avatars";
import Chat from "./pages/chat";
import { Container, Navbar } from "react-bootstrap";

function App() {
  return (
    <div>
      <Navbar expand="lg" bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#home">Avatars</Navbar.Brand>
        </Container>
      </Navbar>
      <Routes>
        <Route path="/" element={<Avatars />} />
        <Route path="/chat/:chatId" element={<Chat />} />
        <Route path="*" element={<h1>Page Not Found</h1>} />
      </Routes>
    </div>
  );
}

export default App;
