document.getElementById('toggleSidebarBtn').addEventListener('click', function () {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('closed');
  });
  

  window.onload = function () {
    let players = [];
  let answer = null;
  
  const input = document.getElementById("playerInput");
  const suggestions = document.getElementById("suggestions");
  const tableBody = document.querySelector("#resultsTable tbody");
  const guessBtn = document.getElementById("guessBtn");
  const resetBtn = document.getElementById("resetBtn");
  
  // Fetch data and initialize
  fetch("all_players.json")
    .then(res => res.json())
    .then(data => {
      players = data;
      initializeGame();
    });
  
  function initializeGame() {
    answer = players[Math.floor(Math.random() * players.length)];
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
    if (["team", "position", "handedness", "nationality"].includes(category))
      return guessVal === answerVal ? "green" : "black";
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
    return "black";
  }
  
  // Autocomplete behavior
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
  
  // Guess button handler
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
  
  // Reset button
  resetBtn.addEventListener("click", () => {
    tableBody.innerHTML = "";
    initializeGame();
  });
  
    
  };
  