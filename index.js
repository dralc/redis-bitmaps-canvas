const Redis = require('ioredis');

const redis = new Redis();
redis.getBuffer('canvas', (er, res) => {
  	console.log('get:', res);
})

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
