// code away!

const server = require('./server');

const port = process.env.PORT || 4000;

server.listen(port,()=>{
    console.log(`The server is running on Port ${port}`);
})