const gene = require("../models/gene.models");

exports.findByPrefix = (req, res) => {
  console.log(req.params);
  const prefix = req.params.prefix || "";
  const limit = req.query.limit || 10;
  // req.body
  console.log("ssssssssssssssss");
  gene
    .find(
      { symbol: new RegExp("^" + prefix, "i") },
      { ensemblId: 1, symbol: 1, name: 1, _id: 0 },
      { limit: limit }
    )
    .lean()
    .then((docs) => {
      if (!docs) {
        return res.status(404).send([]);
      } else {
        res.json(docs);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({
        message: "Server error occured",
      });
    });
};

exports.getByEnsemblId = (req, res) => {
  const ensemblId = req.params.ensemblId || "";
  console.log(ensemblId);
  // gene.find().then()
  gene
    .findOne({ geneId: ensemblId }, { _id: 0, chromosome: 1 })
    .lean()
    .then((doc) => {
      if (!doc) {
        console.log(doc);
        return res.status(404).send([]);
      } else {
        res.json(doc);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({
        message: "Server error occured",
      });
    });
};
