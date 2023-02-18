const socket = io();

class Element {
	constructor(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
}

let width = 1920;
let height = 970;
let chatVisible = false;
let user = null;
let base = 150;
let x = width / 2;
let spawn = height - base - 50;
let y = spawn;
let xv = 0;
let yv = 0;
let xfriction = 0.9;
let yfriction = 0.98;
let gravity = 1;
let jumpForce = 30;
let speed = 1.2;

let player = { height: 100, width: 50 };

let elements = [
	new Element(base, height - base, width - base * 2, 75),
	new Element(base, height - base - 250, 400, 75),
	new Element(width - base - 400, height - base - 250, 400, 75),
];

if (!window.localStorage.getItem("_un")) {
	window.localStorage.setItem(
		"_un",
		`Guest-${Math.floor(Math.random() * 8999) + 1000}`
	);
}

function getUsername() {
	return window.localStorage.getItem("_un");
}

const chat = document.getElementById("chat");
const chatInput = document.getElementById("chat-input");
const chatMessages = document.getElementById("chat-messages");

const canvas = document.querySelector("canvas");
canvas.width = width;
canvas.height = height;

const ctx = canvas.getContext("2d");

function setCanvas(connected) {
	ctx.fillStyle = "white";
	ctx.strokeStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";

	for (const user of connected) {
		ctx.fillStyle = user.color;
		ctx.fillRect(
			user.coords.x - player.width / 2,
			user.coords.y - player.height,
			player.width,
			player.height
		);

		ctx.fillStyle = "white";
		ctx.font = "15px Kanit";

		ctx.fillText(
			user.username,
			user.coords.x,
			user.coords.y - player.height - 10
		);

		ctx.strokeText(
			user.username,
			user.coords.x,
			user.coords.y - player.height - 10
		);
	}

	for (const element of elements) {
		ctx.fillStyle = "red";
		ctx.fillRect(element.x, element.y, element.width, element.height);
	}
}

let up = false;
let left = false;
let right = false;
let jumping = false;

let lookTo = { up: false, down: false, left: false, right: false };

function sendMessage({ content, user }) {
	const messageElement = document.createElement("div");
	const usernameElement = document.createElement("p");
	const contentElement = document.createElement("p");

	messageElement.classList.add("message");
	usernameElement.classList.add("username");
	contentElement.classList.add("content");

	contentElement.textContent = content;
	usernameElement.textContent = user.username;

	usernameElement.style.borderLeftColor = user.color;

	messageElement.append(usernameElement);
	messageElement.append(contentElement);
	chatMessages.append(messageElement);

	chatMessages.parentElement.scrollTo({
		top: chatMessages.scrollHeight,
		left: 0,
	});
}

function onElement() {
	let val = null;
	for (const element of elements) {
		if (
			y >= element.y &&
			y <= element.y + 25 &&
			x + player.width / 2 >= element.x &&
			x - player.width / 2 <= element.x + element.width
		) {
			val = element;
			break;
		}
	}

	return val;
}

socket.on("connect", () => {
	socket.emit("moveTo", getUsername(), { x, y });

	document.onkeydown = function (e) {
		switch (e.key) {
			case "z":
			case "ArrowUp":
				up = true;
				break;

			case "q":
			case "ArrowLeft":
				left = true;
				break;

			case "d":
			case "ArrowRight":
				right = true;
				break;

			case "Enter": {
				document.getElementById("chat").hidden = false;
				document.getElementById("chat-input").focus();
				break;
			}

			case "Escape": {
				document.getElementById("chat").hidden = true;
				break;
			}
		}
	};

	document.onkeyup = function (e) {
		switch (e.key) {
			case "z":
			case "ArrowUp":
				up = false;
				break;

			case "q":
			case "ArrowLeft":
				left = false;
				break;

			case "d":
			case "ArrowRight":
				right = false;
				break;
		}
	};

	setInterval(() => {
		if (up && !jumping) {
			yv = -jumpForce;
			jumping = true;
		}

		if (left) xv -= speed;
		if (right) xv += speed;

		yv += gravity;
		x += xv;
		y += yv;
		xv *= xfriction;
		yv *= yfriction;

		el = onElement();
		if (el) {
			jumping = false;
			y = el.y;
			yv = 0;
		}

		if (y > height * 2) {
			jumping = false;
			y = spawn;
			x = width / 2;
			yv = 0;
		}

		socket.emit("moveTo", getUsername(), { x, y });
	}, 10);

	socket.on("update", setCanvas);
	socket.on("userData", (u) => {
		user = u;
		chatInput.style.borderLeftColor = u.color;
	});

	socket.on("newMessage", sendMessage);
	socket.on("newConnection", (user) => {
		const eventElement = document.createElement("p");
		eventElement.classList.add("event-message");
		eventElement.textContent = `${user.username} joined the game.`;
		chatMessages.append(eventElement);
	});

	chat.addEventListener("submit", (e) => {
		e.preventDefault();
		if (chatInput.value === "") return;

		socket.emit("sendMessage", {
			content: chatInput.value,
			user: user,
		});

		chatInput.value = "";
	});
});
