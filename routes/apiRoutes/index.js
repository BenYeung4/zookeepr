//this file is to employing the Router as the other files, we are as module exported from animalRoutes.js, we are using both apiRoutes/index.js as centralhub for all routing function
const router = require("express").Router();
const animalRoutes = require("../apiRoutes/animalRoutes");

router.use(animalRoutes);

module.exports = router;
