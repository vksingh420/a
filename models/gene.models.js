const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

const genesSchema = mongoose.Schema(
  {
    index: {
      type: Number,
      // required: true
    },
    chromosome: {
      type: String,
      required: true,
    },
    startPosition: {
      type: Number,
      // required: true
    },
    endPosition: {
      type: Number,
      // required: true
    },
    geneId: {
      type: String,
      required: true,
    },
    feature: {
      type: String,
      // required: true
    },
    strand: {
      type: String,
      // required: true
    },
  },
  { collection: "genes" }
);

module.exports = mongoose.model("genes", genesSchema);
