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
import { useDispatch } from 'react-redux';
import { Login } from 'features/Reception/ReceptionSlice';
import { useHistory } from 'react-router-dom'; // Import useHistory

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();
  const dispatch = useDispatch();
  const history = useHistory(); // Initialize history

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Dispatch the login action and wait for it to complete
      const resultAction = await dispatch(Login({ email, password }));

      // Check if the login was successful
      if (Login.fulfilled.match(resultAction)) {
        // Redirect to admin dashboard after successful login
        history.push('/admin/dashboard');
        window.location.reload(); // Reloading the page is optional
      } else {
        // If login failed, show an error message
        toast({
          title: "Login failed.",
          description: "Please check your email and password.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "An error occurred.",
        description: "Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
    
  return (
    <Box width="500px" mt="200" mx="auto" padding="5" borderWidth="1px" borderRadius="lg" style={{ backgroundColor: 'white' }}>
      <Heading as="h2" size="lg" textAlign="center" marginBottom="4">
        Login
      </Heading>
      <form onSubmit={handleSubmit}>
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
        <Button type="submit" colorScheme="teal" width="full" marginTop="4">
          Login
        </Button>
      </form>
    </Box>
  );
};

export default LoginForm;
