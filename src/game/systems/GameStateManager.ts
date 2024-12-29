export enum TimeOfDay {
  DAY = 'day',
  NIGHT = 'night'
}

export class GameStateManager {
  private dayDuration: number = 20000; // 20 seconds for each day/night cycle
  private timeElapsed: number = 0;
  private _isNight: boolean = false;
  private _darkness: number = 0;

  update(deltaTime: number) {
    this.timeElapsed += deltaTime;
    const cyclePosition = (this.timeElapsed % this.dayDuration) / this.dayDuration;
    
    // Smooth transition between day and night
    if (cyclePosition > 0.5) {
      this._isNight = true;
      this._darkness = Math.min((cyclePosition - 0.5) * 2, 0.5); // Max darkness of 0.5
    } else {
      this._isNight = false;
      this._darkness = Math.max(0, (0.5 - cyclePosition * 2)); // Should be 0 during day
    }

    // Ensure darkness is 0 during full daylight
    if (cyclePosition >= 0.25 && cyclePosition <= 0.5) {
      this._darkness = 0;
    }
  }

  get isNight(): boolean {
    return this._isNight;
  }

  get darkness(): number {
    return this._darkness;
  }

  get resourceDepletionRate(): number {
    return this.isNight ? 2 : 1;
  }
} 