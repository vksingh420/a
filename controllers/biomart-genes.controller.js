const httpStatus = require("http-status");

const {
  BiomartGeneModel,
  GeneFeaturesModel,
  MiRNATargetModel,
  PolyASiteModel,
  RbpTargetsModel,
} = require("../models");

// // gene features bed file
exports.findByPrefix = (req, res) => {
  const prefix = req.params.prefix || "";
  const limit = req.query.limit || 10;

  const filter = { Genename: new RegExp("^" + prefix + "$", "i") };
  const fields = { GenestableID: 1, Genename: 1, Genedescription: 1, _id: 0 };

  BiomartGeneModel.find(filter, fields)
    .lean()
    .then((result) => {
      console.log(result);
      console.log(result.length ? result[0]["GenestableID"] : "");
      return result.length ? result[0]["GenestableID"] : null;
    })
    .then((result) => {
      if (result) {
        console.log(result);
        return GeneFeaturesModel.find(
          { geneId: { $regex: result } },
          {
            geneId: 1,
            startPosition: 1,
            endPosition: 1,
            feature: 1,
            chromosome: 1,
            strand: 1,
            _id: 0,
          }
          // { limit: limit }
        ).lean();
      } else {
        return null;
      }
    })
    .then((result) => {
      if (!result) {
        return res.status(404).send([]);
      } else {
        // console.log(result);
        var objectWithGroupByFeature = {};
        for (var key in result) {
          var feature = result[key].feature;
          if (!objectWithGroupByFeature[feature]) {
            objectWithGroupByFeature[feature] = [];
          }
          objectWithGroupByFeature[feature].push(result[key]);
        }

        // console.log({ objectWithGroupByFeature });
        return res.status(httpStatus.OK).json(objectWithGroupByFeature);

        // var utr5_startval =
        //   objectWithGroupByFeature["UTR5"][0]["startPosition"];
        // console.log(utr5_startval);
        // var keyCount = Object.keys(objectWithGroupByFeature["UTR3"]).length;
        // console.log(keyCount);
        // var utr3_endval =
        //   objectWithGroupByFeature["UTR3"][keyCount - 1]["endPosition"];
        // console.log(utr3_endval);
        // return utr5_startval, utr3_endval;
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({
        message: "Server error occured",
      });
    });
};

exports.getGenomes = async (req, res) => {
  const { pageNumber, limit, q } = req.query;

  const filter = {};

  if (q) filter.Genename = { $regex: `^${q}`, $options: "i" };

  const fields = { Genename: 1 };
  const options = { limit: limit ? +limit : 20 };
  const skip = pageNumber ? (pageNumber - 1) * options.limit : 0;
  options.skip = skip;

  try {
    const result = await BiomartGeneModel.find(filter, fields, options);
    const genomes = result.map((r) => r.Genename);

    return res.status(httpStatus.OK).send({ genomes });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

exports.testGenomes = async (req, res, next) => {
  const { pageNumber } = req.query;
  const options = { limit: 20 };
  const skip = pageNumber ? (pageNumber - 1) * options.limit : 0;
  options.skip = skip;

  try {
    const geneId = "ENSG00000124788";

    const miRNAResult = await MiRNATargetModel.find(
      {
        GeneID: { $regex: geneId },
      },
      {
        GeneSymbol: 1,
        miRNA: 1,
        UTRstart: 1,
        UTRend: 1,
      },
      { limit: 100 }
    );

    const MiRNA_targets = {};

    for (let key in miRNAResult) {
      const miRNA = miRNAResult[key].miRNA;
      if (!MiRNA_targets[miRNA]) {
        MiRNA_targets[miRNA] = [];
      }
      MiRNA_targets[miRNA].push(miRNAResult[key]);
    }

    const polyAResult = await PolyASiteModel.find(
      {
        geneId: { $regex: geneId },
      },
      {
        chromosome: 1,
        startPosition: 1,
        endPosition: 1,
        feature: 1,
        strand: 1,
        _id: 0,
      },
      { limit: 100 }
    );

    const rbpTargets = await RbpTargetsModel.find(
      {
        // TODO:
      },
      {
        chromosome: 1,
        startPosition: 1,
        endPosition: 1,
        description1: 1,
        strand: 1,
        _id: 0,
      },
      { limit: 20 }
    );

    return res.status(httpStatus.OK).send({
      rbpTargets,
      polyAResult,
      MiRNA_targets,
    });
  } catch (error) {
    next(error);
  }
};

// // // gene features bed file
// exports.findByPrefix = (req, res) => {
//   const prefix = req.params.prefix || '';
//   const limit = req.query.limit || 10;
//   BiomartGeneModel.find({ Genename: new RegExp( '^'+prefix+'$', 'i')},
//     { GenestableID: 1, Genename: 1, Genedescription: 1, '_id': 0 },
//     // { limit: limit }
//   )
//     .lean()
//     .then((result) => {
//       console.log(result[0]["GenestableID"]);
//       return result[0]["GenestableID"];
//     })
//      .then((result) => {
//       console.log(result)
//       return GeneFeaturesModel.find({ geneId: {$regex : result}},
//         { geneId: 1, startPosition: 1, endPosition: 1, feature: 1, chromosome: 1, strand: 1, '_id': 0},
//       // { limit: limit }
//     )
//       .lean()
//     })
//     .then(result => {
//       if (!result) {
//         return res.status(404).send([]);
//       }
//       else {
//         // console.log(result);
//         var objectWithGroupByFeature = {};
//         for (var key in result){
//            var feature = result[key].feature;
//         if (!objectWithGroupByFeature[feature]){
//           objectWithGroupByFeature[feature] = [];
//         }
//         objectWithGroupByFeature[feature].push(result[key]);
//      }
//     //  console.log(objectWithGroupByName['Intron']);
//     //  console.log(objectWithGroupByName[0]['feature']);
//         // res.json(result);
//         res.json(objectWithGroupByFeature);
//         console.log(objectWithGroupByFeature['UTR5'][0]);
//         // const ListOfStudentName =
//         // objectWithGroupByName.map(({feature:actualValue})=>actualValue);
//         // console.log(ListOfStudentName);
//       }
//     }).catch(err => {
//       console.log(err);
//       return res.status(500).send({
//         message: 'Server error occured'
//       });
//     });
// };

// // trying
// // // gene features bed file
// exports.findByPrefix = (req, res) => {
//   const prefix = req.params.prefix || '';
//   const limit = req.query.limit || 10;
//   BiomartGeneModel.find({ Genename: new RegExp( '^'+prefix+'$', 'i')},
//     { GenestableID: 1, Genename: 1, Genedescription: 1, '_id': 0 },
//     // { limit: limit }
//   )
//     .lean()
//     .then((result) => {
//       console.log(result[0]["GenestableID"]);
//       return result[0]["GenestableID"];
//     })
//      .then((result) => {
//       console.log(result)
//       return GeneFeaturesModel.aggregate([
//         { $match: {geneId: {$regex : result}}},
//         { $group: { "_id": "$feature"} },
//         {  $project: {geneId: 1, startPosition: 1, endPosition: 1, feature: 1, chromosome: 1, strand: 1, '_id': 0}},
//       // { limit: limit }
//       ]
//     )
//       .lean()
//     })
//     .then(result => {
//       if (!result) {
//         return res.status(404).send([]);
//       }
//       else {
//         // console.log(docs[0]["GenestableID"]);
//         res.json(result);
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
      query["$or"].push({ Genename: new RegExp("^" + keyword + ".*", "i") });
    }
    BiomartGeneModel.find(
      query,
      { GenestableID: 1, Genename: 1, Genedescription: 1, _id: 0 },
      { limit }
    )
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

// exports.findByPrefix = (req, res) => {
//   const prefix = req.params.prefix || '';
//   const limit = req.query.limit || 10;
//   console.log('/^'+prefix+'/i')
//   // BiomartGeneModel.find({ Genename: new RegExp('^' + prefix, 'i') },
//   // BiomartGeneModel.find({ Genename: { '$regex': '^'+prefix+'$'}},
//   BiomartGeneModel.find({ Genename: new RegExp( '^'+prefix+'$', 'i')},
//     { GenestableID: 1, Genename: 1, Genedescription: 1, '_id': 0 },
//     { limit: limit }
//   )
//     .lean()
//     .then(docs => {
//       if (!docs) {
//         return res.status(404).send([]);
//       }
//       else {
//         // console.log(docs[0]["GenestableID"]);
//         res.json(docs);
//       }
//     }).catch(err => {
//       console.log(err);
//       return res.status(500).send({
//         message: 'Server error occured'
//       });
//     });
// };

// exports.getByEnsemblId = (req, res) => {
//     const ensemblId = req.params.ensemblId || '';
//     console.log(ensemblId);
//     MiRNATargetModel.find({GeneID: ensemblId}, { GeneID: 1, GeneSymbol: 1, miRNA: 1, '_id': 0})
//       .lean()
//       .then(doc => {
//         if (!doc) {
//           console.log(doc)
//           return res.status(404).send([]);
//         }
//         else {
//           res.json(doc);
//         }
//       }).catch(err => {
//         console.log(err);
//         return res.status(500).send({
//           message: 'Server error occured'
//         });
//       });
//   };
