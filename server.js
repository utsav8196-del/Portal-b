require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const seedMaterials = require('./controllers/materialController').seedMaterials;
const User = require('./models/User');

const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const materialEntryRoutes = require('./routes/materialEntryRoutes');
const labourRoutes = require('./routes/labourRoutes');
const machineryRoutes = require('./routes/machineryRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const statsRoutes = require('./routes/statsRoutes');

const app = express();

connectDB();

// Seed admin user if none exists
const createAdminIfNeeded = async () => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';
  const adminExists = await User.findOne({ role: 'admin' });
  if (!adminExists) {
    const admin = new User({
      email: adminEmail,
      password: adminPassword,
      name: 'Super Admin',
      role: 'admin'
    });
    await admin.save();
    console.log(`✅ Admin created: ${adminEmail}`);
  } else {
    console.log('Admin already exists');
  }
};

mongoose.connection.once('open', async () => {
  await createAdminIfNeeded();
  await seedMaterials();
  console.log('Default materials seeded');
});

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/materials', materialEntryRoutes);
app.use('/api/labour', labourRoutes);
app.use('/api/machinery', machineryRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/settings', settingsRoutes);

app.get('/', (req, res) => res.json({ message: 'API running' }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));