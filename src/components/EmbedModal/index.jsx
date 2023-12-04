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
  Select,
} from "@chakra-ui/react";

import { useDisclosure } from "@chakra-ui/react";

import SetDomainModal from "../SetDomainModal";

export default function EmbedModal(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onSaveChanges = () => {
    props.onClose();
    onOpen();
  };

  return (
    <>
      <Modal onClose={props.onClose} isOpen={props.isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change chatbot visibility</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text as="b">Visibility</Text>
            <Select size="md">
              <option value="private">
                Private but can be embedded on website
              </option>
              <option value="public">Public</option>
            </Select>
            <Text color={"rgb(120, 120, 120)"}>
              'Private but can be embedded on website' means other people can't
              access your chatbot if they have the link, but visitors on your
              website can access it. Save changes{" "}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={props.onClose}
              marginRight={"10px"}
              colorScheme="gray"
            >
              Cancel
            </Button>
            <Button onClick={onSaveChanges} colorScheme="messenger">
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <SetDomainModal
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
      ></SetDomainModal>
    </>
  );
}
