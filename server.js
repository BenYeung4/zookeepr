//the npm init express
const express = require("express");

//route to the front-end can request data from
const { animals } = require("./data/animals");
//instantiate the server " make it listen"
const app = express();

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

//chaining listen method to server and port, for example 82.458.45863.5633 that whole things
app.listen(3001, () => {
  console.log(`API server now on port 3001!`);
});
