"use strict";

/**
 * User sessions
 * @param {array} users
 */
var users = [];

/**
 * Find opponent for a user
 * @param {User} user
 */
function findOpponent(user) {
	for (var i = 0; i < users.length; i++) {
		if (
			user !== users[i] && 
			users[i].opponent === null
		) {
			new Game(user, users[i]).start();
		}
	}
}

/**
 * Remove user session
 * @param {User} user
 */
function removeUser(user) {
	users.splice(users.indexOf(user), 1);
}

/**
 * Game class
 * @param {User} user1
 * @param {User} user2
 */
function Game(user1, user2) {
	this.user1 = user1;
	this.user2 = user2;
}

/**
 * Start new game
 */
Game.prototype.start = function () {
	this.user1.start(this, this.user2, true);
	this.user2.start(this, this.user1, false);
}

/**
 * Is game ended
 * @return {boolean}
 */
Game.prototype.ended = function () {
	return this.user1.guess !== GUESS_NO && this.user2.guess !== GUESS_NO;
}

/**
 * Final score
 */
Game.prototype.score = function () {
	if (
		this.user1.guess === GUESS_ROCK && this.user2.guess === GUESS_SCISSORS ||
		this.user1.guess === GUESS_PAPER && this.user2.guess === GUESS_ROCK ||
		this.user1.guess === GUESS_SCISSORS && this.user2.guess === GUESS_PAPER
	) {
		this.user1.win();
		this.user2.lose();
	} else if (
		this.user2.guess === GUESS_ROCK && this.user1.guess === GUESS_SCISSORS ||
		this.user2.guess === GUESS_PAPER && this.user1.guess === GUESS_ROCK ||
		this.user2.guess === GUESS_SCISSORS && this.user1.guess === GUESS_PAPER
	) {
		this.user2.win();
		this.user1.lose();
	} else {
		this.user1.draw();
		this.user2.draw();
	}
}

/**
 * User session class
 * @param {Socket} socket
 */
function User(socket) {
	this.socket = socket;
	this.game = null;
	this.opponent = null;
	this.guess = GUESS_NO;
}

/**
 * Set guess value
 * @param {number} guess
 */
User.prototype.setGuess = function (guess) {
	if (
		!this.opponent ||
		guess <= GUESS_NO ||
		guess > GUESS_SCISSORS
	) {
		return false;
	}
	this.guess = guess;
	return true;
};

/**
 * Peer signal
 */
User.prototype.signal = function (data) {
	this.opponent.socket.emit("signal", data);
};

/**
 * Start new game
 * @param {Game} game
 * @param {User} opponent
 */
User.prototype.start = function (game, opponent, initiator) {
	this.game = game;
	this.opponent = opponent;
	this.guess = GUESS_NO;
	this.socket.emit("start", initiator);		
};

/**
 * Terminate game
 */
User.prototype.end = function () {
	this.game = null;
	this.opponent = null;
	this.guess = GUESS_NO;
	this.socket.emit("end");
};

/**
 * Trigger win event
 */
User.prototype.win = function () {
	this.socket.emit("win", this.opponent.guess);
};

/**
 * Trigger lose event
 */
User.prototype.lose = function () {
	this.socket.emit("lose", this.opponent.guess);
};

/**
 * Trigger draw event
 */
User.prototype.draw = function () {
	this.socket.emit("draw", this.opponent.guess);
};

/**
 * Socket.IO on connect event
 * @param {Socket} socket
 */
module.exports = function (socket) {
	var user = new User(socket);
	users.push(user);
	findOpponent(user);
	
	socket.on("disconnect", function () {
		console.log("Disconnected: " + socket.id);
		removeUser(user);
		if (user.opponent) {
			user.opponent.end();
			findOpponent(user.opponent);
		}
	});

	socket.on("guess", function (guess) {
		console.log("Guess: " + socket.id);
		if (user.setGuess(guess) && user.game.ended()) {
			user.game.score();
			user.game.start();
		}
	});

	socket.on("signal", function (data) {
		console.log("Signal: " + JSON.stringify(data));
		user.signal(data);
	});

	console.log("Connected: " + socket.id);
};