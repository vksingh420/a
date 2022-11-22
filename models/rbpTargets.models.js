const mongoose = require("mongoose");

const rbptargetsSchema = mongoose.Schema(
  {
    chromosome: {
      type: String,
      required: true,
    },
    startPosition: {
      type: Number,
      required: true,
    },
    endPosition: {
      type: Number,
      required: true,
    },
    description1: {
      type: String,
      required: true,
    },
    strand: {
      type: String,
      required: true,
    },
    description2: String,
    description3: String,
    description4: String,
    sampleIds: Array,
  },
  { collection: "rbpTargets" }
);

module.exports = mongoose.model("rbpTargets", rbptargetsSchema);
