const express = require('express');
const {
  getAllEntries,
  addEntry,
  updateEntry,
  deleteEntry,
  getMaterialNames,
  renameMaterial,
  deleteMaterial,
  getMaterialStock
} = require('../controllers/materialEntryController');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);
router.get('/names', getMaterialNames);                     
router.get('/stock/:materialName', getMaterialStock);       
router.put('/material/:materialName', renameMaterial);      
router.delete('/material/:materialName', deleteMaterial);   

router.get('/', getAllEntries);                             
router.post('/', addEntry);                                

router.put('/:id', updateEntry);    
router.delete('/:id', deleteEntry);

module.exports = router;