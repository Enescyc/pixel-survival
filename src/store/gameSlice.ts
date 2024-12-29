import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ResourceType } from '../game/entities/Resource';

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
  gameTime: 10 // Changed from 60 to 10 seconds
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
      const now = Date.now();
      const deltaTime = now - state.lastResourceUpdate;
      const depletionRate = 5; // Changed from 10 to 5 (slower depletion)

      const depletion = (depletionRate * deltaTime) / 1000;

      state.playerResources.food = Math.max(0, state.playerResources.food - depletion);
      state.playerResources.water = Math.max(0, state.playerResources.water - depletion);
      state.playerResources.oxygen = Math.max(0, state.playerResources.oxygen - depletion);

      // Check if any resource is depleted - trigger game over
      if (state.playerResources.food <= 0 || 
          state.playerResources.water <= 0 || 
          state.playerResources.oxygen <= 0) {
        state.status = GameStatus.GAME_OVER;
      }

      state.lastResourceUpdate = now;
    },
    startGame: (state) => {
      state.status = GameStatus.PLAYING;
      state.score = 0;
      state.gameTime = 10; // Changed from 60 to 10 seconds
      state.playerResources = {
        food: 100,
        water: 100,
        oxygen: 100
      };
      state.resources = [];
    },
    gameOver: (state) => {
      state.status = GameStatus.GAME_OVER;
    },
    updateGameTime: (state) => {
      if (state.status === GameStatus.PLAYING) {
        state.gameTime = Math.max(0, state.gameTime - 1);
        if (state.gameTime === 0) {
          state.status = GameStatus.GAME_OVER;
        }
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