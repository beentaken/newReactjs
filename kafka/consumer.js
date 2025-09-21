const { Kafka, logLevel } = require('kafkajs');

const kafka = new Kafka({
  logLevel: logLevel.DEBUG, // Enable DEBUG logging
  clientId: 'my-app',
  brokers: ['localhost:29092'] // correct for external host
})

const consumer = kafka.consumer({ groupId: 'test-group' })

const run = async () => {
  await consumer.connect()
  await consumer.subscribe({ topic: 'test-topic', fromBeginning: true })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        partition,
        offset: message.offset,
        value: message.value.toString(),
      })
    },
  })
}

run().catch(console.error)
