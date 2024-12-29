import { store } from "../../store";


export class Player {
  public x: number;
  public y: number;
  public width: number = 32;
  public height: number = 32;
  private speed: number = 5;
  private trailPoints: Array<{x: number, y: number, dx: number, dy: number}> = [];
  private hue: number = 0;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  move(dx: number, dy: number, maxWidth: number, maxHeight: number) {
    const newX = this.x + dx * this.speed;
    const newY = this.y + dy * this.speed;
    
    this.x = Math.max(0, Math.min(maxWidth - this.width, newX));
    this.y = Math.max(0, Math.min(maxHeight - this.height, newY));

    // Store movement for trail effect
    if (dx !== 0 || dy !== 0) {
      this.trailPoints.unshift({ x: this.x, y: this.y, dx, dy });
      if (this.trailPoints.length > 10) this.trailPoints.pop();
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Update color cycling
    this.hue = (this.hue + 1) % 360;

    // Draw trail
    ctx.save();
    this.trailPoints.forEach((point, index) => {
      const alpha = (1 - index / this.trailPoints.length) * 0.3;
      const size = this.width * (1 - index / this.trailPoints.length);
      
      ctx.fillStyle = `hsla(${this.hue}, 70%, 60%, ${alpha})`;
      ctx.beginPath();
      ctx.roundRect(
        point.x + (this.width - size)/2,
        point.y + (this.height - size)/2,
        size,
        size,
        8
      );
      ctx.fill();
    });
    ctx.restore();

    // Draw player
    ctx.save();
    
    // Draw glow
    ctx.shadowColor = `hsl(${this.hue}, 70%, 60%)`;
    ctx.shadowBlur = 15;

    // Draw main shape
    ctx.beginPath();
    ctx.roundRect(this.x, this.y, this.width, this.height, 8);
    ctx.fillStyle = `hsl(${this.hue}, 70%, 50%)`;
    ctx.fill();

    // Draw highlight
    const gradient = ctx.createLinearGradient(
      this.x, this.y,
      this.x + this.width, this.y + this.height
    );
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.restore();
  }
} 