import { Card, CardBody, Flex, Spacer, Wrap } from "@chakra-ui/react";
import TypeWriter from "../TypeWriter";
import BouncingDotsLoader from "../BouncingDotsLoader";

export default function Message(props) {
  return (
    <Flex width={"100%"}>
      {props.me === true ? <Spacer /> : null}
      <Card
        marginBottom={"7px"}
        bg={props.me === true ? "rgb(0, 114, 239)" : "rgb(245, 245, 247)"}
        color={props.me === true ? "rgb(255, 255, 255)" : "rgb(46, 47, 48)"}
        borderRadius={
          props.me === true ? "25px 25px 0px 25px" : "25px 25px 25px 0px"
        }
        maxWidth={"90%"}
      >
        <CardBody padding={"10px"}>
          {props.wait === true ? (
            <BouncingDotsLoader />
          ) : (
            <Wrap>
              <div>{props.message}</div>
            </Wrap>
          )}
        </CardBody>
      </Card>
      {props.me === true ? null : <Spacer />}
    </Flex>
  );
}
