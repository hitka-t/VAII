const express = require('express');
const router = express.Router();
const {
  createTechnika,
  getTechnika,
  deleteTechnika,
  updateTechnika,
} = require('../controllers/technikaController');

router.post('/technika', createTechnika);        // POST /api/technika
router.get('/technika', getTechnika);            // GET /api/technika
router.delete('/technika/:id', deleteTechnika);  // DELETE /api/technika/:id
router.put('/technika/:id', updateTechnika);     // PUT /api/technika/:id

module.exports = router;
