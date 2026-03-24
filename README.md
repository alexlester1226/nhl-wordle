# PUCKLE 🏒

PUCKLE is a hockey-themed guessing game inspired by Wordle — but instead of guessing words, you’re guessing **NHL players**!

🕹️ **Play it here:** [puckle.org](https://alexlester.org/puckle/index.html)

---

## 🧠 How It Works

Each day, a new NHL player is secretly selected as the "answer." Your goal is to guess who it is by typing in the names of NHL players.

For each guess, you’ll get feedback by category:

| Category     | Meaning if Colored |
|--------------|--------------------|
| 🟩 Green     | Correct match      |
| 🟧 Orange    | Close (e.g., same division or ±2 years of age) |
| ⬛ Black     | No match           |

### Categories:
- **Team**: 🟧 if same division
- **Age**: 🟧 if within ±2 years
- **Height**: 🟧 if same foot height (e.g., 5'8 and 5'10)
- **Weight**: 🟧 if within ±15 lbs
- **Handedness**, **Nationality**, **Position**: 🟩 if exact match
- **Name**: 🟩 only when you've guessed the exact player

---

## 🔍 Features

- 🧠 Smart autocomplete as you type a player's name
- 📊 Visual feedback using color-coded cells
- 🔄 Reset button to start a new game
- 🔐 Mobile-friendly, fast, and privacy-respecting

---

## 📡 Data Source

All player data is sourced from the **[Sportsradar's NHL API](https://developer.sportradar.com/)** and stored in a local `all_players.json` file for performance and offline use.

---

## 🛠️ Technologies Used

- **HTML/CSS/JS** – Simple and lightweight front-end
- **JavaScript DOM Manipulation** – For interactivity
- **SportsRader's NHL V7 API** – To load player data dynamically
- **Hosted via GitHub Pages** at [puckle.org](https://puckle.org)

---

## 📬 Contact

If you have suggestions or want to contribute, feel free to reach out:

📧 Email: [contact.puckle@gmail.com](mailto:contact.puckle@gmail.com)

---

## 🙌 Credits

Made by **Alex Lester** 🏒
