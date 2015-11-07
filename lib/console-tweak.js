const log = console.log;
console.log = function () {};

module.exports = function () {
	log.apply(console, arguments);
};
