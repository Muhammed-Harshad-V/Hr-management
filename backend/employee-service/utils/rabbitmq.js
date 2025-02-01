const amqp = require('amqplib');
const Employee = require('../model/employee'); 

async function startUserService() {
  try {
    const RMQURI = process.env.RMQ_URL;
    const connection = await amqp.connect(RMQURI);
    console.log('RabbitMQ Connected');

    const channel = await connection.createChannel();
    const queue = 'user_validation_queue';

    await channel.assertQueue(queue, { durable: false });

    console.log('User service is waiting for validation requests');

    channel.consume(queue, async (msg) => {
      if (!msg) {
        console.error('⚠️ Received null message');
        return;
      }

      try {
        const { employeeId, name } = JSON.parse(msg.content.toString());
           console.log(employeeId, name)
        const isValid = await validateEmployee(employeeId, name);

        channel.sendToQueue(
          msg.properties.replyTo,
          Buffer.from(JSON.stringify({ isValid })),
          { correlationId: msg.properties.correlationId }
        );

        channel.ack(msg);
      } catch (err) {
        console.error(' Error processing message:', err);
        channel.nack(msg, false, false); // Reject the message and do not requeue
      }
    });

  } catch (error) {
    console.error(' RabbitMQ Connection Error:', error);
    setTimeout(startUserService, 5000); // Retry after 5 seconds
  }
}

// ✅ **Fixed Employee Validation Function**
async function validateEmployee(employeeId, name) {
  try {
    const employee = await Employee.findOne({_id: employeeId});
    console.log(employee)

    if (employee) {
      return true;
    } 
    return false;

  } catch (error) {
    console.error(' Error validating employee:', error);
    return false;
  }
}

module.exports = { startUserService };
