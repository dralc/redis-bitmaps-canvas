const Redis = require('ioredis');

const redis = new Redis();

/**
 * Reformats {@link buf} to binary
 * @param {Buffer} buf
 */
const unpack = (buf) => {
	const arr = []
	for (let byte of buf) {
		// eg. buf = <Buffer 18 52>
		// Interpret '18' and '52' as hex values. Each unit (eg. '1' and '8') are 4 bits each
		let byteHex = byte.toString(16)
		
		arr.push(
			mapHexBitToColour(byteHex[0]),
			mapHexBitToColour(byteHex[1]),
		)
	}
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
		0: '000000FF',
		1: 'FFFFFFFF',
		2: 'FF0000FF',
		3: '00FF00FF',
		4: '0000FFFF',
		5: 'FFFF00FF',
		6: '00FFFFFF',
		7: 'FF00FFFF',
		8: 'C0C0C0FF',
  		9: '808080FF',
		a: '800000FF',
		b: '808000FF',
		c: '008000FF',
		d: '800080FF',
  		e: '008080FF',
  		f: '000080FF',
	}

	return colors[num];
}

// Gets all of the canvas data in one O(1) command. Unpack the data client-side
redis.getBuffer('canvas', (er, buf) => {
	console.log('get:', buf);
	console.log('unpacked colours:', unpack(buf))
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
