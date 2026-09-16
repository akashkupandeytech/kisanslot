require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

const farmerRoutes = require('./routes/farmerRoutes');
const cropRoutes = require('./routes/cropRoutes');
const slotRoutes = require('./routes/slotRoutes');
const centreRoutes = require('./routes/centreRoutes');
const documentRoutes = require('./routes/documentRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const marketRoutes = require('./routes/marketRoutes');

const app = express();
const server = http.createServer(app);

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

const io = new Server(server, {
  cors: { origin: CLIENT_ORIGIN, methods: ['GET', 'POST', 'PATCH'] }
});

connectDB();

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

// Make io available to every route via req.app.get('io')
app.set('io', io);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/farmers', farmerRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/centres', centreRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/market', marketRoutes);

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);
  socket.on('disconnect', () => console.log('Socket disconnected:', socket.id));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`KisanSlot backend (with Socket.io) running on port ${PORT}`));
