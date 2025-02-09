import React, { useState, useEffect } from 'react';
import './App.css'; 

const App = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [ws, setWs] = useState(null);
  const [userIP, setUserIP] = useState('unknown');

  useEffect(() => {
    const fetchIPv4 = async () => {
      try {
        const response = await fetch('https://ipv4.icanhazip.com'); // IPv4 only
        const ip = await response.text();
        setUserIP(ip.trim()); // Remove any extra whitespace
      } catch (error) {
        console.error('Failed to fetch IPv4 address:', error);
      }
    };

    fetchIPv4();
  }, []);

  useEffect(() => {
    const websocket = new WebSocket('ws://195.201.24.231:4001');

    websocket.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    websocket.onerror = (error) => {
      console.log('WebSocket error:', error);
    };

    websocket.onmessage = async (event) => {
      console.log('Raw message from server:', event.data);

      let messageData = event.data;

      try {
        if (messageData instanceof Blob) {
          messageData = await messageData.text();
        }

        const parsedMessage = JSON.parse(messageData);

        setMessages((prevMessages) => [
          ...prevMessages,
          `${parsedMessage.sender || 'unknown'}: ${parsedMessage.message || messageData}`,
        ]);
      } catch (error) {
        console.warn('Failed to parse message:', error, messageData);
        setMessages((prevMessages) => [...prevMessages, messageData]);
      }
    };

    websocket.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, []);

  const sendMessage = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      console.log('Sending message:', message);

      const formattedMessage = JSON.stringify({ message: message, sender: userIP });
      ws.send(formattedMessage);

      setMessage('');
    } else {
      console.error('WebSocket is not connected.');
    }
  };

  return (
    <div className="chat-container">
      <h1 className="chat-header">Chat App</h1>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className="chat-message">{msg}</div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="chat-input"
          placeholder="Type your message..."
        />
        <button onClick={sendMessage} className="send-button">Send</button>
      </div>
    </div>
  );
};

export default App;