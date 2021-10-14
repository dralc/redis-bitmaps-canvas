const Redis = require('ioredis');

const redis = new Redis();

/**
 * Maps the 4 bit numbers in {@link buf} to 32 bit colours
 * 
 * @param {Buffer} buf
 */
const unpack = (buf, print) => {
	let arr = []
	for (let byte of buf) {
		// eg. buf = <Buffer 18 52>
		// Interpret '18' and '52' as hex values. Each unit (eg. '1' and '8') are 4 bits each
		let byteHex = byte.toString(16)

		arr.push(
			mapHexBitToColour(byteHex[0]),
			mapHexBitToColour(byteHex[1]),
		)
	}
	if (print) arr = arr.map(el => el.toString(16))
	return arr
}

/**
 * @param {String|Number} src The value to reformat to binary
 * @param {Number} bitNum The maximum number of bits to pad
 */
const toBinary = (src, bitNum) => {
	if (typeof src === 'string') src = parseInt(src);
	return src.toString(2).padStart(bitNum, '0')
}

/**
 * Maps a hex bit to a basic 32 bit colour
 *
 * @param {String} num Hex bit
 * @returns 
 */
const mapHexBitToColour = (num) => {
	const colors = {
		0: 0x000000FF, // RGBa
		1: 0xFFFFFFFF,
		2: 0xFF0000FF,
		3: 0x00FF00FF,
		4: 0x0000FFFF,
		5: 0xFFFF00FF,
		6: 0x00FFFFFF,
		7: 0xFF00FFFF,
		8: 0xC0C0C0FF,
		9: 0x808080FF,
		a: 0x800000FF,
		b: 0x808000FF,
		c: 0x008000FF,
		d: 0x800080FF,
		e: 0x008080FF,
		f: 0x000080FF,
	}

	return colors[num];
}

// Gets all of the canvas data in one O(1) command. Unpack the data client-side
redis.getBuffer('canvas', (er, buf) => {
	console.log('get:', buf);
	console.log('unpacked colours:', unpack(buf))
	console.log('unpacked colours print:', unpack(buf, true))

	//... then send to client for rendering
})

// Gets the canvas data individually with an O(4) to O(n) command.
// The data is already unpacked as [1,2,3,4]
const bfargs = [
	'get', 'u4', '#0',
	'get', 'u4', '#1',
	'get', 'u4', '#2',
	'get', 'u4', '#3',
];

redis.bitfield('canvas', bfargs, (er, bitfields) => {
	console.log('bitfields:', bitfields)
	const colours = bitfields.map(bf => {
		return mapHexBitToColour(bf.toString(16));
	})
	console.log('colours:', colours)
})
