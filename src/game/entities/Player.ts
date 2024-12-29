import { store } from "../../store";


export class Player {
  public x: number;
  public y: number;
  public width: number = 32;
  public height: number = 32;
  private speed: number = 5;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  move(dx: number, dy: number, maxWidth: number, maxHeight: number) {
    const newX = this.x + dx * this.speed;
    const newY = this.y + dy * this.speed;
    
    this.x = Math.max(0, Math.min(maxWidth - this.width, newX));
    this.y = Math.max(0, Math.min(maxHeight - this.height, newY));
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
} 