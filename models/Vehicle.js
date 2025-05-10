const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
    id: { type: String }, 
    uniqueId: { type: String, required: true, unique: true }, // ✅ required & unique
    name: { type: String, required: true },                   // ✅ required
    category: { type: String }, 
    latitude: { type: Number, required: true }, 
    longitude: { type: Number, required: true },  
    temperature: { type: Number, required: true }, 
    pression: { type: Number, required: true }, 
    humidity: { type: Number, required: true }, 
    flame: { type: Boolean, required: true },
    driver: { type: String, required: true },
    positionId: { type: String }, 
    updatedAt: { type: Date, default: Date.now }, 
    assignedRoute: { type: mongoose.Schema.Types.ObjectId, ref: "Route" }, 
    assignedTrip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip" },
    assignedBlock: { type: String }, 
    headsign: { type: String }, 
    estimatedArrivalTimes: [{ 
        stopId: { type: mongoose.Schema.Types.ObjectId, ref: "Stop" }, 
        arrivalTime: { type: Date } 
    }],
    currentShapeSequence: { type: Number },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    vehicle_details: {
        next_stop_id: { type: mongoose.Schema.Types.ObjectId, ref: "Stop" },
        next_stop_name: { type: String },
        next_stop_distance: { type: Number } // Distance in km
    }
});

module.exports = mongoose.model("Vehicle", vehicleSchema);
