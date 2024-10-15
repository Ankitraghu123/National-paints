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
    dispatch(Login({ email, password }));

    setTimeout(() => {
      toast({
        title: 'Login successful.',
        description: 'Welcome back!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Redirect to admin dashboard after successful login
      history.push('/admin/dashboard'); // Use history to navigate
    }, 1000);
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
