import { Text, Flex, Box, Spacer } from "@chakra-ui/react";
import { Card } from "@chakra-ui/react";
import { Input, IconButton } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { ChatIcon } from "@chakra-ui/icons";

import { Radio, Space, message } from 'antd';

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
  const [message, setMessage] = useState("");

  const [value, setValue] = useState("");
  const [disable, setDisable] = useState(false);
  const [data, setData] = useState([]);

  const onChange = (e) => {
    setValue(e.target.value);
    setDisable(true);
  };

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
    console.log(">>>>>>>>>>>", messages);
    // axios.post(`http://127.0.0.1:5025/catalogaicopilot/get-product`, { question: value })
    axios.post(`https://catalogaicopilot-l5n4jumt5q-ez.a.run.app/catalogaicopilot/get-product`, { question: value })
      .then(function (response) {
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
        // let current_messages;
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
        let current_messages = [
          ...messages.slice(0, -1),
          { key: messages.length - 1, data: radio_jsx },
          { key: messages.length, data: value }
        ];
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
        console.log("1>>>", current_messages);
        setMessages([...current_messages]);
        if (response.data.nextProduct) {
          current_messages.push(
            { key: current_messages.length, data: response.data.nextProduct },
          );
          setMessages([...current_messages]);
          axios.post(`https://catalogaicopilot-l5n4jumt5q-ez.a.run.app/catalogaicopilot/get-product`, { flag: 1 }).then((res) => {
          // axios.post(`http://127.0.0.1:5025/catalogaicopilot/get-product`, { question: response.data.nextProduct, flag: 1 }).then((res) => {
            const data = res.data.result.types;
            setData(data);
            let radio_jsx = 
            <>
              <Box textAlign={"center"}><Box as="b" fontWeight={"bold"} fontSize={"18px"}>What is the brand and types of {response.data.nextProduct}?</Box></Box>
              <Radio.Group defaultValue="a" buttonStyle="solid" onChange={onChange} value={value}>
                <Space direction="vertical">
                  {data.map((value) => {
                    return <Radio.Button value={value}>{value}</Radio.Button>
                  })}
                </Space>
              </Radio.Group>
            </>
            current_messages.push({ key: current_messages.length, data: radio_jsx });
            setMessages([...current_messages]);
          })
        }
        is_loading = false;
        setQuestion("");
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

  useEffect(() => {
    if (question === "") return;

    req_qa_box.current.scrollTop = req_qa_box.current.scrollHeight;

    axios.post(`https://catalogaicopilot-l5n4jumt5q-ez.a.run.app/catalogaicopilot/get-product`, { question })
    // axios.post(`http://127.0.0.1:5025/catalogaicopilot/get-product`, { question })
      .then(function (response) {
        setMessage(response.data.currentProduct);
        console.log("response~~~~~~~~~~~", response);
        let current_messages = messages;
        current_messages.pop();
        switch (response.data.isJSON) {
          // case 0:
          //   setMessages((messages) => [
          //         ...current_messages,
          //         { key: current_messages.length, data: response.data.result },
          //       ]);
          //   break;
          case 1:
            console.log("response.data....................", response.data);
            const data = response.data.result.types;
            setData(data);
            let radio_jsx = 
            <>
              <Box textAlign={"center"}><Box as="b" fontWeight={"bold"} fontSize={"18px"}>What is the brand and types of {response.data.currentProduct}?</Box></Box>
              <Radio.Group defaultValue="a" buttonStyle="solid" onChange={onChange} value={value}>
                <Space direction="vertical">
                  {data.map((value) => {
                    return <Radio.Button value={value}>{value}</Radio.Button>
                  })}
                </Space>
              </Radio.Group>
            </>
            setMessages((messages) => [
              ...current_messages,
              { key: current_messages.length, data: radio_jsx },
            ]);
            break;
        
          default:
            break;
        }

        // if( response.data.isJSON ){
        //   setMessages((messages) => [
        //     ...current_messages,
        //     { key: current_messages.length, data: response.data.result },
        //   ]);
        // } else {
        //   let response_data = JSON.parse(response.data.result);
        //   let data = [];
        //   Object.keys(response_data).map(item =>  data.push({ key: item, data: response_data[item] }))
        //   let response_jsx = <>{data.map((item, index) => item.key !== 'image' ? (<p key={index}><b style={{ textTransform: 'uppercase' }}>{item.key}: </b><span>{item.data}</span></p>): (<p key={index}><b style={{ textTransform: 'uppercase' }}>{item.key}: </b><div>{item.data.join("$")}</div></p>) )}</>
        //   setMessages((messages) => [
        //     ...current_messages,
        //     { key: current_messages.length, data: response_jsx  },
        //   ]);
        // }      
        
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