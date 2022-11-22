const router = require("express").Router();

const biomartGenesController = require("../controllers/biomart-genes.controller");

// router.get('/:ensemblId', genesController.getByEnsemblId);
// router.get('/gene/mouse/search/symbol/:keyword', genesController.search);
// router.get('/gene/human/search/symbol/:keyword', biomartGenesController.search);
router.get("/testGenomes", biomartGenesController.testGenomes);
router.get("/gene/human/symbol/prefix/", biomartGenesController.getGenomes);
router.get(
  "/gene/human/symbol/prefix/:prefix",
  biomartGenesController.findByPrefix
);

module.exports = router;
