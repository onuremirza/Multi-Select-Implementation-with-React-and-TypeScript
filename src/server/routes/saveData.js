const express = require("express");
const router = express.Router();
const { data } = require("../models");

router.get("/", async (req, res) => {
  const listOfSaves = await data.findAll();
  res.json(listOfSaves);
});

router.post("/byId/:id", async (req, res) => {
  const post = req.params.id;
  await data.create({ dataId: post });
  res.json(post);
});

router.delete("/byId/:deleteId", async (req, res) => {
  const deleteId = req.params.deleteId;
  const result = await data.destroy({ where: { dataId: deleteId } });
  res.json(result);
});

module.exports = router;
