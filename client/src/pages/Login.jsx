import React,  {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import { auth } from '../firebaseConfig'; 
import { signInWithEmailAndPassword } from 'firebase/auth';


import {
  Box,
  Heading,
  Input,
  Button,
  Select,
  VStack,
  useColorModeValue,
  Flex,
  Center,
  AbsoluteCenter,
} from '@chakra-ui/react';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log('Login successful', userCredential.user);
        
            // Send user ID token to your backend for verification and role check
            const idToken = await userCredential.user.getIdToken();
            console.log('idToken', idToken);

            const response = await fetch('http://localhost:8080/api/verifyToken ', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ idToken, role }),
            });
            console.log(idToken, role)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.success) {
                console.log('Login successful', data.user);
                navigate('/dashboard');
              } else {
                console.error(data.message);
              }
        } 
        catch (error) 
        {
          console.error('Login request failed:', error);
        }
    };

  return (
    <Flex
      align="center"
      justify="center"
      mt={20}
    >
        <Box bg={useColorModeValue('brand.100', 'brand.700')}
        p={8}
        w={['50%', '30%']} // Responsive width
        mx="auto">
        <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="flex-start">
                <Heading as="h1" size="xl" textAlign="center" mb={5}>
                    Log In To SFU Events
                </Heading>
                <Heading as="h2" size="md" >
                    Email
                </Heading>
                <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Heading as="h2" size="md" >
                    Password
                </Heading>
                <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>

                <Heading as="h2" size="md" mt={10}>
                    Authorization
                </Heading>
                <Select placeholder="Log in As" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="admin">Admin</option>
                <option value="student">Student</option>
                </Select>

                <Button colorScheme='red' size="lg" width="full" type="submit">
                    Log In
                </Button>
            </VStack>
        </form>
        </Box>
    </Flex>
  );
}


export default LoginPage;