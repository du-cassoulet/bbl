import { controlManager, onKeyPressed } from "./Control.js";
import { Chat } from "./Chat.js";
import Element, { elements } from "./Element.js";
import Player from "./Player.js";
import Map from "./Map.js";
import Renderer from "./Renderer.js";

const socket = io();

let base = 150;
let spawn = Map.HEIGHT - base - 50;

const player = new Player(Map.WIDTH / 2, spawn);

let user = null;

elements.push(new Element(base, Map.HEIGHT - base, Map.WIDTH - base * 2, 75, 0.9))
elements.push(new Element(base, Map.HEIGHT - base - 250, 400, 75, 0.9));
elements.push(new Element(Map.WIDTH - base - 400, Map.HEIGHT - base - 250, 400, 75, 0.9));

if (!window.localStorage.getItem("_un")) {
	window.localStorage.setItem(
		"_un",
		`Guest-${Math.floor(Math.random() * 8999) + 1000}`
	);
}

function getUsername() {
	return window.localStorage.getItem("_un");
}

const chat = new Chat();

const chatElement = document.getElementById("chat");
const chatInput = document.getElementById("chat-input");

const canvas = document.querySelector("canvas");
canvas.width = Map.WIDTH;
canvas.height = Map.HEIGHT;

const renderer = new Renderer(canvas);

socket.on("connect", () => {
	socket.emit("moveTo", getUsername(), { x: player.pos.x, y: player.pos.y });

	document.onkeydown = function (e) {
		if (!controlManager.keys[e.key])
			onKeyPressed(e.key);
		controlManager.keys[e.key] = true;
	};

	document.onkeyup = function (e) {
		controlManager.keys[e.key] = false;
	};

	setInterval(() => {
		player.update();

		socket.emit("moveTo", getUsername(), { x: player.pos.x, y: player.pos.y });
	}, 10);

	socket.on("update", (connected) => renderer.render(connected));
	socket.on("userData", (u) => {
		user = u;
		chatInput.style.borderLeftColor = u.color;
	});

	socket.on("newMessage", (message) => chat.send(message));
	socket.on("newConnection", (user) => {
		const eventElement = document.createElement("p");
		eventElement.classList.add("event-message");
		eventElement.textContent = `${user.username} joined the game.`;
		chat.messages.append(eventElement);
	});

	chatElement.addEventListener("submit", (e) => {
		e.preventDefault();
		if (chatInput.value === "") return;

		socket.emit("sendMessage", {
			content: chatInput.value,
			user: user,
		});

		chatInput.value = "";
	});
});
