import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { startGame } from '../store/gameSlice';

export const GameOver = () => {
  const dispatch = useDispatch();
  const score = useSelector((state: RootState) => state.game.score);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white mb-4">Game Over</h2>
        <p className="text-2xl text-white mb-8">Score: {score}</p>
        <button
          onClick={() => dispatch(startGame())}
          className="px-8 py-3 bg-game-accent text-white rounded-lg hover:bg-opacity-90 transition"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}; 