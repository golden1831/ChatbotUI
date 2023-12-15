import { Text, Flex, Box, Spacer } from "@chakra-ui/react";
import { Card } from "@chakra-ui/react";
import { Input, IconButton } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { ChatIcon } from "@chakra-ui/icons";

import { Button, Radio, Space, message } from 'antd';

import EmbedModal from "../../components/EmbedModal";
import Message from "../../components/Message";

import "./Home.css";

import axios from "axios";

import { useEffect, useRef, useState } from "react";
import { eventWrapper } from "@testing-library/user-event/dist/utils";

let is_loading = false;

export default function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [flag, setFlag] = useState(0);

  const [value, setValue] = useState("");
  const [disable, setDisable] = useState(false);
  const [data, setData] = useState([]);

  const onChange = (e) => {
    setValue(e.target.value);
    setDisable(true);
  };

  const generateProductElements = (radio_jsx, response, flag) => {

    const categorize = <><Box textAlign={'center'}><Box as="h3" fontWeight={'bold'} fontSize={'18px'}>Drinks or Foods or Others?</Box><span>{response.data.categorization}</span></Box></>
    const pType = <><Box textAlign={'center'}><Box as="h3" fontWeight={'bold'} fontSize={'18px'}>Sinlge product or Multi product?</Box><span>{ response.data.pType}</span></Box></>
    const formFactor = response.data.formFactor;
    const formFactorData = <><Box textAlign={"center"}><Box as="b" fontWeight={"bold"} fontSize={"18px"}>Form Foctors about product</Box><table className="chat_table">
      <thead>
        <tr>
          <th>Type</th>
          <th>Unit</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Beer Glass</td>
          <td>{formFactor.BeerGlass}</td>
        </tr>
        <tr>
        <td>Wine Glass</td>
          <td>{formFactor.WineGlass}</td>
        </tr>
        <tr>
        <td>Paper Cup</td>
          <td>{formFactor.PaperCup}</td>
        </tr>
      </tbody>
    </table></Box></>
    let suggestedData = response.data.suggestedProductTitle;
    let suggestedData_jsx = <><Box textAlign={"center"}><Box as="b" fontWeight={"bold"} fontSize={"18px"}>Suggested Product Title Based on the location</Box><table className="chat_table">
    <thead>
      <tr>
        <th>Type</th>
        <th>Title</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Local Name</td>
        <td>{suggestedData.localname}</td>
      </tr>
      <tr>
      <td>International Recognized Brand</td>
        <td>{suggestedData.internationalrecognizedbrand}</td>
      </tr>
      <tr>
      <td>Colloquial/Popular terms</td>
        <td>{suggestedData.colloquial}</td>
      </tr>
      <tr>
      <td>Additional Relevant Name</td>
      <td>{suggestedData.additionalrelevantnames}</td>
      </tr>
    </tbody>
    </table></Box></>

    let pData = response.data.productDetail;
    let data = [];
    Object.keys(pData).map(item =>  data.push({ key: item, data: pData[item] }))
    let pData_jsx = <><Box textAlign={"center"}><Box as="b" fontWeight={"bold"} fontSize={"18px"}>Product Details</Box>{data.map((item, index) => item.key !== 'image' ? (<p key={index}><b style={{ textTransform: 'uppercase' }}>{item.key}: </b><span>{item.data}</span></p>): (<Box display={'flex'} flexDirection={'column'} gap={'10px'} justifyContent={'center'} alignItems={'center'}>{item?.data?.map((item) => <img src={item} alt="" width={'100px'} height={'100px'} />)}</Box>) )}</Box></>
    let current_messages = messages;
    if(flag === 1) {
      current_messages = [
        ...messages.slice(0, -1),
        { key: messages.length - 1, data: radio_jsx },
        { key: messages.length, data: value }
      ];
    } else {
      current_messages.push(
        { key: current_messages.length, data: ""}
      );
    }
    current_messages.push(
      { key: messages.length + 1, data: categorize },
    );
    current_messages.push(
      { key: messages.length + 2, data: "" },
    );
    current_messages.push(
      { key: messages.length + 3, data: pType },
    );
    current_messages.push(
      { key: messages.length + 4, data: "" },
    );
    current_messages.push(
      { key: messages.length + 5, data: formFactorData },
    );
    current_messages.push(
      { key: messages.length + 6, data: "" },
    );
    current_messages.push(
      { key: messages.length + 7, data: suggestedData_jsx },
    );
    current_messages.push(
      { key: messages.length + 8, data: "" },
    );
    current_messages.push(
      { key: messages.length + 9, data: pData_jsx },
    );
    current_messages.push(
      { key: messages.length + 10, data: ""}
    );
    setMessages([...current_messages]);

    if (flag === 0) {
      current_messages.push(
        { key: current_messages.length, data: ""}
      );
    }
    
    let last_message = `Thank you. The ${response.data.currentProduct} will be added.`;
    if (response.data.nextProduct) {
      setFlag(1);
      last_message += `What types of ${response.data.nextProduct} you want to offer? You can select multiple product.`;
        let radio_jsx = 
        <>
          <Box textAlign={"center"}><Box as="b" fontWeight={"bold"} fontSize={"18px"}>What is the brand and type of {response.data.nextProduct}?</Box></Box>
        </>
        current_messages.push(
          { key: current_messages.length, data: last_message}
        )
        current_messages.push(
          { key: current_messages.length, data: ""}
        );
        current_messages.push({ key: current_messages.length, data: radio_jsx });
        setMessages([...current_messages]);
    } else {
      setFlag(0)
      current_messages.push(
        { key: current_messages.length, data: last_message}
      )
      setMessages([...current_messages]);
    }
    is_loading = false;
    setQuestion("");
  }

  useEffect(() => {
    let current_messages = messages;
    current_messages.push(
      { key: messages.length, data: "" },
    );
    // axios.get(`http://127.0.0.1:5025/catalogaicopilot/api`).then(function (response) {
      axios.post(`https://catalogaicopilot-l5n4jumt5q-ez.a.run.app/catalogaicopilot/api`).then(function (response) {
      console.log("response===.", response);
      setMessages((messages) => [
        ...current_messages,
        { key: current_messages.length, data: response.data },
      ]);
    })
  }, []);

  useEffect(() => {
    if(!messages.length) return;
  
    let radio_jsx = 
      <>
        <Box textAlign={"center"}><Box as="b" fontWeight={"bold"} fontSize={"18px"}>What is the brand and types of {message}?</Box></Box>
        <Radio.Group defaultValue="a" buttonStyle="solid" onChange={onChange} value={value}>
          <Space direction="vertical">
            {data.map((value) => {
              return <Radio.Button value={value}>{value}</Radio.Button>
            })}
          </Space>
        </Radio.Group>
      </>

    // axios.post(`http://127.0.0.1:5025/catalogaicopilot/get-product`, { question: value, flag: flag })
    axios.post(`https://catalogaicopilot-l5n4jumt5q-ez.a.run.app/catalogaicopilot/get-product`, { question: value, flag: flag })
      .then(function (response) {
        console.log("here~~", response);
        generateProductElements(radio_jsx, response, 1);
      })
      .catch(function (error) {
        return error;
      });
  }, [value])

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

  const getMore = (button) => {
    console.log(button);
    if (button && button.previousElementSibling) {
      // Get the previous sibling of the button, which is the container with the ant-space class
      var spaceDiv = button.previousElementSibling;
      console.log(spaceDiv);
      // Get all the ant-space-item elements within the container
      var items = spaceDiv.querySelectorAll('.ant-space-item');
  
      // Make sure items were found
      if (items.length) {
        // Calculate the index to start hiding/showing from
        var halfIndex = Math.ceil(items.length / 2);
  
        // Loop through the last half of the items
        for (var i = halfIndex; i < items.length; i++) {
          // Toggle the display style
          items[i].style.display = items[i].style.display === 'none' ? '' : 'none';
        }
      }
    }
  }

  useEffect(() => {
    if (question === "") return;

    req_qa_box.current.scrollTop = req_qa_box.current.scrollHeight;

    axios.post(`https://catalogaicopilot-l5n4jumt5q-ez.a.run.app/catalogaicopilot/get-product`, { question: question, flag: flag })
    // axios.post(`http://127.0.0.1:5025/catalogaicopilot/get-product`, { question: question, flag: flag })
      .then(function (response) {
        setMessage(response.data.currentProduct);
        console.log("response~~~~~~~~~~~", response);
        let current_messages = messages;
        current_messages.pop();
        switch (response.data.isJSON) {
          case 1:
            let text_jsx = 
              <Box textAlign={"center"}><Box as="b" fontWeight={"bold"} fontSize={"18px"}>What is the brand and types of {response.data.currentProduct}?</Box></Box>
            setMessages((messages) => [
              ...current_messages,
              { key: current_messages.length, data: text_jsx },
            ]);
            break;
          case 2:
            console.log("response.data....................", response.data);
            const data = response.data.result.types;
            setData(data);

            let radio_jsx = 
            <>
              <Box textAlign={"center"}><Box as="b" fontWeight={"bold"} fontSize={"18px"}>What types of {response.data.currentProduct}?</Box></Box>
              <Radio.Group defaultValue="a" buttonStyle="solid" onChange={onChange} value={value}>
                <Space direction="vertical">
                  {data.map((value) => {
                    return <Radio.Button value={value}>{value}</Radio.Button>
                  })}
                </Space>
              </Radio.Group>
              <Button className="more_btn" onClick={() => getMore(this)} type="dashed" danger style={{ display: 'block', marginTop: '10px' }}>+ more</Button>
            </>
            setMessages((messages) => [
              ...current_messages,
              { key: current_messages.length, data: radio_jsx },
            ]);
            break;
          case 3: 
            generateProductElements(<></>, response, 0);
            break;
          default:
            break;
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