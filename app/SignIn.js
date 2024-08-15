'use client';

import { useState } from 'react';
import { Button, TextField, Box, Typography } from '@mui/material';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Signed in:', userCredential.user);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Signed up:', userCredential.user);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Google sign-in successful:', result.user);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSubmit = async () => {
    if (isSignUp) {
      await handleSignUp();
    } else {
      await handleSignIn();
    }
  };

  return (
    <Box
      width="100%"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      alignItems="center"
      sx={{ minHeight: '100vh', paddingBottom: '20px' }} // Adjust minHeight and padding
      id="background"
    >
      <h1 id="heading">WELCOME TO PAWTOPIA AI SUPPORT</h1>
      <p>&quot;Bringing Veterinary Care to Your Fingertips&quot;</p> {/* Escaped quotes */}
      <Typography variant="h4" style={{ color: 'black', fontSize: "1.5rem", fontFamily: 'Times New Roman', fontWeight: '900' }} gutterBottom>
        {isSignUp ? 'Sign Up' : 'Sign In'}
      </Typography>
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ backgroundColor: '#FAF9F6', color: 'black', width: 400 }}
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        margin="normal"
        sx={{ backgroundColor: '#FAF9F6', color: 'black', width: 400 }}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{
          backgroundColor: "#008080",
          color: 'white',
        }}
      >
        {isSignUp ? 'Sign Up' : 'Sign In'}
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleGoogleSignIn}
        sx={{ marginTop: 2, backgroundColor: '#008080', color: 'white' }}
      >
        Sign In with Google
      </Button>

      <Button
        variant="text"
        color="secondary"
        onClick={() => setIsSignUp(!isSignUp)}
        sx={{ marginTop: 2, color: '#008080' }}
      >
        {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
      </Button>
    </Box>
  );
}
