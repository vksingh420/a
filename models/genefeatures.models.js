const mongoose = require("mongoose");

const genefeaturesSchema = mongoose.Schema(
  {
    geneId: {
      type: String,
      required: true,
    },
    startPosition: {
      type: String,
      required: true,
    },
    endPosition: {
      type: String,
      required: true,
    },
    feature: {
      type: String,
      required: true,
    },
    chromosome: {
      type: String,
      required: true,
    },
    strand: {
      type: String,
      required: true,
    },
    index: Number,
  },
  { collection: "gene_features" }
);

module.exports = mongoose.model("gene_features", genefeaturesSchema);
