import { Box, useRadio } from "@chakra-ui/react";

export default function RadioCard(props) {
	const { getInputProps, getRadioProps } = useRadio(props);

	const input = getInputProps()
  const checkbox = getRadioProps()

  return (
    <Box as='label'>
      <input {...input} />
      <Box
        {...checkbox}
        cursor='pointer'
        borderWidth='1px'
        borderRadius='md'
        boxShadow='md'
				display={'flex'}
				flexDirection={'column'}
				alignItems={'flex-start'}
        _checked={{
          bg: 'teal.600',
          color: 'white',
          borderColor: 'teal.600',
        }}
        _focus={{
          bg: 'teal.600',
          color: 'white',
          borderColor: 'teal.600',
        }}
        px={5}
        py={3}
      >
        {props.children}
      </Box>
    </Box>
  )
}