export class SoundManager {
  private static sounds: { [key: string]: HTMLAudioElement } = {};
  private static initialized = false;

  static initialize() {
    if (this.initialized) return;

    this.sounds = {
      collect: new Audio('/sounds/collect.mp3'),
      gameOver: new Audio('/sounds/game-over.mp3'),
      lowResource: new Audio('/sounds/low-resource.mp3'),
      gameStart: new Audio('/sounds/game-start.mp3'),
      background: new Audio('/sounds/background.mp3')
    };

    // Configure background music
    this.sounds.background.loop = true;
    this.sounds.background.volume = 0.1;
    
    // Set lower volume for effects
    this.sounds.collect.volume = 0.4;
    this.sounds.gameOver.volume = 0.5;
    this.sounds.lowResource.volume = 0.3;
    this.sounds.gameStart.volume = 0.4;

    this.initialized = true;
  }

  static play(soundName: 'collect' | 'gameOver' | 'lowResource' | 'gameStart' | 'background') {
    if (!this.initialized) this.initialize();
    
    const sound = this.sounds[soundName];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(() => {
        // Handle autoplay restrictions
        console.log('Audio playback failed');
      });
    }
  }

  static stopBackground() {
    if (this.sounds.background) {
      this.sounds.background.pause();
      this.sounds.background.currentTime = 0;
    }
  }
} 