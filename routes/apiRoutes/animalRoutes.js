const router = require("express").Router();
const {
  filterByQuery,
  findById,
  createNewAnimal,
  validatedAnimal,
} = require("../../lib/animals");
const { animals } = require("../../data/animals");

//adding route for animals, get() method requires 2 arguments, string that describes the route the client will fetch, and the second ais the call back.
router.get("/animals", (req, res) => {
  let results = animals;
  if (req.query) {
    results = filterByQuery(req.query, results);
  }

  //console.log(req.query);
  //the send() pushes the message to the server, while the .json shoots out what data we have on the api with the use of .json
  //res.send('hello);
  res.json(results);
});

//sending 404 error is issue
router.get("/animals/:id", (req, res) => {
  const result = findById(req.params.id, animals);
  if (result) {
    res.json(result);
  } else {
    res.send(404);
  }
});

router.post("/animals", (req, res) => {
  //req.body is where our incoming content will be
  //set id based on what the next index of the array will e, sends out the number on the ID
  req.body.id = animals.length.toString();

  //if any data in req.body is incorrect, send 400 error back
  if (!validatedAnimal(req.body)) {
    res.status(400).send("The animal is not properly formated.");
  } else {
    //add animal to json file and animals array in this function
    const animal = createNewAnimal(req.body, animals);

    res.json(animal);
  }
});

module.exports = router;
