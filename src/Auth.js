import React, { useState, useEffect, useCallback } from 'react';
import { ChakraProvider, theme } from '@chakra-ui/react';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Button,
  useDisclosure,
  Text,
  Box,
  Textarea,
  Heading,
  Center,
  Image,
  useColorMode,
  HStack,
} from '@chakra-ui/react';
import { Formik, Form, Field } from 'formik';
import { getIdentityFromPass } from './identity';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import logo from './logo.svg';
import Passphrase from './mnemonic';
import athene from './athene.svg';
import getRandomValues from 'get-random-values';

import basex from 'base-x';

var BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
let b58 = basex(BASE58);

const randomPassGen = async () => {
  const entropy = getRandomValues(new Uint8Array(32));
  return await passFromEntropy(entropy);
};

const passFromEntropy = async entropy => {
  const password = b58.encode(entropy);
  let mnemonic = await Passphrase.encode(entropy);
  return { password, mnemonic };
};

function LostPass({ setRegister }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = React.useRef();

  const recover = async () => {
    let text = initialRef.current.value;
    let entropy = await Passphrase.decode(text);
    let obj = await passFromEntropy(entropy);
    obj.recover = true;
    setRegister(obj);
  };

  return (
    <>
      <Button
        size="xs"
        colorScheme={'blue'}
        variant="link"
        onClick={e => {
          e.preventDefault();
          onOpen();
        }}
      >
        Lost password?
      </Button>

      <Modal
        initialFocusRef={initialRef}
        isOpen={isOpen}
        onClose={onClose}
        size="full"
      >
        <ModalOverlay bg="blackAlpha.900" />
        <ModalContent>
          <ModalHeader>Enter backup phrase</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Textarea
                ref={initialRef}
                placeholder="rabbit balloon house..."
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose} mr={2}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={() => recover()}>
              Next
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export const Auth = ({ returnKeys }) => {
  const [register, setRegister] = useState(false);

  return (
    <ChakraProvider theme={theme}>
      <Center>
        <Image src={logo} w={'100px'} mt={'60px'} />
      </Center>
      <AuthInner
        setKey={pass => {
          let identity = getIdentityFromPass(pass);
          let key = JSON.stringify(identity.toJSON());

          returnKeys(key);
        }}
        key={register ? 'reg' : 'login'}
        // onClose={onClose}
        setRegister={setRegister}
        register={register}
      />
      <HStack
        textAlign="right"
        mt={5}
        fontSize="10px"
        sx={{ position: 'fixed', bottom: '17px', right: '14px' }}
      >
        <Text color="gray.500" sx={{ textTransform: 'uppercase' }}>
          Athena
          <br />
          Protocol
        </Text>
        <Image w="32px" h="32px" src={athene} />
      </HStack>
      <Image
        sx={{
          position: 'fixed',
          bottom: '-30px',
          right: '-0px',
          opacity: 0.04,
          zIndex: '-1',
        }}
        w="725px"
        h="725px"
        src={athene}
      />
    </ChakraProvider>
  );
};

// Not supported by browsers yet
//
// const storePass = async ({ password, id }) => {
//   if (window.PasswordCredential) {
//     let cred = new window.PasswordCredential({
//       id,
//       password,
//       // name,
//       // iconURL,
//     });
//     console.log('SAVED', { id, password }, cred);

//     var c = await navigator.credentials.create(cred);
//     console.log('PSTORED', c);
//   }
// };

export const AuthInner = ({ onClose, setRegister, setKey, register }) => {
  const { colorMode, toggleColorMode } = useColorMode();

  function validateName(value) {
    let error;
    if (!value) {
      error = 'Name is required';
    } else if (value.length < 4) {
      error = 'Has to be at least 4 characters';
    }
    return error;
  }
  function validatePass(value) {
    let error;
    if (!value || value.length < 15) {
      error = 'Pass has to be 15 characters';
    }
    return error;
  }

  return (
    <Formik
      //   enableReinitialize={true}
      initialValues={
        register
          ? { password: register.password, id: '' }
          : { id: '', password: '' }
      }
      onSubmit={(values, actions) => {
        setTimeout(() => {
          actions.setSubmitting(false);
          if (register) {
            // storePass(values); // Not working yet

            window.history.replaceState({}, '', '/'); // this will help password managers figure they should save the pass https://web.dev/sign-in-form-best-practices/

            setRegister(false);
          } else {
            setKey(values.password);
          }
        }, 500);
      }}
    >
      {props => (
        <Form autoComplete={register ? 'off' : ''}>
          <Box p={5} maxW={'400px'} ml="auto" mr="auto">
            <Heading size="md">
              {register ? 'Create new account' : 'Log In'}
            </Heading>

            <Box>
              <Field name="id" validate={validateName}>
                {({ field, form }) => (
                  <FormControl isInvalid={form.errors.id && form.touched.id}>
                    <FormLabel mt={2}>Username</FormLabel>
                    <Input
                      {...field}
                      placeholder="username"
                      autoComplete={register ? 'off' : 'username'}
                    />
                    <FormErrorMessage>{form.errors.id}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="password" validate={validatePass}>
                {({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors.password && form.touched.password}
                  >
                    <FormLabel mt={2}>Password</FormLabel>
                    <Input
                      {...field}
                      type={register ? 'password' : 'password'}
                      placeholder="password"
                      readOnly={register ? true : false}
                      disabled={register ? true : false}
                      autoComplete={
                        register ? 'new-password' : 'current-password'
                      }
                    />
                    <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              {!register ? <LostPass setRegister={setRegister} /> : null}

              {register ? (
                <>
                  <Box
                    mt={-1}
                    pl={4}
                    pr={4}
                    pb={4}
                    pt={2}
                    borderRadius={'4px'}
                    borderRight={'1px'}
                    borderLeft={'1px'}
                    borderBottom={'1px'}
                    borderColor={colorMode === 'dark' ? 'gray.700' : 'gray.200'}
                  >
                    {register.mnemonic}
                  </Box>
                </>
              ) : null}
            </Box>

            <Box mt={3}>
              {register ? (
                <>
                  {!register.recover ? (
                    <Button
                      colorScheme="gray"
                      mr="4"
                      onClick={e => {
                        e.preventDefault();
                        setRegister(false);
                      }}
                    >
                      Already registered?
                    </Button>
                  ) : null}

                  <Button
                    colorScheme="blue"
                    isLoading={props.isSubmitting}
                    type="submit"
                  >
                    {register.recover ? 'Recover' : 'Register'}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    mr="4"
                    colorScheme="green"
                    onClick={e => {
                      e.preventDefault();
                      randomPassGen().then(x => setRegister(x));
                    }}
                  >
                    Create new account
                  </Button>
                  <Button
                    colorScheme="blue"
                    isLoading={props.isSubmitting}
                    type="submit"
                  >
                    Log In
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
};
