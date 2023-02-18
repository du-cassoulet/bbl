import Map from "./Map.js";
import { controlManager } from "./Control.js";
import { elements } from "./Element.js";

export const Movements = {
    FRICTION_X: 0.9,
    FRICTION_Y: 0.98,
    GRAVITY: 1,
    JUMP_FORCE: 30,
    SPEED: 1.2,
}

export const Hitbox = { HEIGHT: 100, WIDTH: 50 };

export default class Player {
    constructor(x, y) {
        this.pos = { x, y };
        this.velocity = { x: 0, y: 0 };

        this.onGround = false;
        this.jumping = false;

        this.initial_pos = { x, y };
    }

    onElement() {
        let val = null;
        for (const element of elements) {
            if (
                this.pos.y >= element.y &&
                this.pos.y <= element.y + 25 &&
                this.pos.x + Hitbox.WIDTH / 2 >= element.x &&
                this.pos.x - Hitbox.WIDTH / 2 <= element.x + element.width
            ) {
                val = element;
                break;
            }
        }
    
        return val;
    }

    update() {
        if (controlManager.isDown("Up") && !this.jumping) {
			this.velocity.y = -Movements.JUMP_FORCE;
			this.jumping = true;
		}

		if (controlManager.isDown("Left")) this.velocity.x -= Movements.SPEED;
		if (controlManager.isDown("Right")) this.velocity.x += Movements.SPEED;

		this.velocity.y += Movements.GRAVITY;
		this.pos.x += this.velocity.x;
		this.pos.y += this.velocity.y;
		this.velocity.x *= Movements.FRICTION_X;
		this.velocity.y *= Movements.FRICTION_Y;

		let el = this.onElement();
		if (el && this.velocity.y > 0) {
			this.jumping = false;
			this.pos.y = el.y;
			this.velocity.y = 0;
		}

		if (this.pos.y > Map.HEIGHT * 2) {
			this.jumping = false;
			this.pos.x = this.initial_pos.x;
			this.pos.y = this.initial_pos.y;
			this.velocity.y = 0;
		}
    }
}