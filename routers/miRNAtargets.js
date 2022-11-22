const router = require("express").Router();

const miRNAtargetsController = require("../controllers/miRNAtargets.controller");

// router.get('/:ensemblId', miRNAtargetsController.getByEnsemblId);
router.get(
  "/miRNA/human/search/symbol/:keyword",
  miRNAtargetsController.search
);
router.get("/miRNA/human/prefix/:prefix", miRNAtargetsController.findByPrefix);
// router.get('/:prefix', miRNAtargetsController.findByPrefix);
router.get(
  "/miRNA/human/ensemblId/:ensemblId",
  miRNAtargetsController.getByEnsemblId
);

module.exports = router;
