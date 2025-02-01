const amqp = require('amqplib');
const { v4: uuidv4 } = require('uuid'); // Import UUID package

let connection;
let channel;

// Initialize RabbitMQ connection
async function initializeRabbitMQ() {
  const RMQURI = process.env.RMQ_URL;
  connection = await amqp.connect(RMQURI);
  channel = await connection.createChannel();
  console.log('✅ Connected to RabbitMQ');
}

// Send RPC request and wait for response
async function sendRPC(queue, message) {
  if (!channel) await initializeRabbitMQ(); // Ensure connection is active

  // Create a temporary reply queue
  const assertQueue = await channel.assertQueue('', { exclusive: true, durable: false, autoDelete: true });
  const replyQueue = assertQueue.queue;
  
  // Generate a unique correlation ID
  const correlationId = uuidv4();

  return new Promise((resolve, reject) => {
    // Timeout after 5 seconds
    const timeout = setTimeout(() => {
      console.error(`⏳ Timeout: No response received in 5 seconds for correlationId ${correlationId}`);
      channel.deleteQueue(replyQueue).catch(console.error); // Cleanup queue
      reject(new Error('RPC request timed out'));
    }, 5000);

    // Listen for response
    channel.consume(replyQueue, (msg) => {
      if (!msg) {
        clearTimeout(timeout);
        reject(new Error('Received null message'));
        return;
      }

      if (msg.properties.correlationId === correlationId) {
        clearTimeout(timeout);
        resolve(JSON.parse(msg.content.toString()));
        // Ensure queue is deleted AFTER processing the response
        channel.deleteQueue(replyQueue).catch(console.error);
      }
    }, { noAck: true });

    // Send request
    channel.sendToQueue(
      queue,
      Buffer.from(JSON.stringify(message)),
      { correlationId, replyTo: replyQueue }
    );

  });
}

module.exports = { initializeRabbitMQ, sendRPC };
