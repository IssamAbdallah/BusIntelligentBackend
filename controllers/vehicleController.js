const express = require('express');
const Vehicle = require('../models/Vehicle');

const router = express.Router();
/**
 * @swagger
 * /api/vehicles:
 *   get:
 *     summary: Get all vehicles
 *     tags: [Vehicles]
 *     responses:
 *       200:
 *         description: List of vehicles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Internal server error
 */
const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @swagger
 * /api/vehicles/{id}:
 *   get:
 *     summary: Get a vehicle by ID
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vehicle ID
 *     responses:
 *       200:
 *         description: Vehicle data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Vehicle not found
 *       500:
 *         description: Internal server error
 */
const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @swagger
 * /api/vehicles:
 *   post:
 *     summary: Create a new vehicle (only name and uniqueId are allowed)
 *     tags: [Vehicles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - uniqueId
 *               - name
 *               - driver
 *               - temperature
 *               - humidity
 *               - pression
 *               - flame
 *               - latitude
 *               - longitude
 *             properties:
 *               uniqueId:
 *                 type: string
 *               name:
 *                 type: string
 *               driver:
 *                 type: string
 *               temperature:
 *                 type: string
 *               humidity:
 *                 type: string
 *               pression:
 *                 type: string
 *               flame:
 *                 type: boolean
 *               latitude:
 *                 type: string 
 *               longitude:
 *                 type: string     
 *     responses:
 *       201:
 *         description: Vehicle created
 *       400:
 *         description: Missing required fields or bad request
 */

const createVehicle = async (req, res) => {
    const { uniqueId, name, driver, temperature, humidity, pression, flame, latitude, longitude} = req.body;
  
    // Only allow `uniqueId` and `name` fields
    if (!uniqueId || !name) {
      return res.status(400).json({ message: "uniqueId and name are required" });
    }
  
    try {
      const newVehicle = new Vehicle({ uniqueId, name, driver, temperature, humidity, pression, flame, latitude, longitude});
      const savedVehicle = await newVehicle.save();
      res.status(201).json(savedVehicle);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  

/**
 * @swagger
 * /api/vehicles/{id}:
 *   put:
 *     summary: Update a vehicle
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vehicle ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uniqueId:
 *                 type: string
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               fixTime:
 *                 type: string
 *                 format: date-time
 *               speed:
 *                 type: number
 *               course:
 *                 type: number
 *               positionId:
 *                 type: string
 *               updatedAt:
 *                 type: string
 *                 format: date-time
 *               assignedRoute:
 *                 type: string
 *               assignedTrip:
 *                 type: string
 *               assignedBlock:
 *                 type: string
 *               headsign:
 *                 type: string
 *               estimatedArrivalTimes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     stopId:
 *                       type: string
 *                     arrivalTime:
 *                       type: string
 *                       format: date-time
 *               currentShapeSequence:
 *                 type: number
 *               user:
 *                 type: string
 *               vehicle_details:
 *                 type: object
 *                 properties:
 *                   next_stop_id:
 *                     type: string
 *                   next_stop_name:
 *                     type: string
 *                   next_stop_distance:
 *                     type: number
 *     responses:
 *       200:
 *         description: Vehicle updated
 *       400:
 *         description: Bad request
 *       404:
 *         description: Vehicle not found
 */
const updateVehicle = async (req, res) => {
  try {
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedVehicle) return res.status(404).json({ message: "Vehicle not found" });
    res.status(200).json(updatedVehicle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @swagger
 * /api/vehicles/{id}:
 *   delete:
 *     summary: Delete a vehicle
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vehicle ID
 *     responses:
 *       200:
 *         description: Vehicle deleted successfully
 *       404:
 *         description: Vehicle not found
 *       500:
 *         description: Server error
 */
const deleteVehicle = async (req, res) => {
  try {
    const deleted = await Vehicle.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Vehicle not found" });
    res.status(200).json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle
};
