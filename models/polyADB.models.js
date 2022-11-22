const mongoose = require("mongoose");

const polyADBSchema = mongoose.Schema(
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
  { collection: "polyAdbBed" }
);

module.exports = mongoose.model("polyAdbBed", polyADBSchema);
