import { Button, Text, Flex, Box, Spacer } from "@chakra-ui/react";
import { Card } from "@chakra-ui/react";
import { Input, IconButton } from "@chakra-ui/react";
import { ChatIcon } from "@chakra-ui/icons";

import Message from "../../components/Message";

import "./ChatBot.css";

import axios from "axios";

import { useEffect, useRef, useState } from "react";

let is_loading = false;

export default function Home() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);

  const req_qa_box = useRef(null);

  const handleQuestionUpdated = (event) => {
    if (event.key === "Enter") {
      sendQuestion();
    }
  };

  const handleQuestionChange = (event) => {
    setQuestion(event.target.value);
  };

  const sendQuestion = (event) => {
    if (question === "" || is_loading) return;

    is_loading = true;
    setMessages((messages) => [
      ...messages,
      { key: messages.length, data: question },
      { key: messages.length + 1, data: "..." },
    ]);
  };

  useEffect(() => {
    if (question === "") return;

    req_qa_box.current.scrollTop = req_qa_box.current.scrollHeight;

    var config = {
      method: "GET",
      url: `http://127.0.0.1:5025/catalogaicopilot/get-product/${question}`,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    };
    setQuestion("");

    axios(config)
      .then(function (response) {
        let current_messages = messages;
        current_messages.pop();
        setMessages((messages) => [
          ...current_messages,
          { key: current_messages.length, data: response.data },
        ]);
        is_loading = false;
      })
      .catch(function (error) {
        return error;
      });
  }, [messages.length]);

  return (
    <Flex justify={"center"}>
      <Flex direction={"column"} width={"100%"} margin={"5px"}>
        <Card variant="outline" padding={"8px"} height={"570px"}>
          <Flex
            id={"qa_box"}
            direction={"column"}
            paddingRight={"8px"}
            ref={req_qa_box}
          >
            {messages.map((message) =>
              message.key % 2 === 0 ? (
                <Message
                  key={message.key}
                  me={true}
                  message={message.data}
                  wait={false}
                />
              ) : message.data === "..." ? (
                <Message
                  key={message.key}
                  me={false}
                  message={message.data}
                  box_ref={req_qa_box}
                  wait={true}
                />
              ) : (
                <Message
                  key={message.key}
                  me={false}
                  message={message.data}
                  box_ref={req_qa_box}
                  wait={false}
                />
              )
            )}
          </Flex>
          <Flex marginTop={"9px"}>
            <Input
              placeholder="Ask me any questions"
              height={"50px"}
              marginRight={"10px"}
              value={question}
              onChange={handleQuestionChange}
              onKeyDown={handleQuestionUpdated}
            />
            <IconButton
              colorScheme="teal"
              aria-label="Call Segun"
              size="lg"
              icon={<ChatIcon />}
              onClick={sendQuestion}
            />
          </Flex>
        </Card>
      </Flex>
    </Flex>
  );
}
