const { Kafka, logLevel } = require('kafkajs');

const kafka = new Kafka({
 // logLevel: logLevel.DEBUG, // Enable DEBUG logging
  clientId: 'my-app',
  brokers: ['localhost:29092'] // correct for external host
});

const producer = kafka.producer();

const run = async () => {
  await producer.connect();
  await producer.send({
    topic: 'test-topic',
    messages: [
      { key: "1", value: 'Hello KafkaJS!' },
    ],
  });
  console.log("Message sent");
  await producer.disconnect();
};

run().catch(console.error);
