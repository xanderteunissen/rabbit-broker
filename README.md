# RabbitMQ Message Broker

Class to encapsulate some oft-used RMQ functionality.

## Table of Contents

- [Functionality](#functionality)
- [Getting Started](#getting-started)
- [Software](#software)
- [Settings](#settings)

## Functionality

This is my message broker. There are many like it, but this one's mine. Although, to be fair, I think I stole the core elsewhere and adjusted it for personal use.

Either way, I always found properly setting up `amqplib` to be a little tedious. This class simplifies the process, providing `subscribe` and `send` functions to communicate with an exchange topic.

See `src/example.ts` for more information.

## Getting started

1. Check out the repo.
2. Install dependencies using `npm install`
3. Copy `.env.example` to `.env` and adjust values
4. Start the example with `npm run start`

## Software

- Node.js 14.x
- Amqplib 0.7.x

### Settings

|Key|Type|Comment|
|--|--|--|
|`RMQ_URL`|string|Url of the RabbitMQ server|
|`RMQ_EXCHANGE`|string|Name of the RabbitMQ exchange|
