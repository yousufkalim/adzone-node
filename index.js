/**
 * AdZone
 * @author Shuja Naqvi
 */
require('dotenv').config();
const app = require('express')();
const port = process.env.PORT || 5000;
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*'
  }
});
const session = require('express-session');
require('./database');
app.use(session({ secret: process.env.SESSION }));
// Middleware
require('./middleware/common')(app);

// API Routes
app.use('/api', require('./routes'));
// Server
server.listen(port, () => {
  console.log(`Server is running at port ${port} :)`);
});

//Notification
io.on('connection', socket => {
  try {
    console.log('Connected');
    exports.io = io;
    exports.socket = socket;
  } catch (error) {
    console.log(error.message);
  }
});
