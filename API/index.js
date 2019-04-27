'use strict';

const express = require('express');
const OPC = require('./opc');

const client = new OPC('localhost', 7890);
const app = express();

const SAFETY = 100; // Max Brightness Percentage. (0->100)

// What letters exist? What do we know about them?
// Set the one you want to use to "letters"
// For the production letters
const lettersLetters = [
	{
		chan: 0,
		pixels: 23,
		color: {
			red: 128,
			green: 0,
			blue: 0
		}
	},
	{
		chan: 2,
		pixels: 23,
		color: {
			red: 128,
			green: 0,
			blue: 0
		}
	},
	{
		chan: 4,
		pixels: 23,
		color: {
			red: 128,
			green: 0,
			blue: 0
		}
	},
	{
		chan: 6,
		pixels: 23,
		color: {
			red: 128,
			green: 0,
			blue: 0
		}
	}
];
// For the Test bench
let letters = [
	{
		chan: 0,
		pixels: 14,
		color: {
			red: 128,
			green: 0,
			blue: 0
		}
	},
	{
		chan: 4,
		pixels: 14,
		color: {
			red: 0,
			green: 128,
			blue: 0
		}
	},
	{
		chan: 6,
		pixels: 7,
		color: {
			red: 0,
			green: 0,
			blue: 128
		}
	},
	{
		chan: 7,
		pixels: 7,
		color: {
			red: 0,
			green: 128,
			blue: 128
		}
	}
];

// Get the pixel range of the letter index.
const getRange = index => {
	// Make sure index exists
	while (index >= letters.length) {
		index -= letters.length;
	}

	// Get that letter
	const letter = letters[index];
	// Return pixel range
	return {
		low: letter.chan * 64,
		high: (letter.chan * 64) + letter.pixels
	};
};

// Convert just rgb to a color object because I'm extra
// This uses some dark magic
const rgbToColor = (r, g, b) => {
	return {
		red: r,
		green: g,
		blue: b
	};
};

// Ensure aggregate brightness (power draw) does not exceed SAFETY
const makeColorSafe = color => {
	let aggregate = color.red + color.green + color.blue;
	let maximum = 255*3*(SAFETY/100);
	if(aggregate > maximum){
		// Scale color down to meet max
		let percentage = aggregate / maximum;
		color.red /= percentage;
		color.green /= percentage;
		color.blue /= percentage;
	}
	return color;
};

// Set a range of pixels to a color
const setRangeToColor = (range, color) => {
	color = makeColorSafe(color);
	for (let i = range.low; i <= range.high; i++) {
		client.setPixel(i, color.red, color.green, color.blue);
	}
	client.writePixels();
};

// For every letter, set it to it's color.
let lastCall = 0;
const draw = ()=>{
	lastCall += 30;
	for(let letterIndex in letters){
		let letter = letters[letterIndex];
		let intensity = (Math.sin(lastCall*0.001)/2)+1;
		let newColor = {
			red: letter.color.red * intensity,
			green: letter.color.green * intensity,
			blue: letter.color.blue * intensity
		};
		setRangeToColor(getRange(letterIndex), newColor);
	}
};

setInterval(draw, 30);

// Parse request body JSON
app.use(express.json());

// Enable CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/', function(req, res){
  try {
	  let json = req.body;
      letters[json.letter].color = {
    	  red: json.red,
    	  blue: json.blue,
    	  green: json.green
      };
	  res.status(200).end();
  } catch (e) {
	  res.status(400).end();
  }
});

app.listen(8000);
