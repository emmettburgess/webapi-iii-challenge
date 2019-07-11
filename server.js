const express = require('express');
const helmet = require('helmet');

const postRouter = require('./posts/postRouter');
const userRouter = require('./users/userRouter');

const server = express();

server.use(express.json());
server.use(helmet());
server.use(logger);
server.use('/posts', postRouter)
server.use('/users', userRouter)

server.get('/', (req, res) => {
  res.send(`<h2> Ski-doosh </h2>`)
});

function logger(req, res, next) {

  console.log( `a ${req.method} request to ${req.url} on ${Date()}` )
  next();
};

module.exports = server;