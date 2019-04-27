# API

POST requests hit this API, which then tells fadecandy to change some lights!

This was built to control individual 3d-printed "letters" - each one could be a different color.

## Configuration

We need to know what letters exist - where you've wired them, and how many LEDs each one has.

The `letters` array holds a number of objects - each one represents a letter.

- `chan`: Which output of the FadeCandy did you wire this letter to?
- `pixels`: How many LEDs are in this strand?
- `color`: For remembering what color the strand is - will be overwritten by requests, don't worry about it.

Here's the config for the test bench used while writing this.

```
let letters = [
	{
		chan: 0,
		pixels: 14,
		color: {red: 0,	green: 0, blue: 0}
	},
	{
		chan: 4,
		pixels: 14,
		color: {red: 0, green: 128, blue: 0}
	},
	{
		chan: 6,
		pixels: 7,
		color: {red: 0,	green: 0, blue: 0}
	},
	{
		chan: 7,
		pixels: 7,
		color: {red: 0, green: 128, blue: 0}
	},
];
```

## Installation

Once you've cloned this repo, use `npm install` to install the dependency (express) and then `node index.js` to run it.

By default, we're listening for commands on port `8000`

We'll forward commands to the fadecandy server - which should also be running on this machine, plugged in and ready.

## Usage

Send me a post request with the following info:

- `letter`: The index of the letter you want to change
- `red`: How much red to set?
- `green`: How much green to set?
- `blue`: How much blue to set?

These can be in any order, hell, add extra data, but these 4 gotta be there.

If your request is okay, we'll respond with `200 OK`. Otherwise, we'll repsond with `400 BAD REQUEST`.

Here's how to fire of requests with Curl:

```
curl -d '{"letter":0,"red":20,"green":200,"blue":255}' -H 'Content-Type: application/json' localhost:8000
```

And here's how to do it in js:

```js
function send(letter, r, g, b){
	var xhr = new XMLHttpRequest();
	xhr.open('POST', "http://localhost:8000", true);
	xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
	xhr.send(JSON.stringify({
		"letter": letter,
		"red": r,
		"green": g,
		"blue": b
	}));
}
send(0,20,200,255);
```

Both of the above examples will set the very first letter to a very nice color.

CORS request headers have been setup, the above JS should work in any modern browser from any domain.

## Enjoy!
