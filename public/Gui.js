export class Gui {
    constructor() {}
    render() {}
    exit() {}
    init() {}
}

export var currentGui = null;

export function openGui(gui) {
	currentGui = gui;
	currentGui.init();
}

export function exitGui() {
	if (currentGui != null) {
		currentGui.exit();
		currentGui = null;
	}
}