const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const canvasWidth = document.body.offsetWidth - 10;
const canvasHeight = document.body.offsetHeight - 10;
const cellSize = 5;
const rows = Math.floor(canvasHeight / cellSize);
const cols = Math.floor(canvasWidth / cellSize);

var grid = generateMatrix(rows, cols, 0);
var canvasClientRect;
var initialHue = 200;
var hueStep = 30;
var hue = initialHue;

window.onload = () => {
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;
	canvasClientRect = canvas.getBoundingClientRect();
	animate();
};

canvas.addEventListener("mousemove", (e) => onMove(e));
canvas.addEventListener("touchmove", (e) => onMove(e.touches[0]));

canvas.addEventListener("click", () => {
	hue += hueStep;
	if (hue > 360) hue = initialHue;
});

function drawSand(r, c, color) {
	ctx.beginPath();
	ctx.fillStyle = color;
	ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
	ctx.closePath();
}

function draw() {
	clearCanvas();
	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < cols; c++) {
			if (grid[r][c] > 0) {
				let color = `HSL(${grid[r][c]}, 74%, 44%)`;
				drawSand(r, c, color);
			}
		}
	}
}

function animate() {
	let newGrid = generateMatrix(rows, cols, 0);
	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < cols; c++) {
			if (grid[r][c] > 0) {
				if (grid?.[r + 1]?.[c] == 0) newGrid[r + 1][c] = hue;
				else {
					let rand = Math.random();

					if (rand > 0.75 && grid?.[r + 1]?.[c + 1] == 0)
						newGrid[r + 1][c + 1] = hue;
					else if (
						rand >= 0.5 &&
						rand <= 0.75 &&
						grid?.[r + 1]?.[c - 1] == 0
					)
						newGrid[r + 1][c - 1] = hue;
					else newGrid[r][c] = grid[r][c];
				}
			}
		}
	}

	grid = newGrid;
	draw();
	requestAnimationFrame(animate);
}

function getMouseCoordinates(e) {
	let x = Math.floor((e.clientX - canvasClientRect.left) / cellSize);
	let y = Math.floor((e.clientY - canvasClientRect.top) / cellSize);

	return { x: x, y: y };
}

function generateMatrix(rows, cols, fillValue) {
	let result = [];

	for (let r = 0; r < rows; r++) {
		result[r] = [];
		for (let c = 0; c < cols; c++) {
			result[r].push(fillValue);
		}
	}

	return result;
}

function clearCanvas() {
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}

function onMove(e) {
	let { x, y } = getMouseCoordinates(e);
	if (grid[y][x] == 0) grid[y][x] = hue;

	if (grid?.[y + 1]?.[x] == 0) grid[y + 1][x] = hue;
	if (grid?.[y - 1]?.[x] == 0) grid[y - 1][x] = hue;
	if (grid?.[y + 2]?.[x] == 0) grid[y + 2][x] = hue;
	if (grid?.[y - 2]?.[x] == 0) grid[y - 2][x] = hue;

	if (grid?.[y]?.[x + 1] == 0) grid[y][x + 1] = hue;
	if (grid?.[y]?.[x - 1] == 0) grid[y][x - 1] = hue;
	if (grid?.[y]?.[x + 2] == 0) grid[y][x + 2] = hue;
	if (grid?.[y]?.[x - 2] == 0) grid[y][x - 2] = hue;

	if (grid?.[y + 1]?.[x + 1] == 0) grid[y + 1][x + 1] = hue;
	if (grid?.[y + 1]?.[x - 1] == 0) grid[y + 1][x - 1] = hue;
	if (grid?.[y - 1]?.[x + 1] == 0) grid[y - 1][x + 1] = hue;
	if (grid?.[y - 1]?.[x - 1] == 0) grid[y - 1][x - 1] = hue;
}
