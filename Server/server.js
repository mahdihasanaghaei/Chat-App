const WebSocket = require('ws');
const Redis = require('ioredis');

//  WebSocket Port
const PORT = process.env.PORT || 4000;

//Create WebSocket
const wss = new WebSocket.Server({ port: PORT }, () => {
  console.log(`WebSocket Server is running on ws://localhost:${PORT}`);
});

// Connect to Redis
const redisPublisher = new Redis();
const redisSubscriber = new Redis();

// Redis channel
const CHANNEL_NAME = 'chat_channel';

// Redis subscribe channel
redisSubscriber.subscribe(CHANNEL_NAME, (err) => {
  if (err) {
    console.error('Error subscribing to Redis channel:', err);
  } else {
    console.log(`Subscribed to Redis channel: ${CHANNEL_NAME}`);
  }
});

// Receive message and sent to redis client
redisSubscriber.on('message', (channel, message) => {
  if (channel === CHANNEL_NAME) {
    console.log(`Received message from Redis [${channel}]:`, message);

    // Sent to all client as JSON
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message); 
      }
    });
  }
});

// Client connection management
wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    console.log('Received message from client:', message);

    // Check and convert to JSON
    let parsedMessage;
    try {
      parsedMessage = JSON.parse(message);
    } catch (error) {
      parsedMessage = { message, sender: 'unknown' };
    }

    // Send message to redis
    redisPublisher.publish(CHANNEL_NAME, JSON.stringify(parsedMessage));
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.send('Welcome to the WebSocket server!');
});