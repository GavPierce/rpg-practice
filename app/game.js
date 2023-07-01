const socket = io(); // Connect to the WebSocket server

class Game {
  constructor() {
    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.viewportWidth = this.canvas.width;
    this.viewportHeight = this.canvas.height;
    this.world = new World(2000, 1000);
    this.player = new Player(this.world.width / 2, this.world.height / 2);
    this.players = [];
    this.rocks = [
      new Rock(200, 100),
      new Rock(400, 300),
      new Rock(700, 200),
      new Rock(900, 400),
      new Rock(1200, 250),
      new Rock(1500, 150),
    ];
    this.viewport = new Viewport(this.viewportWidth, this.viewportHeight);
    this.keyboard = new Keyboard();
    this.registerEventHandlers();
  }
  registerEventHandlers() {
    socket.on("initialize", (initialzieData) => {
      console.log(`Player ID: ${initialzieData.playerId}`);
      for (let player of initialzieData.players) {
        let playerData = {
          id: player,
          player: new Player(
            this.world.width / 2,
            this.world.height / 2,
            "red"
          ),
        };

        this.players.push(playerData);
      }

      console.log(this.players.length);
    });
    socket.on("playerConnected", (playerId) => {
      console.log("New Player Connected", playerId);
      let playerData = {
        id: playerId,
        player: new Player(this.world.width / 2, this.world.height / 2, "red"),
      };

      this.players.push(playerData);
      console.log(this.players.length);
    });
    socket.on("playerDisconnected", (playerId) => {
      console.log("Player disonnected", playerId);

      this.players = this.players.filter(function (obj) {
        return obj.id !== playerId;
      });
      console.log(this.players.length);
    });
    // Receive movement messages from the server
    socket.on("move", (data) => {
      let player = this.players.find((obj) => {
        return obj.id === data.playerId;
      });
      player.player.movePlayer(data.direction);
    });
  }
  update() {
    this.player.update(this.keyboard.keys, this.world, this.rocks);
    this.viewport.update(this.player, this.world);
    this.draw();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.viewport.drawBackground(this.ctx, this.world);

    this.player.draw(this.ctx, this.viewport);
    for (let player of this.players) {
      player.player.draw(this.ctx, this.viewport);
    }

    for (const rock of this.rocks) {
      rock.draw(this.ctx, this.viewport);
    }
  }

  start() {
    setInterval(() => {
      this.update();
    }, 1000 / 60); // 60 frames per second
  }
}

const game = new Game();
game.start();
