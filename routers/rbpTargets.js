const router = require("express").Router();

const rbptargetsController = require("../controllers/rbpTargets.controller");

// router.get('/:ensemblId', miRNAtargetsController.getByEnsemblId);
// router.get('/miRNA/human/search/symbol/:keyword', miRNAtargetsController.search);
router.get(
  "/rbp/human/prefix/:prefix",
  rbptargetsController.findRbpTargetsByGenePrefix
);
router.get("/rbp/human/prefix", rbptargetsController.getRbpTargets);

// router.get('/:prefix', miRNAtargetsController.findByPrefix);
// router.get('/rbp/human/ensemblId/:ensemblId', miRNAtargetsController.getByEnsemblId);

module.exports = router;
