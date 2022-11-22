const router = require("express").Router();

const polyADBController = require("../controllers/polyADB.controller");

// router.get('/:ensemblId', genesController.getByEnsemblId);
// router.get('/gene/mouse/search/symbol/:keyword', genesController.search);
// router.get('/gene/Human/symbol/prefix/:prefix', genesController.findByPrefix);
// router.get('/:ensemblId', polyADBController.getByEnsemblId);
router.get("/polyADB/human/prefix/:prefix", polyADBController.findByPrefix);
// router.get('/polyADB/human/ensemblId/:ensemblId', polyADBController.getByEnsemblId);

module.exports = router;
