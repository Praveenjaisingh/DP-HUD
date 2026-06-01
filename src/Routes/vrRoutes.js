const express = require("express");
const router = express.Router();
const multer = require("multer");
const vrController = require("../Controllers/vrController");
const {searchValidator, validate } = require("../Validators/vrValidator");

router.post("/home",searchValidator,validate,vrController.searchData);

module.exports =  router;

