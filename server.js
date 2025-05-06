const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const cors = require('cors');
const createDefaultSuperAdmin = require('./config/defaultAdmin');
const mongoose = require('mongoose');
dotenv.config(); 
const { swaggerUI, swaggerSpec } = require('./config/swagger');
const path = require("path");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());

app.use(cors({ origin: 'http://localhost:3001', credentials: true }));

// 🚀 Augmenter la taille maximale des requêtes JSON
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));



// Connexion à la base de données
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URI , {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Connected to MongoDB");

  // Listen on port 5000
  const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});

})
.catch((error) => {
  console.log("MongoDB connection error:", error);
});

mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB Connected');
});

createDefaultSuperAdmin();

// Définition des routes
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use('/api/session', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/agencies', require('./routes/agencyRoutes.js'));
app.use('/api/routes', require('./routes/routeRoutes'));
app.use('/api/trips', require('./routes/tripRoutes'));
app.use('/api/stops', require('./routes/stopRoutes'));
app.use('/api/stopTimes', require('./routes/stopTimesRoutes'));
app.use('/api/calendars', require('./routes/calendarRoutes.js'));
app.use('/api/shapes', require('./routes/shapeRoutes.js'));
app.use('/api/userpermission', require('./routes/permissionRoutes.js'));
app.use('/api/vehicle-assignments', require('./routes/VehicleAssignementRoutes.js'));



app.use('/api/vehicles', require('./routes/vehicleRoutes'));

app.get('/', (req, res) => {
  res.send('🚀 API en cours d\'exécution...');
});

//build
app.use(express.static(path.join(__dirname, "build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

