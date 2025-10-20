Minesweeper Game

A classic Minesweeper game implemented with HTML, CSS, and JavaScript. The game includes multiple difficulty levels, timer, flagging functionality, sound effects, and a dark mode toggle. Clicking on a cell reveals only that cell (no recursive reveal).

Features

Three difficulty levels: Easy, Medium, Hard (adjusts board size and bomb count)

Timer: Starts on the first reveal, stops on win or game over

Flagging: Right-click or press "F" key to flag/unflag bombs

Sound effects: For clicks, flags, and bombs

Dark mode toggle

Accessible: Keyboard navigation and controls supported

Single cell reveal: Clicking reveals only the clicked cell, no automatic flood reveal

How to Play

Select your desired difficulty from the dropdown.

Click on cells to reveal what’s underneath:

If it’s a bomb, the game ends.

If not, it shows the number of adjacent bombs or remains empty if none.

Right-click or press "F" on a cell to flag/unflag it as a suspected bomb.

Reveal all non-bomb cells to win the game.

Use the Reset button to start a new game at any time.

Toggle dark mode with the button.

Running the Game

Download or clone the repository.

Open the index.html file in any modern web browser (Chrome, Firefox, Edge, Safari).

Enjoy playing!

File Structure

index.html — Main HTML page with the game layout.

styles.css — CSS styles and animations.

script.js — JavaScript logic for game behavior.

sounds/ — Sound effect files (optional; or embedded in HTML).

Customization

Adjust difficulty settings in the dropdown menu.

Modify CSS to change colors, animations, or layout.

Extend JavaScript for features like leaderboard, advanced flood reveal, hints, etc.

Credits

Created by Muwaz Khan
Inspired by the classic Minesweeper game.