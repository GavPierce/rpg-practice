class Keyboard {
  constructor() {
    this.keys = {
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false,
    };
    this.registerEventHandlers();
  }

  registerEventHandlers() {
    window.addEventListener("keydown", this.handleKeyDown.bind(this));
    window.addEventListener("keyup", this.handleKeyUp.bind(this));
  }

  handleKeyDown(event) {
    if (event.key in this.keys) {
      event.preventDefault();
      this.keys[event.key] = true;
    }
  }

  handleKeyUp(event) {
    if (event.key in this.keys) {
      event.preventDefault();
      this.keys[event.key] = false;
    }
  }
}
