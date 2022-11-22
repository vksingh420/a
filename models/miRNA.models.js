const mongoose = require("mongoose");

const miRNAtargetsSchema = mongoose.Schema(
  {
    GeneID: {
      type: String,
      required: true,
    },
    GeneSymbol: {
      type: String,
      required: true,
    },
    miRNA: {
      type: String,
      required: true,
    },
    UTRstart: {
      type: Number,
      required: true,
    },
    UTRend: {
      type: Number,
      required: true,
    },
    TranscriptID: String,
    GeneTaxID: String,
    SiteType: Number,
    contextscore: Number,
    contextscorepercentile: Number,
    weightedcontextscore: Number,
    weightedcontextscorepercentile: Number,
  },
  { collection: "miRNA_targets" }
);

module.exports = mongoose.model("miRNA_targets", miRNAtargetsSchema);
