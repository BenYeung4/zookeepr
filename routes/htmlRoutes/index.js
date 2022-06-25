const router = require("express").Router();
const path = require("path");

//always at the end, lets us push and link to the other html and what we want the public to see, will need app.use(express.static("public"));, in the top to load the corresponding page and sources propertly
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/index.html"));
});

//this route will take us to the animals folder
router.get("/animals", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/animals.html"));
});

//route will take us to the zookeepers folder
router.get("/zookeepers", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/zookeepers.html"));
});

//this route is the wild card route, that serves when user enters a /asd;fkljadfkl whatever it is and there is no page for it, practially sends the user back to th main page
router.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/index.html"));
});

module.exports = router;
