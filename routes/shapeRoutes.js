const express = require('express');
const { createShape,getShapeById,getShapes ,getShapesSummary, updateShape, deleteShape } = require('../controllers/shapeController');
const { protect,isSuperAdmin,isSuperOrAdmin,isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/',protect,  createShape);       
router.get('/',protect,getShapes); 
router.get('/summary',protect,getShapesSummary); 
router.get('/:id',protect, getShapeById);    
router.put('/:id',protect,isSuperOrAdmin ,updateShape);     
router.delete('/:id', protect ,isSuperOrAdmin ,deleteShape);

module.exports = router;
