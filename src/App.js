import "./App.css";
import Home from "./pages/Home";
import Embed from "./pages/Embed"
import ChatBotDlg from "./pages/ChatBot"

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ChakraProvider } from "@chakra-ui/react";

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route exact path="/" Component={Home} />
          <Route exact path="/subscriber" Component={Embed} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
