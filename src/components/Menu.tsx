import React from 'react';
import { useDispatch } from 'react-redux';
import { startGame } from '../store/gameSlice';

export const Menu = () => {
  const dispatch = useDispatch();

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-8">Pixel Survival</h1>
        <button
          onClick={() => dispatch(startGame())}
          className="px-8 py-3 bg-game-accent text-white rounded-lg hover:bg-opacity-90 transition"
        >
          Start Game
        </button>
      </div>
    </div>
  );
}; 