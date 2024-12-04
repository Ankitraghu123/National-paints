import React, { useState } from 'react';
import { Box, Input, Button, FormControl, FormLabel, Heading, useToast } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { AccountantRegister } from 'features/Reception/ReceptionSlice';

const AddAccountant = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const toast = useToast(); // Chakra UI Toast hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accountantData = {
      name,
      email,
      mobileNumber,
      password,
    };

    try {
      // Dispatch the action
      await dispatch(AccountantRegister(accountantData));

      // Show success message if the registration is successful
      toast({
        title: "Accountant registered.",
        description: "The reception has been successfully registered.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      // Show error message if registration fails
      toast({
        title: "Error occurred.",
        description: "There was an error registering the reception.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={5} bg="gray.100" borderRadius="md" w="100%" maxW="500px" mx="auto" mt={20}>
      <Heading as="h2" size="lg" mb={6}>
        Add Accountant
      </Heading>
      <form onSubmit={handleSubmit}>
        {/* Name Field */}
        <FormControl id="name" mb={4}>
          <FormLabel>Name</FormLabel>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </FormControl>

        {/* Email Field */}
        <FormControl id="email" mb={4}>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </FormControl>

        {/* Mobile Number Field */}
        <FormControl id="mobileNumber" mb={4}>
          <FormLabel>Mobile Number</FormLabel>
          <Input
            type="tel"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            placeholder="Enter your mobile number"
            required
          />
        </FormControl>

        {/* Password Field */}
        <FormControl id="password" mb={6}>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </FormControl>

        <Button type="submit" colorScheme="teal" width="full">
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default AddAccountant;
