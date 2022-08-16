const myArray = [
	{ color: 'red', number: 77, name: 'Sally' },
	{ color: 'red', number: 78, name: 'Peter' },
	{ color: 'yellow', number: 79, name: 'Jack' },
	{ color: 'blue', number: 80, name: 'Stacy' },
	{ color: 'blue', number: 80, name: 'Genna' },
];

const returnValue = myArray.filter((item) => item.color === 'red');

console.log(returnValue);
