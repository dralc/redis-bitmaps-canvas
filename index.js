const Redis = require('ioredis');

const redis = new Redis();

const unpack = (buf) => {
	const arr = []
	for (let byte of buf) {
		// eg. buf = <Buffer 18 52>
		// Interpret '18' and '52' as hex values. Each unit (eg. '1' and '8') are 4 bits each
		let byteHex = byte.toString(16)
		
		arr.push(
			// format each 4 bit to a binary value
			parseInt(byteHex[0]).toString(2).padStart(4, '0'),
			parseInt(byteHex[1]).toString(2).padStart(4, '0'),
		)
	}
	return arr
}

// Gets all of the canvas data in one O(1) command. Unpack the data client-side
redis.getBuffer('canvas', (er, buf) => {
	console.log('get:', buf);
	console.log('unpack:', unpack(buf))
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
	console.log('bitfield:', bitfields)
	// Format as 4 bit binary
	const binArr = bitfields.map(bf => {
		return bf.toString(2).padStart(4, '0');
	})
	console.log('binary:', binArr)
})
