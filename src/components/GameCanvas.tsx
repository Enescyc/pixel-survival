import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { Player } from '../game/entities/Player';
import { Resource, ResourceType } from '../game/entities/Resource';
import { collectResource, spawnResource, updateResources, updateGameTime } from '../store/gameSlice';
import { v4 as uuidv4 } from 'uuid';
import { ResourceBars } from './ResourceBars';
import { Menu } from './Menu';
import { GameOver } from './GameOver';
import { GameStatus } from '../store/gameSlice';

interface GameCanvasProps {
  width: number;
  height: number;
}

export const GameCanvas = ({ width, height }: GameCanvasProps) => {
  const dispatch = useDispatch();
  const { resources, score, status, gameTime } = useSelector((state: RootState) => state.game);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerRef = useRef<Player>(new Player(width / 2, height / 2));
  const keysRef = useRef<Set<string>>(new Set());
  const resourcesRef = useRef<Resource[]>([]);

  // Update resourcesRef when resources change
  useEffect(() => {
    resourcesRef.current = resources.map(r => 
      new Resource(r.id, r.x, r.y, r.type)
    );
  }, [resources]);

  // Spawn resources periodically
  useEffect(() => {
    let spawnInterval: NodeJS.Timeout | null = null;

    const spawnNewResource = () => {
      const types = [ResourceType.FOOD, ResourceType.WATER, ResourceType.OXYGEN];
      const type = types[Math.floor(Math.random() * types.length)];
      dispatch(spawnResource({
        id: uuidv4(),
        x: Math.random() * (width - 16),
        y: Math.random() * (height - 16),
        width: 24,
        height: 24,
        type
      }));
    };

    if (status === GameStatus.PLAYING) {
      // Spawn initial resources
      for (let i = 0; i < 5; i++) {
        spawnNewResource();
      }

      spawnInterval = setInterval(spawnNewResource, 2000);
    }

    return () => {
      if (spawnInterval) {
        clearInterval(spawnInterval);
      }
    };
  }, [dispatch, width, height, status]);

  // Main game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
      keysRef.current.add(e.key.toLowerCase());
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    let animationFrameId: number;

    const render = () => {
      if (status === GameStatus.PLAYING) {
        const keys = keysRef.current;
        let dx = 0;
        let dy = 0;

        if (keys.has('a') || keys.has('arrowleft')) dx -= 1;
        if (keys.has('d') || keys.has('arrowright')) dx += 1;
        if (keys.has('w') || keys.has('arrowup')) dy -= 1;
        if (keys.has('s') || keys.has('arrowdown')) dy += 1;

        playerRef.current.move(dx, dy, width, height);

        resourcesRef.current.forEach(resource => {
          if (resource.isColliding(playerRef.current)) {
            dispatch(collectResource(resource.id));
          }
        });
      }

      // Clear canvas
      ctx.fillStyle = '#2C3E50';
      ctx.fillRect(0, 0, width, height);
      
      // Draw grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      const gridSize = 32;
      
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw resources using Resource class
      resourcesRef.current.forEach(resource => {
        resource.draw(ctx);
      });
      
      // Draw player
      playerRef.current.draw(ctx);

      // Draw score
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '20px Arial';
      ctx.fillText(`Score: ${score}`, 10, 30);
      
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [width, height, resources, score, collectResource, status]);

  // Resource depletion and game timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (status === GameStatus.PLAYING) {
      interval = setInterval(() => {
        dispatch(updateResources());
        dispatch(updateGameTime());
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [dispatch, status]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border border-game-secondary bg-game-primary"
      />
      <ResourceBars />
      {status === GameStatus.MENU && <Menu />}
      {status === GameStatus.GAME_OVER && <GameOver />}
      {status === GameStatus.PLAYING && (
        <div className="absolute bottom-4 right-4 text-white text-xl font-bold">
          {Math.floor(gameTime / 60)}:{(gameTime % 60).toString().padStart(2, '0')}
        </div>
      )}
    </div>
  );
}; 