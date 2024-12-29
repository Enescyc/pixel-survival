import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { GameCanvas } from './components/GameCanvas';

function App() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <h1 className="text-white text-2xl">Pixel Survival</h1>
        <GameCanvas width={800} height={600} />
      </div>
    </Provider>
  );
}

export default App; 