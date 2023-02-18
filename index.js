require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { Server } = require("socket.io");
const app = express();

app.use(cors({ origin: "*" }));
app.use(express.static(path.join(__dirname, "public")));

const server = app.listen(process.env.PORT, () => {
	console.log(`Listening on port ${server.address().port}`);
});

let connected = {};
const io = new Server(server, { cors: { origin: "*" } });

setInterval(() => {
	io.emit("update", Object.values(connected));
}, 1);

io.on("connection", (socket) => {
	console.log(`New connection to the websocket with the ID ${socket.id}`);

	socket.on("moveTo", (username, coords) => {
		if (!connected[socket.id]) {
			connected[socket.id] = {
				id: socket.id,
				username,
				coords,
				color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 70%)`,
			};

			socket.emit("userData", connected[socket.id]);
			io.emit("newConnection", connected[socket.id]);
		} else {
			connected[socket.id].coords = coords;
		}
	});

	socket.on("sendMessage", (message) => {
		io.emit("newMessage", message);
	});

	socket.on("disconnect", () => {
		delete connected[socket.id];
	});
});
