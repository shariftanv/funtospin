// Confetti Setup
const confettiCanvas = document.getElementById('confetti-canvas');
const confettiCtx = confettiCanvas.getContext('2d');
confettiCanvas.width = window.innerWidth;
confettiCanvas.height = window.innerHeight;

class ConfettiParticle {
  constructor() {
    this.x = Math.random() * confettiCanvas.width;
    this.y = Math.random() * confettiCanvas.height - confettiCanvas.height;
    this.size = Math.random() * 8 + 4;
    this.speed = Math.random() * 3 + 2;
    this.angle = Math.random() * 2 * Math.PI;
    this.spin = (Math.random() - 0.5) * 0.1;
    this.color = `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;
  }
  update() {
    this.y += this.speed;
    this.angle += this.spin;
    if (this.y > confettiCanvas.height) {
      this.y = -this.size;
      this.x = Math.random() * confettiCanvas.width;
    }
  }
  draw() {
    confettiCtx.save();
    confettiCtx.translate(this.x, this.y);
    confettiCtx.rotate(this.angle);
    confettiCtx.fillStyle = this.color;
    confettiCtx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    confettiCtx.restore();
  }
}

let confettiParticles = [];
function startConfetti() {
  confettiParticles = [];
  for (let i = 0; i < 150; i++) {
    confettiParticles.push(new ConfettiParticle());
  }
  confettiLoop();
}

function confettiLoop() {
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confettiParticles.forEach((p) => {
    p.update();
    p.draw();
  });
  if (confettiParticles.length > 0) {
    requestAnimationFrame(confettiLoop);
  }
}

function stopConfetti() {
  confettiParticles = [];
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
}

// Wheel Logic
const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const size = canvas.width;
const center = size / 2;
let segments = [];
let segmentCount = 0;
let segmentAngle = 0;
let startAngle = 0;
let isSpinning = false;
let spinAngle = 0;
let spinVelocity = 0;

const spinSound = new Audio('https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg');
const winSound = new Audio('https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg');

function drawWheel() {
  ctx.clearRect(0, 0, size, size);
  for (let i = 0; i < segmentCount; i++) {
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.arc(center, center, center - 10, startAngle + i * segmentAngle, startAngle + (i + 1) * segmentAngle);
    ctx.fillStyle = i % 2 === 0 ? '#FFCE54' : '#FC6E51';
    ctx.fill();
    ctx.stroke();

    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(startAngle + i * segmentAngle + segmentAngle / 2);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#000';
    ctx.font = 'bold 16px Arial';
    ctx.fillText(segments[i], center - 20, 10);
    ctx.restore();
  }

  // Center Circle
  ctx.beginPath();
  ctx.arc(center, center, 30, 0, 2 * Math.PI);
  ctx.fillStyle = '#FFF';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.stroke();

  // Pointer
  ctx.fillStyle = 'red';
  ctx.beginPath();
  ctx.moveTo(center, 10);
  ctx.lineTo(center - 15, 40);
  ctx.lineTo(center + 15, 40);
  ctx.closePath();
  ctx.fill();
}

function spin() {
  if (isSpinning || segmentCount === 0) return;

  isSpinning = true;
  spinSound.play();
  spinVelocity = Math.random() * 0.3 + 0.4;

  function animate() {
    spinAngle += spinVelocity;
    spinVelocity *= 0.97;
    startAngle = spinAngle % (2 * Math.PI);
    drawWheel();

    if (spinVelocity > 0.002) {
      requestAnimationFrame(animate);
    } else {
      isSpinning = false;
      winSound.play();
      const pointerAngle = (2 * Math.PI - startAngle + segmentAngle / 2) % (2 * Math.PI);
      let selectedIndex = Math.floor(pointerAngle / segmentAngle);
      selectedIndex = (segmentCount - 1 - selectedIndex + segmentCount) % segmentCount;

      // You can alert or display the result here if you want
      // alert(`You got: ${segments[selectedIndex]}`);

      startConfetti();
      setTimeout(stopConfetti, 4000);
    }
  }
  animate();
}

function loadWheel(options) {
  segments = options;
  segmentCount = segments.length;
  segmentAngle = 2 * Math.PI / segmentCount;
  startAngle = 0;
  spinAngle = 0;
  drawWheel();
}

const presetWheels = {
  fruits: ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape', 'Honeydew'],
  colors: ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange'],
  party: ['Dance', 'Sing', 'Tell a joke', 'Do 10 push-ups', 'Share a secret', 'High five'],
  food: ['Pizza', 'Burger', 'Sushi', 'Pasta', 'Salad', 'Tacos', 'Steak'],
  activities: ['Go for a walk', 'Read a book', 'Watch a movie', 'Cook dinner', 'Meditate', 'Call a friend'],
  travelDestinations: ['Paris', 'Tokyo', 'New York', 'Sydney', 'Rome', 'Cape Town', 'Rio de Janeiro'],
  workout: ['Push-ups', 'Squats', 'Jumping Jacks', 'Plank', 'Burpees', 'Lunges'],
  decisions: ['Yes', 'No', 'Maybe', 'Ask again', 'Definitely', 'Not sure'],
};

const presetSelect = document.getElementById('presetWheels');
const customOptionsInput = document.getElementById('customOptions');
const loadWheelButton = document.getElementById('loadWheel');
const spinButton = document.getElementById('spin');

presetSelect.addEventListener('change', (e) => {
  const val = e.target.value;
  if (val && presetWheels[val]) {
    loadWheel(presetWheels[val]);
    customOptionsInput.value = presetWheels[val].join(', ');
  }
});

loadWheelButton.addEventListener('click', () => {
  const customText = customOptionsInput.value.trim();
  if (customText) {
    const options = customText.split(',').map((s) => s.trim()).filter((s) => s);
    if (options.length < 2) {
      alert('Please enter at least two options separated by commas.');
      return;
    }
    loadWheel(options);
  } else {
    alert('Please enter custom options or select a preset.');
  }
});

spinButton.addEventListener('click', spin);

// Initial default wheel
loadWheel(presetWheels['fruits']);
customOptionsInput.value = presetWheels['fruits'].join(', ');
