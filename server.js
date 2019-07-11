const express = require('express');
const helmet = require('helmet');
const userRouter = require('./users/userRouter.js');
const postRouter = require('./posts/postRouter');

const server = express();

server.use(logger);
server.use(helmet());

server.use(express.json());

server.use('/api/users', userRouter);

server.use('/api/posts', postRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});
function logger(req, res, next) {
  next();
};

module.exports = server;