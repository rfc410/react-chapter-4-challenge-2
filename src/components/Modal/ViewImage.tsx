import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Image,
  Link,
} from '@chakra-ui/react';

interface ModalViewImageProps {
  isOpen: boolean;
  onClose: () => void;
  imgUrl: string;
}

export function ModalViewImage({
  isOpen,
  onClose,
  imgUrl,
}: ModalViewImageProps): JSX.Element {
  return (
    <Modal isOpen={isOpen} size="2xl" onClose={onClose}>
      <ModalOverlay />

      <ModalContent backgroundColor="gray.900">
        <ModalBody display="flex" alignItems="center">
          <Image
            maxHeight="600px"
            maxWidth="900px"
            src={imgUrl}
            width="100%"
          />
        </ModalBody>

        <ModalFooter backgroundColor="gray.500">
          <Link href={imgUrl} target="_blank">Abrir original</Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
