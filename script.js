document.getElementById('toggleSidebarBtn').addEventListener('click', function () {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('closed');
});

window.onload = function () {
  const popup = document.getElementById("popup");
  const popupMessage = document.getElementById("popupMessage");
  const popupCloseBtn = document.getElementById("popupCloseBtn");

  let players = [];
  let answer = null;

  const input = document.getElementById("playerInput");
  const suggestions = document.getElementById("suggestions");
  const tableBody = document.querySelector("#resultsTable tbody");
  const guessBtn = document.getElementById("guessBtn");
  const resetBtn = document.getElementById("resetBtn");

  const divisions = {
    "Atlantic": [
      "Boston Bruins", "Buffalo Sabres", "Detroit Red Wings", "Florida Panthers",
      "Montreal Canadiens", "Ottawa Senators", "Tampa Bay Lightning", "Toronto Maple Leafs"
    ],
    "Metropolitan": [
      "Carolina Hurricanes", "Columbus Blue Jackets", "New Jersey Devils", "New York Islanders",
      "New York Rangers", "Philadelphia Flyers", "Pittsburgh Penguins", "Washington Capitals"
    ],
    "Central": [
      "Arizona Coyotes", "Chicago Blackhawks", "Colorado Avalanche", "Dallas Stars",
      "Minnesota Wild", "Nashville Predators", "St. Louis Blues", "Winnipeg Jets"
    ],
    "Pacific": [
      "Anaheim Ducks", "Calgary Flames", "Edmonton Oilers", "Los Angeles Kings",
      "San Jose Sharks", "Seattle Kraken", "Vancouver Canucks", "Vegas Golden Knights"
    ]
  };

  function getDivision(teamName) {
    for (const division in divisions) {
      if (divisions[division].includes(teamName)) {
        return division;
      }
    }
    return null;
  }

  fetch("all_players.json")
    .then(res => res.json())
    .then(data => {
      players = data;
      initializeGame();
    });

    function initializeGame() {
      let found = false;
      while (!found) {
        const randomName = topPlayers[Math.floor(Math.random() * topPlayers.length)];
        // const randomName = "Connor McDavid";
        const match = players.find(p => p.name === randomName);
        if (match) {
          answer = match;
          found = true;
        }
      }
    
      input.value = "";
      suggestions.innerHTML = "";
    }
    

  function calculateAge(birthdate) {
    const dob = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    return age;
  }

  function getCategoryColor(category, guessVal, answerVal) {
    if (category === "team") {
      if (guessVal === answerVal) return "green";
      const guessDiv = getDivision(guessVal);
      const answerDiv = getDivision(answerVal);
      return guessDiv && guessDiv === answerDiv ? "orange" : "black";
    }

    if (category === "position") {
      if (guessVal === answerVal) return "green";
    
      const forwardPositions = ["C", "LW", "RW", "F"];
      const isGuessForward = forwardPositions.includes(guessVal);
      const isAnswerForward = forwardPositions.includes(answerVal);
    
      if (isGuessForward && isAnswerForward) return "orange";
    
      return "black";
    }
    

    if (category === "age") {
      const diff = Math.abs(guessVal - answerVal);
      return diff === 0 ? "green" : diff <= 2 ? "orange" : "black";
    }

    if (category === "height") {
      const sameFoot = Math.floor(guessVal / 12) === Math.floor(answerVal / 12);
      return guessVal === answerVal ? "green" : sameFoot ? "orange" : "black";
    }

    if (category === "weight") {
      const diff = Math.abs(guessVal - answerVal);
      return diff === 0 ? "green" : diff <= 15 ? "orange" : "black";
    }

    if (category === "handedness") {
      return guessVal === answerVal ? "green" : "black";
    }
    
    if (category === "nationality") {
      return guessVal === answerVal ? "green" : "black";
    }
    

    return "black";
  }

  input.addEventListener("input", () => {
    const query = input.value.toLowerCase();
    suggestions.innerHTML = "";

    if (query.length === 0) return;

    const matches = players.filter(player =>
      player.name.toLowerCase().includes(query)
    );

    matches.forEach(player => {
      const li = document.createElement("li");
      li.textContent = player.name;
      li.addEventListener("click", () => {
        input.value = player.name;
        suggestions.innerHTML = "";
      });
      suggestions.appendChild(li);
    });
  });

  guessBtn.addEventListener("click", () => {
    const selectedName = input.value.trim();
    const guessedPlayer = players.find(p => p.name === selectedName);
    if (!guessedPlayer) return alert("Player not found!");

    const guessAge = calculateAge(guessedPlayer.birthdate);
    const answerAge = calculateAge(answer.birthdate);

    const categories = [
      {
        key: "name",
        value: guessedPlayer.name,
        color: guessedPlayer.name === answer.name ? "green" : "black"
      },
      { key: "team", value: guessedPlayer.team, color: getCategoryColor("team", guessedPlayer.team, answer.team) },
      { key: "position", value: guessedPlayer.position, color: getCategoryColor("position", guessedPlayer.position, answer.position) },
      { key: "age", value: guessAge, color: getCategoryColor("age", guessAge, answerAge) },
      { key: "handedness", value: guessedPlayer.handedness, color: getCategoryColor("handedness", guessedPlayer.handedness, answer.handedness) },
      { key: "height", value: guessedPlayer.height, color: getCategoryColor("height", guessedPlayer.height, answer.height) },
      { key: "weight", value: guessedPlayer.weight, color: getCategoryColor("weight", guessedPlayer.weight, answer.weight) },
      { key: "nationality", value: guessedPlayer.nationality, color: getCategoryColor("nationality", guessedPlayer.nationality, answer.nationality) }
    ];

    const row = document.createElement("tr");
    categories.forEach(cat => {
      const cell = document.createElement("td");
      cell.textContent = cat.value;
      cell.classList.add(cat.color);
      row.appendChild(cell);
    });

    tableBody.appendChild(row);
  });

  resetBtn.addEventListener("click", () => {
    popupMessage.textContent = `The correct player was: ${answer.name}`;
    popup.classList.remove("hidden");
  });

  popupCloseBtn.addEventListener("click", () => {
    popup.classList.add("hidden");
    tableBody.innerHTML = "";
    initializeGame();
  });
};

const topPlayers = [
  "Nathan MacKinnon",
  "Connor McDavid",
  "Leon Draisaitl",
  "Connor Hellebuyck",
  "Cale Makar",
  "Nikita Kucherov",
  "Alex Ovechkin",
  "David Pastrnak",
  "Zach Werenski",
  "Andrei Vasilevskiy",
  "Kirill Kaprizov",
  "Jack Eichel",
  "Brady Tkachuk",
  "Auston Matthews",
  "Kyle Connor",
  "Sam Reinhart",
  "William Nylander",
  "Mark Scheifele",
  "Mitch Marner",
  "Mikko Rantanen",
  "Martin Necas",
  "Sidney Crosby",
  "Brayden Point",
  "Nick Suzuki",
  "Jason Robertson",
  "Tim Stützle",
  "Quinn Hughes",
  "Logan Thompson",
  "Victor Hedman",
  "Jake Guentzel",
  "Lane Hutson",
  "Jake Oettinger",
  "Wyatt Johnston",
  "Mackenzie Blackwood",
  "Moritz Seider",
  "Lucas Raymond",
  "Clayton Keller",
  "Brandon Hagel",
  "Matt Boldy",
  "Filip Forsberg",
  "Tom Wilson",
  "Evan Bouchard",
  "Artemi Panarin",
  "Filip Gustavsson",
  "Tage Thompson",
  "Cole Caufield",
  "Jake Sanderson",
  "Jesper Bratt",
  "Roope Hintz",
  "John Tavares",
  "Dougie Hamilton",
  "MacKenzie Weegar",
  "Sergei Bobrovsky",
  "Macklin Celebrini",
  "Josh Morrissey",
  "Sebastian Aho",
  "Valeri Nichushkin",
  "Rasmus Dahlin",
  "Darcy Kuemper",
  "Alex DeBrincat",
  "Nico Hischier",
  "Aleksander Barkov",
  "Dylan Larkin",
  "Robert Thomas",
  "Ryan Nugent-Hopkins",
  "Carter Verhaeghe",
  "Rickard Rakell",
  "Seth Jarvis",
  "Mark Stone",
  "Drake Batherson",
  "Dylan Strome",
  "Linus Ullmark",
  "Matt Duchene",
  "Jakob Chychrun",
  "Jordan Kyrou",
  "J.T. Miller",
  "Thomas Harley",
  "Frederik Andersen",
  "Dylan Guenther",
  "Anthony Stolarz",
  "Adrian Kempe",
  "Jordan Binnington",
  "Igor Shesterkin",
  "John Carlson",
  "Nikolaj Ehlers",
  "Connor Bedard",
  "Patrick Kane",
  "Logan Cooley",
  "Erik Karlsson",
  "Tomas Hertl",
  "Brandon Montour",
  "Adin Hill",
  "Mikhail Sergachev",
  "Shea Theodore",
  "Sean Monahan",
  "Kiefer Sherwood",
  "Mason McTavish",
  "Kirill Marchenko",
  "Dustin Wolf",
  "Jacob Markstrom",
  "Timo Meier",
  "Mikael Granlund",
  "Zach Hyman",
  "Travis Konecny",
  "Adam Fantilli",
  "Vincent Trocheck",
  "Mika Zibanejad",
  "Pyotr Kochetkov",
  "Alex Tuch",
  "Kevin Fiala",
  "Nazem Kadri",
  "Frank Vatrano",
  "Ilya Sorokin",
  "Brock Nelson",
  "Artturi Lehkonen",
  "Matthew Knies",
  "Andrei Svechnikov",
  "Juraj Slafkovsky",
  "Brad Marchand",
  "Pierre-Luc Dubois",
  "Joseph Woll",
  "Luke Hughes",
  "Sam Montembeault",
  "Matvei Michkov",
  "Pavel Dorofeyev",
  "Bryan Rust",
  "Adam Fox",
  "Jackson LaCombe",
  "Calvin Pickard",
  "Shayne Gostisbehere",
  "Pavel Buchnevich",
  "Dylan Cozens",
  "Quinton Byfield",
  "Anze Kopitar",
  "Taylor Hall",
  "Nick Schmaltz",
  "Mats Zuccarello",
  "JJ Peterka",
  "Bo Horvat",
  "Jonathan Huberdeau",
  "Will Smith",
  "Tyler Toffoli",
  "Boone Jenner",
  "Casey DeSmith",
  "Joel Hofer",
  "Vince Dunn",
  "Connor McMichael",
  "Cam Fowler",
  "Morgan Geekie",
  "Noah Dobson",
  "William Eklund",
  "Seth Jones",
  "Steven Stamkos",
  "Brock Boeser",
  "Zack Bolduc",
  "Kent Johnson",
  "Scott Wedgewood",
  "Joey Daccord",
  "Anders Lee",
  "Mackie Samoskevich",
  "Mason Marchment",
  "Drew Doughty",
  "Alex Pietrangelo",
  "Karel Vejmelka",
  "Jake DeBrusk",
  "Jake Neighbours",
  "Cutter Gauthier",
  "Ivan Barbashev",
  "Jake Walman",
  "Leo Carlsson",
  "Thatcher Demko",
  "Kevin Lankinen",
  "Anthony Cirelli",
  "Patrik Laine",
  "Pius Suter",
  "Cole Perfetti",
  "Devon Toews",
  "Troy Terry",
  "Brayden Schenn",
  "Ryan Donato",
  "Joel Eriksson Ek",
  "Jackson Blake",
  "Sam Bennett",
  "Jet Greaves",
  "Jake Allen",
  "Justin Faulk",
  "Matt Coronato",
  "Jamie Benn",
  "William Karlsson",
  "Ivan Demidov",
  "David Perron",
  "Ryan Leonard",
  "Andrei Kuzmenko",
  "Jimmy Snuggerud",
  "Jack Quinn",
  "James Reimer",
  "Ryan McLeod",
  "Trevor Zegras",
  "Jared McCann",
  "Elias Lindholm",
  "Neal Pionk",
  "Colton Parayko",
  "Tyler Seguin",
  "Stuart Skinner",
  "Matthew Tkachuk",
  "Dylan Holloway",
  "Aliaksei Protas",
  "Gabriel Vilardi",
  "Elias Pettersson",
  "Josh Norris",
  "Jonathan Drouin",
  "Mathew Barzal",
  "Evander Kane",
  "Jack Hughes",
  "Roman Josi",
  "Charlie McAvoy",
  "Mattias Ekholm",
  "Miro Heiskanen",
  "Kris Letang"
];
