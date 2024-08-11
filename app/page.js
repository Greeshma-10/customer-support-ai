'use client';
'use client';

import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useState, useRef, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import SignIn from './SignIn';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm the Headstarter support assistant. How can I help you today?",
    },
  ]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [user, setUser] = useState(null);
  const [context, setContext] = useState('');

  const maxMessages = 5; // Define the maximum number of messages to keep as context

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleContextCommand = (input) => {
    const contextCommand = input.match(/^\/set context: (.+)$/i);
    if (contextCommand) {
      setContext(contextCommand[1]);
      return true;
    }
    return false;
  };

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;
    setIsLoading(true);

    if (handleContextCommand(message)) {
      setMessages((messages) => [
        ...messages,
        { role: 'system', content: `Context set to: "${context}"` },
      ]);
      setMessage('');
      setIsLoading(false);
      return;
    }

    const contextMessages = messages.slice(-maxMessages); // Keep only the last `maxMessages` as context

    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ]);
    setMessage('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          context: contextMessages.map((msg) => msg.content).join('\n'),
          userContext: context,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setMessages((messages) => {
        let lastMessage = messages[messages.length - 1];
        let otherMessages = messages.slice(0, messages.length - 1);
        return [
          ...otherMessages,
          { ...lastMessage, content: data.message },
        ];
      });
    } catch (error) {
      console.error('Error:', error);
      setMessages((messages) => [
        ...messages,
        {
          role: 'assistant',
          content:
            "I'm sorry, but I encountered an error. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Create a custom theme
  const theme = createTheme({
    palette: {
      background: {
        default: '#474154', // Background color for the entire site
      },
      text: {
        primary: '#333', // Primary text color
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box p={3} sx={{ backgroundColor: theme.palette.background.default }}>
        {user ? (
          <Stack spacing={2}>
            <Typography variant="h6">Welcome, {user.email}</Typography>
            <Button variant="contained" color="secondary" onClick={handleSignOut}>
              Log Out
            </Button>
            <Stack spacing={1}>
              {messages.map((message, index) => (
                <Box key={index}>
                  <strong>{message.role}:</strong> {message.content}
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </Stack>
            <Stack direction="row" spacing={2}>
              <TextField
                label="Message"
                fullWidth
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                sx={{
                  backgroundColor: '#ffffff', // TextField background color
                }}
              />
              <Button
                variant="contained"
                onClick={sendMessage}
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send'}
              </Button>
            </Stack>
          </Stack>
        ) : (
          <SignIn />
        )}
      </Box>
    </ThemeProvider>
  );
}
