import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  Code,
} from "@chakra-ui/react";

import { Wrap } from "@chakra-ui/react";

export default function ResultModal(props) {
  return (
    <>
      <Modal onClose={props.onClose} isOpen={props.isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Embed on website</ModalHeader>
          <ModalCloseButton />
          <ModalBody overflow={"hidden"} paddingBottom={"20px"}>
            <Wrap>
              <Text
                color={"rgb(120, 120, 120)"}
                marginBottom={"10px"}
                overflow={"auto"}
              >
                To add the chatbot any where on your website, add this iframe to
                your html code
              </Text>
            </Wrap>
            <Code
              children='<iframe src="http://chatbot.dtonomy.com/chatbot-iframe" width="100%" height="700" frameborder="0"></iframe>'
              marginBottom={"16px"}
            />

            <Text color={"rgb(120, 120, 120)"} marginBottom={"10px"}>
              To add a chat bubble to the bottom right of your website add this
              script tag to your html
            </Text>
            <Wrap>
              <Code
                children='<script src="http://chatbot.dtonomy.com/chatbot-dialog.min.js"></script>'
                overflow={"auto"}
              />
            </Wrap>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
