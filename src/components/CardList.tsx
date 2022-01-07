import { Box, SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { Card as CardComponent } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  // TODO MODAL USEDISCLOSURE
  const { isOpen, onClose, onOpen } = useDisclosure()

  // TODO SELECTED IMAGE URL STATE
  const [selectedImage, setSelectedImage] = useState('')

  // TODO FUNCTION HANDLE VIEW IMAGE

  return (
    <Box marginBottom="16px">
      <SimpleGrid columns={3} spacing="40px">
        {cards.map((card) => (
          <CardComponent
            data={card}
            key={card.id}
            viewImage={(url) => {
              setSelectedImage(url)
              onOpen()
            }}
          />
        ))}
      </SimpleGrid>

      <ModalViewImage
        imgUrl={selectedImage}
        isOpen={isOpen}
        onClose={onClose}
      />
    </Box>
  );
}
