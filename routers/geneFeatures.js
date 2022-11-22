const router = require("express").Router();

const genefeaturesController = require("../controllers/geneFeatures.controller");

// router.get('/:ensemblId', genesController.getByEnsemblId);
// router.get('/gene/mouse/search/symbol/:keyword', genesController.search);
router.get(
  "/genefeatures/human/symbol/prefix/:prefix",
  genefeaturesController.findByPrefix
);
// router.get('/:ensemblId', polyADBController.getByEnsemblId);
// router.get('/genefeatures/human/ensemblId/:ensemblId', genefeaturesController.getByEnsemblId);

module.exports = router;
