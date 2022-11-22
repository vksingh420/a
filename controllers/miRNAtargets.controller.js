const miRNA_target = require("../models/miRNA.models");
const biomartGene = require("../models/biomartGenes.models");

// exports.findByPrefix = (req, res) => {
// console.log(req);
//   const prefix = req.params.prefix || '';
// //   console.log(req.params.prefix);
//   const limit = req.query.limit || 10;
//   miRNA_target.find({ GeneSymbol: new RegExp('^' + prefix, 'i') },
//     { GeneID: 1, GeneSymbol: 1, miRNA: 1, UTRstart: 1, UTRend: 1, '_id': 0 },
//     { limit: limit }
//   )
//     .lean()
//     .then(docs => {
//       if (!docs) {
//         return res.status(404).send([]);
//       }
//       else {
//         res.json(docs);
//       }
//     }).catch(err => {
//       console.log(err);
//       return res.status(500).send({
//         message: 'Server error occured'
//       });
//     });
// };

exports.search = (req, res) => {
  const keywords = (req.params.keyword || "").split(/[^a-zA-Z0-9]+/g);
  const limit = req.query.limit || 30;

  if (keywords.length > 0 && keywords[0].length > 0) {
    const query = { $or: [] };
    for (const keyword of keywords) {
      query["$or"].push({ symbol: new RegExp("^" + keyword + ".*", "i") });
    }
    Genes.find(query, { GeneID: 1, GeneSymbol: 1, miRNA: 1, _id: 0 }, { limit })
      .lean()
      .then((docs) => {
        res.send(docs);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).send({
          message: "Server error occured",
        });
      });
  } else {
    res.status(404).send({
      message: "Invalid keyword",
    });
  }
};

exports.getByEnsemblId = (req, res) => {
  const ensemblId = req.params.ensemblId || "";
  console.log(ensemblId);
  miRNA_target
    .find({ GeneID: ensemblId }, { GeneID: 1, GeneSymbol: 1, miRNA: 1, _id: 0 })
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

// miRNA target file
exports.findByPrefix = (req, res) => {
  const prefix = req.params.prefix || "";
  const limit = req.query.limit || 100;
  biomartGene
    .find(
      { Genename: new RegExp("^" + prefix + "$", "i") },
      { GenestableID: 1, Genename: 1, Genedescription: 1, _id: 0 }
      // { limit: limit }
    )
    .lean()
    .then((result) => {
      console.log(result[0]["GenestableID"]);
      return result[0]["GenestableID"];
    })
    .then((result) => {
      console.log(result);
      return miRNA_target
        .find(
          { GeneID: { $regex: result } },
          {
            GeneID: 1,
            GeneSymbol: 1,
            miRNA: 1,
            UTRstart: 1,
            UTRend: 1,
            _id: 0,
          },
          { limit: limit }
        )
        .lean();
    })
    .then((result) => {
      if (!result) {
        return res.status(404).send([]);
      } else {
        res.json({ MiRNA: result });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({
        message: "Server error occured",
      });
    });
};
