//the npm init express
const express = require("express");

//route to the front-end can request data from
const { animals } = require("./data/animals");

//for Heroku
const PORT = process.env.PORT || 3001;

//instantiate the server " make it listen"
const app = express();

const fs = require("fs");
//library that works with file and directory paths
const path = require("path");

//parse incoming string or array data this and the other use with express.json is what will display on insomnia
app.use(express.urlencoded({ extended: true }));
//parse incoming JSON data. this used with the above urlencoded to display on insomnia
app.use(express.json());

//looks for servers inside the "public" folder
app.use(express.static("public"));

//function will take in re.query as an argument and filter through animals accordingly, returning new filter array
function filterByQuery(query, animalsArray) {
  let personalityTraitsArray = [];
  // Note that we save the animalsArray as filteredResults here:
  let filteredResults = animalsArray;
  if (query.personalityTraits) {
    // Save personalityTraits as a dedicated array.
    // If personalityTraits is a string, place it into a new array and save.
    if (typeof query.personalityTraits === "string") {
      personalityTraitsArray = [query.personalityTraits];
    } else {
      personalityTraitsArray = query.personalityTraits;
    }
    // Loop through each trait in the personalityTraits array:
    personalityTraitsArray.forEach((trait) => {
      // Check the trait against each animal in the filteredResults array.
      // Remember, it is initially a copy of the animalsArray,
      // but here we're updating it for each trait in the .forEach() loop.
      // For each trait being targeted by the filter, the filteredResults
      // array will then contain only the entries that contain the trait,
      // so at the end we'll have an array of animals that have every one
      // of the traits when the .forEach() loop is finished.
      filteredResults = filteredResults.filter(
        (animal) => animal.personalityTraits.indexOf(trait) !== -1
      );
    });
  }
  if (query.diet) {
    filteredResults = filteredResults.filter(
      (animal) => animal.diet === query.diet
    );
  }
  if (query.species) {
    filteredResults = filteredResults.filter(
      (animal) => animal.species === query.species
    );
  }
  if (query.name) {
    filteredResults = filteredResults.filter(
      (animal) => animal.name === query.name
    );
  }
  // return the filtered results:
  return filteredResults;
}

//takes in the id and array of animals and return a single animal object
function findById(id, animalsArray) {
  const result = animalsArray.filter((animal) => animal.id === id)[0];
  return result;
}

//accepts the post route's value, retrieves information from entry and then repost it
//using fs.writefilesync funciton method to synchronous version of fs.writefile and doesnt requrie callback, we want our animals.json file in the data subdirectory, so usting method path.jooin() to join value of __direname"which represents tthe directory of the file we excuted the code in with the animals.json path.  need too save JAVASCRIPT array data as JSON, so we stringify it.  null means we dont want to edite any of our existing data, if we did, we could pass somethgin in there.  2 dinicates we want to create white space betwen our values to make it more readable.
function createNewAnimal(body, animalsArray) {
  const animal = body;
  animalsArray.push(animal);
  fs.writeFileSync(
    path.join(__dirname, "./data/animals.json"),
    JSON.stringify({ animals: animalsArray }, null, 2)
  );
  return animal;
}

//adding route for animals, get() method requires 2 arguments, string that describes the route the client will fetch, and the second ais the call back.
app.get("/api/animals", (req, res) => {
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
app.get("/api/animals/:id", (req, res) => {
  const result = findById(req.params.id, animals);
  if (result) {
    res.json(result);
  } else {
    res.send(404);
  }
});

app.post("/api/animals", (req, res) => {
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

function validatedAnimal(animal) {
  if (!animal.name || typeof animal.name !== "string") {
    return false;
  }
  if (!animal.species || typeof animal.species !== "string") {
    return false;
  }
  if (!animal.diet || typeof animal.diet !== "string") {
    return false;
  }
  if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
    return false;
  }
  return true;
}

//always at the end, lets us push and link to the other html and what we want the public to see, will need app.use(express.static("public"));, in the top to load the corresponding page and sources propertly
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

//this route will take us to the animals folder
app.get("/animals", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/animals.html"));
});

//chaining listen method to server and port, for example 82.458.45863.5633 that whole things
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
