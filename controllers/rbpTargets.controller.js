const {
  BiomartGeneModel,
  GeneFeaturesModel,
  RbpTargetsModel,
} = require("./../models");

exports.findRbpTargetsByGenePrefix = async (req, res) => {
  const prefix = req.params.prefix || "";
  console.log(req.params.prefix);

  if (!prefix || prefix.includes(":")) {
    return res.status(400).send({ errorMessage: "Prefix need to be passed" });
  }

  const limit = req.query.limit || 30;
  const rbpFilter = req.query.rbpFilter || undefined;

  try {
    const bGenes = await BiomartGeneModel.findOne(
      { Genename: new RegExp("^" + prefix + "$", "i") },
      { GenestableID: 1, Genename: 1, Genedescription: 1, _id: 0 }
    );
    console.log(bGenes);

    if (!bGenes) {
      return res
        .status(404)
        .send({ errorMessage: "Bio Gene Not found with prefix value" });
    }

    const gFeatUTR5 = await GeneFeaturesModel.find(
      { geneId: { $regex: bGenes.GenestableID }, feature: "UTR5" },
      { startPosition: 1, _id: 0 },
      { limit: 1, sort: { startPosition: 1 } }
    );

    console.log({ gFeatUTR5 });

    const gFeatUTR3 = await GeneFeaturesModel.find(
      { geneId: { $regex: bGenes["GenestableID"] }, feature: "UTR3" },
      { endPosition: 1, _id: 0 },
      { limit: 1, sort: { endPosition: -1 } }
    );

    console.log({ gFeatUTR3 });

    if (gFeatUTR5 && gFeatUTR5.length && gFeatUTR3 && gFeatUTR3.length) {
      const utr5Startval = +gFeatUTR5[0].startPosition;
      const utr3Endval = +gFeatUTR3[0].endPosition;

      const min = utr3Endval < utr5Startval ? utr3Endval : utr5Startval;
      const max = utr3Endval > utr5Startval ? utr3Endval : utr5Startval;
      const filter = {
        $and: [
          { startPosition: { $gte: min } },
          { endPosition: { $lte: max } },
        ],
        ...{ description4: rbpFilter },
      };
      // const rbpTargetsCount = await RbpTargetsModel.countDocuments(filter);
      const rbpTargets = await RbpTargetsModel.find(
        filter,
        {
          chromosome: 1,
          startPosition: 1,
          endPosition: 1,
          description1: 1,
          strand: 1,
          _id: 0,
        },
        { limit }
      );
      return res.status(200).send({ RBP_Site: rbpTargets });
    } else {
      return res.status(200).send({});
    }
  } catch (error) {
    return res.status(500).send({ errorMessage: error.message });
  }
};

exports.getRbpTargets = async (req, res) => {
  try {
    const rbpFilters = await RbpTargetsModel.distinct("description4");

    return res.status(200).send({ rbpChromosomes });
  } catch (error) {
    return res.status(500).send({ errorMessage: error.message });
  }
};
