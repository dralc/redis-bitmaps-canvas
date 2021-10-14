
/**
 * Reverses the colour code {@link hex}
 * @param {Number} hex An RGBa hex number
 * @returns The reversed hex number
 */
 const reverseHex = hex => {
	const rev = hex
		.toString(16)
		.padStart(8, '0')
		.split(/([a-f\d]{2})/gi)
		.reverse()
		.join("");

	return parseInt(rev, 16);
};

/**
 * Render {@link canvasData} to a canvas in the browser
 * 
 * Imagine a 100 x 100 pixel canvas. Each colour in the single dimension {@link canvasData}
 * will be successively drawn to a coordinate on the canvas from left to right. When the
 * {@link width} is reached, then the next pixel is drawn at x = 0, and one row down.
 * 
 * @param {String} canvasId The canvas to draw to
 * @param {Number[]} canvasData An array of hex colour codes. Each colour code is 32 bits
 * @param {Number} width The width of the canvas in pixels
 *  eg. [0x800000FF, 0xFF0000FF, 0x00FF00FF, 0x0000FFFF, ...]
 */
const renderToCanvas = (canvasId, canvasData, width) => {
	const HEX_UNITS_PER_BYTE = 4 // 4 units in a colour code
	const buf = new ArrayBuffer(canvasData.length * HEX_UNITS_PER_BYTE);
	const buf32 = new Uint32Array(buf)

	// Store colour channels in reverse order (aBGR), as the following Uint8ClampedArray will reverse it
	for (const [i, el] of canvasData.entries()) {
		buf32[i] = reverseHex(el)
	}

	const buf8 = new Uint8ClampedArray(buf)
	const canvas = document.getElementById(canvasId);
	const ctx = canvas.getContext('2d');
	const imageDat = new ImageData(buf8, width)
	ctx.putImageData(imageDat, 0, 0)
}


function* generatePixels(array, repeat) {
	let count = 0 
	let arIndex = -1;
	const max = (array.length) * repeat; //?

	while (count < max) {
		if ((array.length - 1) === 0 || arIndex / (array.length - 1) === 1) {
			arIndex = -1;
		}
		yield array[++arIndex]
		count++
	}
}

const it = generatePixels([0xff0000ff, 0xff0000ff, 0x00ff00ff, 0x00ff00ff, 0x0000ffff, 0x0000ffff], 42000)
const canvasData = Array.from(it)
console.log(canvasData)
renderToCanvas("canvas1", canvasData, 500);
