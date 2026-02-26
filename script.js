
const totalCards = 20;   
const cols = 5;
const rows = 4;

const headerH = 90;
const pad = 30;
const gap = 20;

let images = [];
let cards = [];

let firstPick = null;
let secondPick = null;
let lockBoard = false;

let tries = 0;
let matches = 0;
let backImage;

function preload() {

  backImage = loadImage("./images/back.jpeg");

  images[0] = loadImage("./images/butterfly.jpeg");
  images[1] = loadImage("./images/cat.jpeg");
  images[2] = loadImage("./images/snoopy.jpeg");
  images[3] = loadImage("./images/space.jpeg");
  images[4] = loadImage("./images/star1.jpeg");
  images[5] = loadImage("./images/star2.jpeg");
  images[6] = loadImage("./images/star3.jpeg");
  images[7] = loadImage("./images/star4.jpeg");
  images[8] = loadImage("./images/sunflower.jpeg");
  images[9] = loadImage("./images/tomato.jpeg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  buildDeck();
}

function buildDeck() {
  cards = [];
  firstPick = null;
  secondPick = null;
  lockBoard = false;

  tries = 0;
  matches = 0;

  // square size
  const gridW = width - pad * 2 - gap * (cols - 1);
  const gridH = (height - headerH) - pad * 2 - gap * (rows - 1);
  const cardSize = min(gridW / cols, gridH / rows);

  let pairIds = [];
  for (let i = 0; i < totalCards / 2; i++) {
    pairIds.push(i);
    pairIds.push(i);
  }
  shuffleArray(pairIds);

  let idx = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = pad + c * (cardSize + gap);
      const y = headerH + pad + r * (cardSize + gap);

      cards.push({
        x,
        y,
        size: cardSize,
        id: pairIds[idx],  
        faceUp: false,
        matched: false,
      });

      idx++;
      if (idx >= totalCards) break;
    }
    if (idx >= totalCards) break;
  }
}

function draw() {
  background("white");
  drawHeader();
  drawGrid();
  drawWinMessageIfDone();
}

function drawHeader() {
  noStroke();
  fill('black');
  textSize(24);
  textStyle(BOLD);
  text("Memory Game", pad, 35);

  textStyle(NORMAL);
  textSize(14);
  fill(80);
  text(`Tries: ${tries}`, pad, 60);
  text(`Matches: ${matches} / ${totalCards / 2}`, pad + 110, 60);

  stroke(220);
  line(0, headerH - 20, width, headerH - 20);
}

function drawGrid() {
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      const inset = 5;
  
      const img = (card.faceUp || card.matched)
        ? images[card.id]
        : backImage;
  
      // card base
      noStroke();
      fill('#83A24E');
      rect(card.x, card.y, card.size, card.size, 8);
  
      // image inside (smaller than the card)
      image(
        img,
        card.x + inset,
        card.y + inset,
        card.size - inset * 2,
        card.size - inset * 2
      );
  
      // border LAST (on top)
      noFill();
      stroke('#83A24E');
      strokeWeight(1);
      rect(card.x, card.y, card.size, card.size, 8);
    }
  }


function mousePressed() {
  if (lockBoard) return;

  // find clicked card
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];

    // ignore already matched or already face up
    if (card.matched || card.faceUp) continue;

    const inside =
      mouseX >= card.x &&
      mouseX <= card.x + card.size &&
      mouseY >= card.y &&
      mouseY <= card.y + card.size;

    if (!inside) continue;

    // flip it
    card.faceUp = true;

    if (firstPick === null) {
      firstPick = card;
    } else {
      secondPick = card;
      tries++;
      checkMatch();
    }

    break;
  }
}

function checkMatch() {
  if (!firstPick || !secondPick) return;

  lockBoard = true;

  if (firstPick.id === secondPick.id) {
    // match!
    firstPick.matched = true;
    secondPick.matched = true;
    matches++;

    resetPicks();
  } else {
    // not a match — flip back after a short delay
    setTimeout(() => {
      firstPick.faceUp = false;
      secondPick.faceUp = false;
      resetPicks();
    }, 700);
  }
}

function resetPicks() {
  firstPick = null;
  secondPick = null;
  lockBoard = false;
}

function drawWinMessageIfDone() {
  if (matches !== totalCards / 2) return;

  noStroke();
  fill(30);
  textSize(28);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text("You matched them all!", width / 2, headerH / 2);

  textSize(14);
  textStyle(NORMAL);
  text(`Final tries: ${tries}`, width / 2, headerH / 2 + 28);
  textAlign(LEFT, BASELINE);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buildDeck(); // rebuild layout to fit new size
}

// Shuffle all cards
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = floor(random(i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
