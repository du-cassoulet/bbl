import { Hitbox } from "./Player.js";
import { elements } from "./Element.js";

export default class Renderer {
	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
	}

	render(connected) {
		this.ctx.fillStyle = "white";
		this.ctx.strokeStyle = "black";
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.textAlign = "center";
		this.ctx.textBaseline = "middle";

		for (const user of connected) {
			this.ctx.fillStyle = user.color;
			this.ctx.fillRect(
				user.coords.x - Hitbox.WIDTH / 2,
				user.coords.y - Hitbox.HEIGHT,
				Hitbox.WIDTH,
				Hitbox.HEIGHT
			);

			this.ctx.fillStyle = "white";
			this.ctx.font = "15px Kanit";

			this.ctx.fillText(
				user.username,
				user.coords.x,
				user.coords.y - Hitbox.HEIGHT - 10
			);

			this.ctx.strokeText(
				user.username,
				user.coords.x,
				user.coords.y - Hitbox.HEIGHT - 10
			);
		}

		for (const element of elements) {
			this.ctx.fillStyle = "red";
			this.ctx.fillRect(element.x, element.y, element.width, element.height);
		}
	}
}
