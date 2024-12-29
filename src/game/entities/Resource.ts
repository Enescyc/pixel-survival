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
  private glowIntensity: number = 0;
  private glowDirection: number = 1;
  private rotation: number = Math.random() * Math.PI * 2;
  private scale: number = 0.8;
  private scaleDirection: number = 1;
  private hoverOffset: number = 0;
  private hoverSpeed: number = 0.03 + Math.random() * 0.02;

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
      [ResourceType.FOOD]: { 
        main: '#4CAF50', 
        glow: '#81C784',
        particle: '#A5D6A7'
      },
      [ResourceType.WATER]: { 
        main: '#2196F3', 
        glow: '#64B5F6',
        particle: '#90CAF9'
      },
      [ResourceType.OXYGEN]: { 
        main: '#90CAF9', 
        glow: '#BBDEFB',
        particle: '#E3F2FD'
      }
    };

    // Update effects
    this.glowIntensity += 0.05 * this.glowDirection;
    if (this.glowIntensity >= 1) this.glowDirection = -1;
    if (this.glowIntensity <= 0) this.glowDirection = 1;

    this.rotation += 0.01;
    this.scale += 0.005 * this.scaleDirection;
    if (this.scale >= 1.1) this.scaleDirection = -1;
    if (this.scale <= 0.9) this.scaleDirection = 1;

    // Hovering animation
    this.hoverOffset += this.hoverSpeed;
    const hoverY = Math.sin(this.hoverOffset) * 3;

    ctx.save();
    
    // Draw particles
    const particleCount = 3;
    for (let i = 0; i < particleCount; i++) {
      const particleOffset = (this.hoverOffset + (Math.PI * 2 * i) / particleCount) % (Math.PI * 2);
      const particleX = Math.cos(particleOffset) * 10;
      const particleY = Math.sin(particleOffset) * 5;
      
      ctx.beginPath();
      ctx.arc(
        this.x + this.width/2 + particleX,
        this.y + this.height/2 + particleY + hoverY,
        2,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = colors[this.type].particle;
      ctx.fill();
    }

    // Set up main transform
    ctx.translate(this.x + this.width/2, this.y + this.height/2 + hoverY);
    ctx.rotate(this.rotation);
    ctx.scale(this.scale, this.scale);

    // Draw outer glow
    ctx.shadowColor = colors[this.type].glow;
    ctx.shadowBlur = 15 * this.glowIntensity;
    
    // Draw main shape with double border
    ctx.beginPath();
    ctx.roundRect(-this.width/2 - 2, -this.height/2 - 2, this.width + 4, this.height + 4, 10);
    ctx.fillStyle = colors[this.type].glow;
    ctx.fill();

    ctx.beginPath();
    ctx.roundRect(-this.width/2, -this.height/2, this.width, this.height, 8);
    ctx.fillStyle = colors[this.type].main;
    ctx.fill();

    // Draw inner highlight
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.width/2);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw icon with shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetY = 2;
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const symbol = this.type === ResourceType.FOOD ? '🍎' : 
                  this.type === ResourceType.WATER ? '💧' : '🌬️';
    ctx.fillText(symbol, 0, 0);

    ctx.restore();
  }
} 