const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const canvasWidth = document.body.offsetWidth - 10;
const canvasHeight = document.body.offsetHeight - 10;

var cellSize = 4;
var rows = Math.floor(canvasHeight / cellSize);
var cols = Math.floor(canvasWidth / cellSize);
var grid = generateMatrix(rows, cols, 0);
var canvasClientRect;
var minHue = 1;
var maxHue = 360;
var hueStep = 30;
var hue = minHue;
var hueStep = 0.5;
var spots = [];
var polygonSize = 6;

window.onload = () => {
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;
	canvasClientRect = canvas.getBoundingClientRect();

	spots = polygon(polygonSize);
	animate();
};

canvas.addEventListener("mousemove", (e) => onMove(e));
canvas.addEventListener("touchmove", (e) => onMove(e.touches[0]));

function drawSand(r, c, color) {
	ctx.beginPath();
	ctx.fillStyle = color;
	ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
	ctx.closePath();
}

function draw() {
	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < cols; c++) {
			if (grid[r][c] > 0) {
				drawSand(r, c, `HSL(${grid[r][c]}, 74%, 44%)`);
			}
		}
	}
}

function animate() {
	clearCanvas();
	let newGrid = generateMatrix(rows, cols, 0);

	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < cols; c++) {
			if (grid[r][c] > 0) {
				if (grid[r + 1]?.[c] == 0) newGrid[r + 1][c] = grid[r][c];
				else {
					let rand = Math.random();

					if (rand > 0.75 && grid[r + 1]?.[c - 1] == 0) newGrid[r + 1][c - 1] = grid[r][c];
					else if (rand >= 0.5 && rand <= 0.75 && grid[r + 1]?.[c + 1] == 0) newGrid[r + 1][c + 1] = grid[r][c];
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
	let x = e.clientX - canvasClientRect.left;
	let y = e.clientY - canvasClientRect.top;
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

	let c = Math.floor(x / cellSize);
	let r = Math.floor(y / cellSize);

	for (let spot of spots) {
		let { r: kr, c: kc } = spot;

		if (grid?.[r + kr]?.[c + kc] == 0) grid[r + kr][c + kc] = hue;
	}

	hue += hueStep;
	if (hue > maxHue) hue = minHue;
}

function polygon(size) {
	let result = [];
	let n = size * 2 - 1;
	let idx = 0;

	for (let r = 0; r < n; r++) {
		for (let c = size - 1 - idx; c <= size - 1 + idx; c++) {
			let y = r == size - 1 ? 0 : r - size + 1;
			let x = c == size - 1 ? 0 : c - size + 1;

			result.push({ r: y, c: x });
		}

		if (r + 1 >= size) idx--;
		else idx++;
	}

	return result;
}
