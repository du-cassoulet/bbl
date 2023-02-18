import { Gui } from "./Gui.js";

export class ChatGui extends Gui {
    constructor() {
        super();
    }

    init() {
        document.getElementById("chat").hidden = false;
        document.getElementById("chat-input").focus();
    }

    exit() {
        document.getElementById("chat").hidden = true;
    }
}

export class Chat {
    constructor() {
        this.messages = document.getElementById("chat-messages");
    }

    send({ content, user }) {
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
        this.messages.append(messageElement);
    
        this.messages.parentElement.scrollTo({
            top: this.messages.scrollHeight,
            left: 0,
        });
    }
}