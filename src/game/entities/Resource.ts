export enum ResourceType {
  FOOD = 'FOOD',
  WATER = 'WATER',
  OXYGEN = 'OXYGEN'
}

export class Resource {
  public id: string;
  public x: number;
  public y: number;
  public width: number = 24;
  public height: number = 24;
  public type: ResourceType;

  constructor(id: string, x: number, y: number, type: ResourceType) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.type = type;
  }

  isColliding(entity: { x: number; y: number; width: number; height: number }) {
    return (
      this.x < entity.x + entity.width &&
      this.x + this.width > entity.x &&
      this.y < entity.y + entity.height &&
      this.y + this.height > entity.y
    );
  }

  draw(ctx: CanvasRenderingContext2D) {
    const colors = {
      [ResourceType.FOOD]: '#4CAF50',
      [ResourceType.WATER]: '#2196F3',
      [ResourceType.OXYGEN]: '#90CAF9'
    };
    
    ctx.fillStyle = colors[this.type];
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
} 