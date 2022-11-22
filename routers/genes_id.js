const router = require("express").Router();

const genesController = require("../controllers/gene.controller");

// router.get('/:ensemblId', genesController.getByEnsemblId);
// router.get('/gene/mouse/search/symbol/:keyword', genesController.search);
router.get("/gene/Human/symbol/prefix/:prefix", genesController.findByPrefix);
router.get("/gene/mouse/ensemblId/:ensemblId", genesController.getByEnsemblId);

module.exports = router;
