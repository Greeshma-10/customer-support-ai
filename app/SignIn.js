'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from './firebase';
import { Button, TextField, Box, Typography, Stack } from '@mui/material';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false); // Track if the user is signing up or signing in
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      setError('');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      setError('');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <Box p={3}>
      {user ? (
        <>
          <Typography variant="h6">Welcome, {user.email}</Typography>
          <Button variant="contained" onClick={handleSignOut}>
            Sign Out
          </Button>
        </>
      ) : (
        <Stack spacing={2}>
          <Typography variant="h5">{isSignUp ? 'Sign Up' : 'Sign In'}</Typography>
          <TextField
            label="Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button variant="contained" onClick={isSignUp ? handleSignUp : handleSignIn}>
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </Button>
          <Button onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? 'Already have an account? Sign In' : 'Don’t have an account? Sign Up'}
          </Button>
          {error && <Typography color="error">{error}</Typography>}
        </Stack>
      )}
    </Box>
  );
}
