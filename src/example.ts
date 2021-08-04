import * as dotenv from 'dotenv';
import { MessageBroker, messageBrokerSingleton } from './message-broker';

/**
 * A little hack to add timestamps to console.debug
 */
const log = console.debug;
console.debug = function (args) {
  log.apply(console, ['[' + (new Date()).toISOString() + ']'].concat(args));
};


/**
 * Init
 */
dotenv.config();
const broker: MessageBroker = messageBrokerSingleton;
const topic = 'test';

/**
 * Subscribe to a topic (exchange is set in .env)
 */
broker.subscribe('', topic, (message: any, ack: any) => {
  console.debug(`Received message on \`${topic}\` : \`${message.content.toString('utf8')}\``);

  ack();
});

/**
 * Send to a topic
 */
console.debug(`Sending message on \`${topic}\``);

broker.send(topic, { 'message': 'This is a message.' });
