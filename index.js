const fs = require("fs");
require.extensions[".txt"] = function (module, filename) {
  module.exports = fs.readFileSync(filename, "utf8");
};

var names = require("./data/full-names.txt").split("\r\n");

const getNames = (word, index = 0) => {
  const arr = [];
  [...word].map((letter) => {
    const lowercaseLetter = (letter || "").toLowerCase();
    const tempNames = names.filter(
      (name) => (name[index] || "").toLowerCase() === lowercaseLetter
    );
    const randomIndex = Math.floor(Math.random() * tempNames.length);
    const name = tempNames[randomIndex];
    arr.push(name);
  });

  const hasErrors = arr.filter((name) => name === undefined);
  if (hasErrors.length) {
    console.log("has errors: ", hasErrors);
    throw "Cannot generate names from code word.";
  }

  return arr;
};

const getFakeNames = (count = 0) => {
  const arr = [];

  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * names.length);
    const randomName = names[randomIndex];

    arr.push(randomName);
  }

  return arr;
};

const mergeNameLists = (names, fakeNames) => {
  const arr = [];
  const tempNames = [...names];
  const tempFakeNames = [...fakeNames];

  while (tempNames.length > 0 || tempFakeNames.length > 0) {
    const temp =
      Math.floor(Math.random() * 100) % 2 === 1 ? tempNames : tempFakeNames;
    const name = temp.shift();
    name && arr.push(name);
  }

  return arr;
};

const letterToIndex = (letter) => {
  return parseInt(letter, 36) - 9;
};

const indexToLetter = (index) => {
  return (parseInt(index, 36) + 9).toString(36);
};

const outputNames = (codeword, index, names) => {
  const position = parseInt(index) + 1;
  console.log(
    `\nThe codeword "${codeword.toUpperCase()}" is in the ${position} (${indexToLetter(
      position
    )}) character position in the following list of names:\n`
  );
  names.map((name) => console.log(name));
  console.log("");
};

// Command line code
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("What is the code word? ", function (word) {
  rl.question("What is the index? ", function (index) {
    rl.question("How many fake names? ", function (fakeNameCount) {
      const codeNames = getNames(word, index);
      const fakeNames = getFakeNames(fakeNameCount);
      const nameList = mergeNameLists(codeNames, fakeNames);
      outputNames(word, index, nameList);
      rl.close();
    });
  });
});

rl.on("close", function () {
  process.exit(0);
});
