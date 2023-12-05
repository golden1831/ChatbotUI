import { Button, Text, Flex, Box, Spacer } from "@chakra-ui/react";
import { Card } from "@chakra-ui/react";
import { Input, IconButton } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { ChatIcon } from "@chakra-ui/icons";

import EmbedModal from "../../components/EmbedModal";
import Message from "../../components/Message";

import "./Home.css";

import axios from "axios";

import { useEffect, useRef, useState } from "react";

let is_loading = false;

export default function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure();
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
      method: "POST",
      // url: `https://catalogaicopilot-l5n4jumt5q-ez.a.run.app/catalogaicopilot/get-product`,
      url: `http://127.0.0.1:5025/catalogaicopilot/get-product`,
      data: { question },
      header: {

      }
    };

    axios.post("http://127.0.0.1:5025/catalogaicopilot/get-product", { question })
      .then(function (response) {
        let current_messages = messages;
        // console.log(JSON.stringify(JSON.parse(response.data.result)));
        console.log("response ---> ", response);
        current_messages.pop();
        if( response.data.isJSON ){
          setMessages((messages) => [
            ...current_messages,
            { key: current_messages.length, data: response.data.result },
          ]);
        } else {
          let response_data = JSON.parse(response.data.result);
          let data = [];
          Object.keys(response_data).map(item =>  data.push({ key: item, data: response_data[item] }))
          let response_jsx = <>{data.map((item, index) => <p key={index}><b style={{ textTransform: 'uppercase' }}>{item.key}: </b><span>{item.data}</span></p>)}</>
          setMessages((messages) => [
            ...current_messages,
            { key: current_messages.length, data: response_jsx  },
          ]);
        }      
        
        is_loading = false;
        setQuestion("");
      })
      .catch(function (error) {
        return error;
      });
  }, [messages.length]);

  return (
    <Flex justify={"center"}>
      <Flex direction={"column"} width={"70%"}>
        <Flex alignItems={"center"}>
          <Box p="4">
            <Text fontSize="30px" as="b">
              EventCHI Chat UI
            </Text>
          </Box>
          <Spacer />
          <Box p="4">
            {/* <Button colorScheme="gray" onClick={onOpen}>
              Embed on website
            </Button> */}
          </Box>
        </Flex>
        <Card variant="outline" padding={"8px"}>
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
      <EmbedModal
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
      ></EmbedModal>
    </Flex>
  );
}
