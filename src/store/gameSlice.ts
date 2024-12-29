import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ResourceType } from '../game/entities/Resource';
import { SoundManager } from '../game/systems/SoundManager';

export enum GameStatus {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER'
}

interface ResourceState {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: ResourceType;
}

interface PlayerResources {
  food: number;
  water: number;
  oxygen: number;
}

export interface GameState {
  status: GameStatus;
  score: number;
  isPlaying: boolean;
  resources: ResourceState[];
  playerResources: PlayerResources;
  lastResourceUpdate: number;
  gameTime: number; // Time in seconds
  effects: {
    resourceCollected: boolean;
    lowResource: boolean;
  };
}

const initialState: GameState = {
  status: GameStatus.MENU,
  score: 0,
  isPlaying: false,
  resources: [],
  playerResources: {
    food: 100,
    water: 100,
    oxygen: 100
  },
  lastResourceUpdate: Date.now(),
  gameTime: 60, // Changed from 10 to 60 seconds (1 minute)
  effects: {
    resourceCollected: false,
    lowResource: false
  }
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    spawnResource: (state, action: PayloadAction<ResourceState>) => {
      state.resources.push(action.payload);
    },
    collectResource: (state, action: PayloadAction<string>) => {
      const resource = state.resources.find(r => r.id === action.payload);
      if (resource) {
        state.resources = state.resources.filter(r => r.id !== action.payload);
        state.score += 10;
        state.effects.resourceCollected = true;
        SoundManager.play('collect');

        switch (resource.type) {
          case ResourceType.FOOD:
            state.playerResources.food = Math.min(100, state.playerResources.food + 20);
            break;
          case ResourceType.WATER:
            state.playerResources.water = Math.min(100, state.playerResources.water + 20);
            break;
          case ResourceType.OXYGEN:
            state.playerResources.oxygen = Math.min(100, state.playerResources.oxygen + 20);
            break;
        }
      }
    },
    updateResources: (state) => {
      if (state.status !== GameStatus.PLAYING) return;

      const now = Date.now();
      const deltaTime = now - state.lastResourceUpdate;
      const depletionRate = 5;

      const depletion = (depletionRate * deltaTime) / 1000;

      state.playerResources.food = Math.max(0, state.playerResources.food - depletion);
      state.playerResources.water = Math.max(0, state.playerResources.water - depletion);
      state.playerResources.oxygen = Math.max(0, state.playerResources.oxygen - depletion);

      if (state.playerResources.food <= 0 || 
          state.playerResources.water <= 0 || 
          state.playerResources.oxygen <= 0) {
        state.status = GameStatus.GAME_OVER;
        SoundManager.stopBackground();
        SoundManager.play('gameOver');
        return;
      }

      const isLow = Object.values(state.playerResources).some(value => value < 30);
      if (isLow && !state.effects.lowResource) {
        state.effects.lowResource = true;
        SoundManager.play('lowResource');
      } else if (!isLow) {
        state.effects.lowResource = false;
      }

      state.lastResourceUpdate = now;
    },
    startGame: (state) => {
      state.status = GameStatus.PLAYING;
      state.score = 0;
      state.gameTime = 60;
      state.playerResources = {
        food: 100,
        water: 100,
        oxygen: 100
      };
      state.resources = [];
      state.lastResourceUpdate = Date.now();
      state.effects = {
        resourceCollected: false,
        lowResource: false
      };
      SoundManager.play('gameStart');
      SoundManager.play('background');
    },
    gameOver: (state) => {
      state.status = GameStatus.GAME_OVER;
      SoundManager.play('gameOver');
      SoundManager.stopBackground();
    },
    updateGameTime: (state) => {
      if (state.status !== GameStatus.PLAYING) return;

      state.gameTime = Math.max(0, state.gameTime - 1);
      if (state.gameTime === 0) {
        state.status = GameStatus.GAME_OVER;
        SoundManager.stopBackground();
        SoundManager.play('gameOver');
      }
    }
  }
});

export const { 
  spawnResource, 
  collectResource, 
  updateResources,
  startGame,
  gameOver,
  updateGameTime 
} = gameSlice.actions;

export default gameSlice.reducer; 