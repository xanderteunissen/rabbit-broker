import * as dotenv from 'dotenv';
import amqp from 'amqplib'
import _ from 'lodash'

dotenv.config();

export class MessageBroker {
  queues: object;
  connection: any;
  channel: any;

  constructor() {
    this.queues = {};
    this.init();
  }

  private async init() {
    this.connection = await amqp.connect(process.env.RMQ_URL);
    this.channel = await this.connection.createChannel();
    return this;
  }

  public async send(topic: string, message: object) {
    if (!this.connection) {
      await this.init();
    }

    if (!Buffer.isBuffer(message)) {
      message = Buffer.from(JSON.stringify(message));
    }

    this.channel.publish(process.env.RMQ_EXCHANGE, topic, message);
  }

  public async subscribe(queue: string, topic: string, handler: Function) {
    if (!this.connection) {
      await this.init();
    }
    if (this.queues[queue]) {
      const existingHandler = _.find(this.queues[queue], h => h === handler);
      if (existingHandler) {
          return () => this.unsubscribe(queue, existingHandler);
      }
      this.queues[queue].push(handler);
      return () => this.unsubscribe(queue, handler);
    }

    const q = await this.channel.assertQueue('', { autoDelete: true, durable: false });
    await this.channel.bindQueue(q.queue, process.env.RMQ_EXCHANGE, topic);

    this.queues[q.queue] = [handler];
    this.channel.consume(
      q.queue,
      async (message) => {
        const ack = _.once(() => this.channel.ack(message));
        this.queues[q.queue].forEach(h => h(message, ack));
      }
    );
    return () => this.unsubscribe(queue, handler);
  }

  private async unsubscribe(queue, handler) {
    _.pull(this.queues[queue], handler);
  }
}

export const messageBrokerSingleton = new MessageBroker();