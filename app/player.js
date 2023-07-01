class Player {
  constructor(x, y, color = "blue") {
    this.canMove = true; // Flag to track movement cooldown
    this.moveCooldown = 300; // Cooldown duration in milliseconds
    this.lastMoveTime = 0; // Timestamp of the last movement
    this.size = 50;
    this.x = x;
    this.y = y;
    this.color = color;
    this.hasMoved = false;
  }

  update(keys, world, rocks) {
    const squareSize = this.size;
    const timeElapsed = Date.now() - this.lastMoveTime;

    // Check if the cooldown duration has passed
    if (timeElapsed >= this.moveCooldown) {
      this.canMove = true; // Reset the cooldown flag
    }

    let newPlayerX = this.x;
    let newPlayerY = this.y;

    if (keys.ArrowUp && this.canMove) {
      this.lastMoveTime = Date.now();
      this.canMove = false; // Set the cooldown flag
      newPlayerY -= squareSize;
      this.hasMoved = true;
    } else if (keys.ArrowDown && this.canMove) {
      this.lastMoveTime = Date.now();
      this.canMove = false; // Set the cooldown flag
      newPlayerY += squareSize;
      this.hasMoved = true;
    } else if (keys.ArrowLeft && this.canMove) {
      this.lastMoveTime = Date.now();
      this.canMove = false; // Set the cooldown flag
      newPlayerX -= squareSize;
      this.hasMoved = true;
    } else if (keys.ArrowRight && this.canMove) {
      this.lastMoveTime = Date.now();
      this.canMove = false; // Set the cooldown flag
      newPlayerX += squareSize;
      this.hasMoved = true;
    }

    const collidesWithRock = rocks.some((rock) => {
      return (
        newPlayerX >= rock.x &&
        newPlayerX < rock.x + squareSize &&
        newPlayerY >= rock.y &&
        newPlayerY < rock.y + squareSize
      );
    });

    const isWithinWorldBounds =
      newPlayerX >= 0 &&
      newPlayerX + this.size <= world.width &&
      newPlayerY >= 0 &&
      newPlayerY + this.size <= world.height;

    if (!collidesWithRock && isWithinWorldBounds) {
      if (this.hasMoved) {
        socket.emit("move", this.getDirectionFromMe(newPlayerX, newPlayerY));
        this.hasMoved = false;
      }

      this.x = newPlayerX;
      this.y = newPlayerY;
    }
  }
  movePlayer(direction) {
    switch (direction) {
      case "up":
        this.y -= this.size;
        break;
      case "right":
        this.x += this.size;
        break;
      case "down":
        this.y += this.size;
        break;
      case "left":
        this.x -= this.size;
        break;
      default:
        break;
    }
  }
  draw(ctx, viewport) {
    const playerScreenX = this.x - viewport.x;
    const playerScreenY = this.y - viewport.y;
    ctx.fillStyle = this.color;
    ctx.fillRect(playerScreenX, playerScreenY, this.size, this.size);
  }
  getDirectionFromMe(targetX, targetY) {
    if (targetY < this.y) {
      return "up";
    } else if (targetY > this.y) {
      return "down";
    } else if (targetX < this.x) {
      return "left";
    } else if (targetX > this.x) {
      return "right";
    } else {
      return "same";
    }
  }
}
