class Rock {
  constructor(x, y) {
    this.size = 50;
    this.x = x;
    this.y = y;
  }

  draw(ctx, viewport) {
    const rockScreenX = this.x - viewport.x;
    const rockScreenY = this.y - viewport.y;
    ctx.fillStyle = "gray";
    ctx.fillRect(rockScreenX, rockScreenY, this.size, this.size);
  }
}
