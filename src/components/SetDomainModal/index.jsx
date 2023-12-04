import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  Button,
  Input,
} from "@chakra-ui/react";

import { useDisclosure } from "@chakra-ui/react";

import ResultModal from "../ResultModal";

export default function SetDomainModal(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onSetDomains = () => {
    props.onClose();
    onOpen();
  };

  return (
    <>
      <Modal onClose={props.onClose} isOpen={props.isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Set your domains</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text color={"rgb(120, 120, 120)"}>
              Enter domains seperated by commas
            </Text>
            <Input size="md" placeholder="domain1.com,domain2.com" />
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={props.onClose}
              marginRight={"10px"}
              colorScheme="gray"
            >
              Cancel
            </Button>
            <Button onClick={onSetDomains} colorScheme="messenger">
              Set domains
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <ResultModal
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
      ></ResultModal>
    </>
  );
}
