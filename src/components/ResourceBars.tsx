import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

export const ResourceBars = () => {
  const { food, water, oxygen } = useSelector((state: RootState) => state.game.playerResources);

  const getBarColor = (value: number) => {
    if (value > 66) return 'bg-green-500';
    if (value > 33) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="absolute top-4 right-4 w-48 space-y-2">
      <div className="flex items-center">
        <span className="w-16 text-white">Food:</span>
        <div className="flex-1 h-4 bg-gray-700 rounded">
          <div 
            className={`h-full rounded ${getBarColor(food)}`}
            style={{ width: `${food}%` }}
          />
        </div>
      </div>
      <div className="flex items-center">
        <span className="w-16 text-white">Water:</span>
        <div className="flex-1 h-4 bg-gray-700 rounded">
          <div 
            className={`h-full rounded ${getBarColor(water)}`}
            style={{ width: `${water}%` }}
          />
        </div>
      </div>
      <div className="flex items-center">
        <span className="w-16 text-white">Oxygen:</span>
        <div className="flex-1 h-4 bg-gray-700 rounded">
          <div 
            className={`h-full rounded ${getBarColor(oxygen)}`}
            style={{ width: `${oxygen}%` }}
          />
        </div>
      </div>
    </div>
  );
}; 