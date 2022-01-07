import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  closeModal: () => void;
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const formValidations = {
    image: {
      required: 'Arquivo obrigatório',
      validate: {
        acceptedFormats: (fileList) => {
          const ACCEPTED_FORMATS = ['image/gif', 'image/jpeg', 'image/png']
          const [image] = fileList
          return (
            ACCEPTED_FORMATS.includes(image.type) ||
            'Somente são aceitos arquivos PNG, JPEG e GIF'
          )
        },
        lessThan10MB: (fileList) => {
          const TEN_MEGABYTES = 10 * 1024 * 1024
          const [image] = fileList
          return (
            image.size < TEN_MEGABYTES || 'O arquivo deve ser menor que 10MB'
          )
        }
      }
    },
    title: {
      maxLength: {
        message: 'Máximo de 20 caracteres',
        value: 20
      },
      minLength: {
        message: 'Mínimo de 2 caracteres',
        value: 2
      },
      required: 'Título obrigatório'
    },
    description: {
      maxLength: {
        message: 'Máximo de 65 caracteres',
        value: 65
      },
      required: 'Descrição obrigatória'
    },
  };

  const queryClient = useQueryClient();
  const mutation = useMutation(
    async (imageData) => {
      await api.post('api/images', imageData)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('images')
      }
    }
  );

  const {
    register,
    handleSubmit,
    reset,
    formState,
    setError,
    trigger,
  } = useForm();
  const { errors } = formState;

  const onSubmit = async (data): Promise<void> => {
    try {
      if (!imageUrl) {
        toast({
          title: 'Imagem não adicionada',
          description: 'É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
        return
      }

      const { description, title } = data
      const payload = { description, title, url: imageUrl }
      // @ts-ignore
      await mutation.mutateAsync(payload)

      toast({
        title: 'Imagem cadastrada',
        description: 'Sua imagem foi cadastrada com sucesso.',
        status: 'success',
        duration: 9000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Falha no cadastro',
        description: 'Ocorreu um erro ao tentar cadastrar a sua imagem.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    } finally {
      // TODO CLEAN FORM, STATES AND CLOSE MODAL
      closeModal()
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          error={errors.image}
          localImageUrl={localImageUrl}
          name="image"
          setError={setError}
          setImageUrl={setImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          trigger={trigger}
          {...register('image', formValidations.image)}
        />

        <TextInput
          error={errors.title}
          placeholder="Título da imagem..."
          name="title"
          {...register('title', formValidations.title)}
        />

        <TextInput
          error={errors.description}
          placeholder="Descrição da imagem..."
          name="description"
          {...register('description', formValidations.description)}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
