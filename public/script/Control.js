import { exitGui, currentGui, openGui } from "./Gui.js";
import { ChatGui } from "./Chat.js";

export class Control {
	constructor(name, ...keys) {
		this.keys = keys;
		this.name = name;
	}
}

export class ControlManager {
	constructor() {
		this.controls = {};
		this.keys = {};
	}

	keyDown(key) {
		return this.keys[key] == true;
	}

	registerControl(control) {
		this.controls[control.name] = control;
	}

	isDown(name) {
		return (
			this.controls[name].keys.filter((key) => this.keyDown(key)).length > 0 &&
			currentGui == null
		);
	}
}

export function onKeyPressed(key) {
	switch (key) {
		case "Enter": {
			openGui(new ChatGui());
			break;
		}

		case "Escape": {
			exitGui();
			break;
		}
	}
}

export const controlManager = new ControlManager();

controlManager.registerControl(new Control("Up", "ArrowUp", "z"));
controlManager.registerControl(new Control("Left", "ArrowLeft", "q"));
controlManager.registerControl(new Control("Right", "ArrowRight", "d"));
