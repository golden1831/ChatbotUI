import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {v4 as uuid4} from 'uuid';

import { Text, Flex, Box, Spacer } from "@chakra-ui/react";
import { Card } from "@chakra-ui/react";
import { Input, IconButton } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { ChatIcon } from "@chakra-ui/icons";

import EmbedModal from "../../components/EmbedModal";
import Message from "../../components/Message";
import RadioCard from "../../components/Elements/RadioCard";
import FormFactor from "../../components/Elements/FormFactor";
import SuggestedData from "../../components/Elements/SuggestedData";
import ProductDetail from "../../components/Elements/ProductDetail";

import "./Home.css";

let is_loading = false;
let transactionId = localStorage.getItem('X-Transaction-ID');

if(!transactionId) {
  transactionId = uuid4();
  localStorage.setItem('X-Transaction-ID', transactionId);
}

export default function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [flag, setFlag] = useState(0);

  const [value, setValue] = useState("");
  const [inputStateDisable, setInputStateDisable] = useState(false);

  const [ws, setWs] = useState(null);
  const reconnectTimer = useRef(null);
  const maxReconnectAttempts = useRef(5); // Maximum reconnection attempts
  const reconnectAttempts = useRef(0); // Current reconnection attempt count

  const connectWebSocket = () => {
    const socket = new WebSocket(`wss://catalogaicopilot-l5n4jumt5q-ez.a.run.app?x-transaction-id=${transactionId}`);
    // const socket = new WebSocket(`ws://localhost:5025?x-transaction-id=${transactionId}`);
    // Set up event listeners
    socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      pushElements(data);
    };

    socket.onerror = (event) => {
      console.error('WebSocket error:', event);
    };

    socket.onclose = () => {
      console.log('Disconnected from WebSocket server.');
      if (reconnectAttempts.current < maxReconnectAttempts.current) {
        console.log('Attempting to reconnect...');
        clearTimeout(reconnectTimer.current);
        reconnectTimer.current = setTimeout(() => {
          reconnectAttempts.current++;
          connectWebSocket();
        }, 3000 * reconnectAttempts.current); // Exponential backoff
      } else {
        console.log('Maximum reconnect attempts reached.');
      }
    };

    setWs(socket);
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
      clearTimeout(reconnectTimer.current);
    }
  }, []);

  useEffect(() => {
    let current_messages = messages;
    current_messages.push(
      { key: messages.length, data: "" },
    );

    // axios.get('http://127.0.0.1:5025/catalogaicopilot/api', {
      axios.get(`https://catalogaicopilot-l5n4jumt5q-ez.a.run.app/catalogaicopilot/api`, {
      headers: {
        'Content-Type': 'application/json',
        'x-transaction-id': transactionId
      }}
    )
    .then(function (response) {
      console.log("response===.", response);
      setMessages((messages) => [ 
        ...current_messages,
        { key: current_messages.length, data: response.data },
      ]);
    });
  }, []);

  useEffect(() => {
    if(!messages.length) return;
    // axios.post(`http://127.0.0.1:5025/catalogaicopilot/get-product`, { question: value, flag: flag }, {
    axios.post(`https://catalogaicopilot-l5n4jumt5q-ez.a.run.app/catalogaicopilot/get-product`, { question: value, flag: flag }, {
      headers: {
        'Content-Type': 'application/json',
        'x-transaction-id': transactionId
      }
    })
    .then(function (response) {
      console.log("response-->", response);
    })
    .catch(function (error) {
      return error;
    });
  }, [value])

  const onChange = (e) => {
    setValue(e.target.value);
    if(e.target.value !== "No list") {
      is_loading = true;
        // setQuestion(e.target.value);
      setMessages((messages) => [
        ...messages,
        { key: messages.length, data: e.target.value },
        { key: messages.length + 1, data: "..." },
      ]);
    }
    setInputStateDisable(false);
  };

  const onChangeBrand = (e) => {
    console.log(e.target.value);
    if (e.target.value !== "No list") {
      is_loading = true;
      setQuestion(e.target.value);
      setMessages((messages) => [
        ...messages,
        { key: messages.length, data: e.target.value },
        { key: messages.length + 1, data: "..." },
      ]);
    } 
    setInputStateDisable(false);
  }

  const pushElements = (data) => {
    console.log("Socket===>", data);

    if (data?.isJSON || data?.isJSON == 0) {
      setQuestion("");
      setMessages((messages) => [
        ...messages.slice(0, -1),
        { key: messages.length + 1, data: "" },
        { key: messages.length + 2  , data: "" },
      ]);
    } else {
      setQuestion("");
      setMessages((messages) => [
        ...messages.slice(0, -1),
      ]);
    }
    if (data?.categorization) {
      console.log("currentProduct", data.currentProduct);
      localStorage.setItem("currentProduct", data.currentProduct);
      let categorize = <><Box textAlign={'center'}><Box as="h3" fontWeight={'bold'} fontSize={'18px'}>Drinks or Foods or Others?</Box><span>{data.categorization}</span></Box></>
      setQuestion("");
      setMessages((messages) => [
        ...messages,
        { key: messages.length + 1, data: categorize },
        { key: messages.length + 2, data: "" },
      ]);
    }
    if (data?.pType) {
      let pType = <><Box textAlign={'center'}><Box as="h3" fontWeight={'bold'} fontSize={'18px'}>Single product or Multi product?</Box><span>{data.pType}</span></Box></>
      setQuestion("");
      setMessages((messages) => [
        ...messages,
        { key: messages.length + 1, data: pType },
        { key: messages.length + 2, data: "" },
        { key: messages.length + 3, data: "..." },
      ]);
    }
    if (data?.formFactor?.factors) {
      let formFactorData = 
        <FormFactor 
          formFactor={data.formFactor.factors}
        />
      setQuestion("");
      setMessages((messages) => [
        ...messages,
        { key: messages.length + 1, data: formFactorData },
        { key: messages.length + 2, data: "" },
        { key: messages.length + 3, data: "..." },
      ]);
    }
    if (data?.suggestedProductTitle) {
      let suggestedData_jsx = 
        <SuggestedData 
          suggestedData={data.suggestedProductTitle}
        />
      setQuestion("");
      setMessages((messages) => [
        ...messages,
        { key: messages.length + 1, data: suggestedData_jsx },
        { key: messages.length + 2, data: "" },
        { key: messages.length + 3, data: "..." },
      ]);
    }
    if (data?.productDetail) {
      let pData_jsx = 
        <ProductDetail 
          pData = {data.productDetail}
        />
        setQuestion("");
        setMessages((messages) => [
        ...messages,
        { key: messages.length + 1, data: pData_jsx },
        { key: messages.length + 2, data: ""},
        { key: messages.length + 3, data: "..." },
      ]);
    }
    if (data?.nextProduct || data?.nextProduct == '') {
      let last_message = `Thank you. The ${localStorage.getItem("currentProduct")} will be added. `;
      console.log("nextProduct", data.nextProduct);
      if (data.nextProduct !== "") {
        setInputStateDisable(true);
        setFlag(1);
        last_message += `What types of ${data.nextProduct} you want to offer? You can select multiple product.`;
        const brandData = data.result.brands;
        let radio_jsx = 
          <RadioCard
            title={`What is the brand and type of ${data.nextProduct}?`}
            onChange={onChangeBrand}
            value={value}
            data={brandData}
          />
        setQuestion("");
        setMessages((messages) => [
          ...messages,
          { key: messages.length + 1, data: last_message},
          { key: messages.length + 2, data: ""},
          { key: messages.length + 3, data: radio_jsx },
          { key: messages.length + 4, data: ""},
        ]);
      } else {
        setFlag(0);
        setQuestion("");
        setMessages((messages) => [
          ...messages,
          { key: messages.length + 1, data: last_message},
          { key: messages.length + 2, data: ""},
        ]);
      }
    }
    is_loading = false;
    console.log("MESSAGES===>", messages);
  } 

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
    console.log("API call");
    if (question === "") return;

    req_qa_box.current.scrollTop = req_qa_box.current.scrollHeight;

    axios.post(`https://catalogaicopilot-l5n4jumt5q-ez.a.run.app/catalogaicopilot/get-product`, { question: question, flag: flag }, {
    // axios.post(`http://127.0.0.1:5025/catalogaicopilot/get-product`, { question: question, flag: flag }, {
      headers: {
        'Content-Type': 'application/json',
        'x-transaction-id': transactionId
      }
    })
    .then(function (response) {
      console.log("response~~~~~~~~~~~", response);
      let current_messages = messages;
      current_messages.pop();

      switch (response.data.isJSON) {
        case 0:
          setMessages((messages) => [
            ...current_messages,
            { key: current_messages.length, data: response.data.result },
          ]);
        break;
        case 1:
          setInputStateDisable(true);
          console.log("response.data................", response.data);
          const brandData = response.data.result.brands;
          let text_jsx = 
            <RadioCard
              title={`What is the brand and types of ${response.data.currentProduct}?`}
              onChange={onChangeBrand}
              value={value}
              data={brandData}
            />
          setMessages((messages) => [
            ...current_messages,
            { key: current_messages.length, data: text_jsx },
          ]);
          break;
        case 2:
          setInputStateDisable(true);
          const typeData = response.data.result.types;
          let radio_jsx = 
            <RadioCard
              title={`What types of ${response.data.currentProduct}?`}
              onChange={onChange}
              value={value}
              data={typeData}
            />
          setMessages((messages) => [
            ...current_messages,
            { key: current_messages.length, data: radio_jsx },
          ]);
          break;
        case 3: 
          break;
        case 4:
          console.log("food response.data---->", response.data);
          const dishName = response.data.dishName;

          const categorize = <><Box textAlign={'center'}><Box as="h3" fontWeight={'bold'} fontSize={'18px'}>Drinks or Foods or Others?</Box><span>{response.data.categorization}</span></Box></>
          let suggestedData_jsx = <SuggestedData suggestedData={response.data.suggestedProductTitle}/>

          let pData_jsx = 
            <ProductDetail 
              pData = {response.data.productDetail}
            />
          current_messages.push(
            { key: current_messages.length, data: ""}
          );
          current_messages.push(
            { key: messages.length + 1, data: categorize },
          );
          current_messages.push(
            { key: current_messages.length + 2, data: ""}
          );
          current_messages.push(
            { key: messages.length + 3, data: suggestedData_jsx },
          );
          current_messages.push(
            { key: current_messages.length + 4, data: ""}
          );
          current_messages.push(
            { key: messages.length + 5, data: pData_jsx },
          );
          current_messages.push(
            { key: current_messages.length + 6, data: ""}
          );

          const last_message = `Thank you. The ${dishName} will be added.`;

          current_messages.push(
            { key: current_messages.length + 7, data: last_message}
          )
          current_messages.push(
            { key: current_messages.length + 8, data: ""}
          );
          setMessages([...current_messages]);
          break;
        default:
          break;
      }
      is_loading = false;
      setQuestion("");
    })
    .catch(function (error) {
      setQuestion("");
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
              disabled={inputStateDisable}
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