export default class Element {
	constructor(x, y, width, height, friction) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
        this.friction = friction;
	}
}

export const elements = [];