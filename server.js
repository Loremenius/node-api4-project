const express = require('express');
const helmet = require('helmet');
const server = express();

const userRouter = require('./users/userRouter');
const postRouter = require('./posts/postRouter');


//custom middleware

function logger(req, res, next) {
  const timestamp = new Date();
  console.log(`${req.method} to ${req.originalUrl} on ${timestamp}`);
  next();
}

server.use(helmet());
server.use(express.json());
server.use(logger);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

server.use('/api/users',helmet(), userRouter);
server.use('/api/posts', helmet(), postRouter);


module.exports = server;
