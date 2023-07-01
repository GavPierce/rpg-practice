class Viewport {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.x = 0;
    this.y = 0;
  }

  update(player, world) {
    this.x = Math.max(
      0,
      Math.min(player.x - this.width / 2, world.width - this.width)
    );
    this.y = Math.max(
      0,
      Math.min(player.y - this.height / 2, world.height - this.height)
    );
  }

  drawBackground(ctx, world) {
    const squareSize = 50;

    const startColumn = Math.floor(this.x / squareSize);
    const endColumn = Math.ceil((this.x + this.width) / squareSize);
    const startRow = Math.floor(this.y / squareSize);
    const endRow = Math.ceil((this.y + this.height) / squareSize);

    for (let col = startColumn; col < endColumn; col++) {
      for (let row = startRow; row < endRow; row++) {
        const x = col * squareSize - this.x;
        const y = row * squareSize - this.y;

        const isEven = (col + row) % 2 === 0;
        const color = isEven ? "lightgreen" : "green";

        ctx.fillStyle = color;
        ctx.fillRect(x, y, squareSize, squareSize);
      }
    }
  }
}
