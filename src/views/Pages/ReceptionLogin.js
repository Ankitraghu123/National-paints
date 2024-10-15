import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

   
      toast({
        title: "Login successful.",
        description: "Welcome back!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Since the action is set to /admin/dashboard, navigate there
      window.location.href = '/admin/dashboard'; // Redirect using window.location
   
  };

  return (
    <Box width="500px"  mt="200" mx="auto" padding="5" borderWidth="1px" borderRadius="lg" style={{backgroundColor:'white'}}>
      <Heading as="h2" size="lg" textAlign="center" marginBottom="4">
        Login
      </Heading>
      <form onSubmit={handleSubmit} action="/admin/dashboard" method="POST">
        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </FormControl>
        <FormControl isRequired marginTop="4">
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </FormControl>
        <Button
          type="submit"
          colorScheme="teal"
          width="full"
          marginTop="4"
        >
          Login
        </Button>
      </form>
    </Box>
  );
};

export default LoginForm;
