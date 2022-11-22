const polyAdb_bed = require('../models/polyADB.models');
const biomartGene = require('../models/biomartGenes.models');

exports.getByEnsemblId = (req, res) => {
    const ensemblId = req.params.ensemblId || '';
    console.log(ensemblId);
    polyAdb_bed.find({geneId: ensemblId}, { geneId: 1, startPosition: 1, endPosition: 1, feature:1, strand: 1, '_id': 0})
      .lean()
      .then(doc => {
        if (!doc) {
          console.log(doc)
          return res.status(404).send([]);
        }
        else {
          res.json(doc);  
        }
      }).catch(err => {
        console.log(err);
        return res.status(500).send({
          message: 'Server error occured'
        });
      });
  };

// polyAdb file
exports.findByPrefix = (req, res) => {
  const prefix = req.params.prefix || '';
  const limit = req.query.limit || 10;
  biomartGene.find({ Genename: new RegExp( '^'+prefix+'$', 'i')},
    { GenestableID: 1, Genename: 1, Genedescription: 1, '_id': 0 },
    // { limit: limit }
  )
    .lean()
    .then((result) => {
      return result[0]["GenestableID"];
    })
     .then((result) => {
      console.log(result)
      return polyAdb_bed.find({geneId: new RegExp('^' + result, 'i')}, 
      { geneId: 1, chromosome: 1, startPosition: 1, endPosition: 1, feature:1, strand: 1, '_id': 0},
    )
      .lean()
    })
    .then(result => {
      if (!result) {
        return res.status(404).send([]);
      }
      else {
        // console.log(result);
        res.json(result);
      }
    })
    .catch(err => {
      console.log(err);
      return res.status(500).send({
        message: 'Server error occured'
      });
    });
};