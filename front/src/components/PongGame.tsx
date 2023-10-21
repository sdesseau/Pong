import React, { useEffect, useRef, useState } from 'react';
import './PongGame.css';
import Area from './utils/Area';
import io from 'socket.io-client';

const PongGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  var socket = io('http://localhost:8001');
  const [opponentRacketPosition, setOpponentRacketPosition] = useState<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const area = new Area(canvas.width, canvas.height, 1, 2);

    // Fonction de dessin
    const draw = () => {
      
      // Effacer le contenu du canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dessiner une ligne noire autour du canvas pour la bordure
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 1;
      ctx.strokeRect(0, 0, canvas.width, canvas.height);

      // Dessiner le milieu du terrain (ligne au milieu)
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.stroke();

      const player = area.getPlayer();
      const opponent = area.getOpponent();
      const ballEntity = area.getBall();
      const racketSize = area.racketSize();
      const ballSize = area.ballSize();


      // Log des valeurs de la raquette du joueur
      console.log('Player Y:', player.getLocation().getY());
      console.log('Racket Width:', racketSize.getScaledWidth().getValue());
      console.log('Racket Height:', racketSize.getScaledHeight().getValue());
      
      // Log des valeurs de la raquette de l'opposant
      console.log('Opponent Y:', opponent.getLocation().getY());
      
      // Log des valeurs de la balle
      console.log('Ball Y:', ballEntity.getLocation().getY());
      console.log('Ball Width:', ballSize.getScaledWidth().getValue());

      // Dessiner les raquettes et la balle en utilisant les données de Area
      ctx.fillRect(player.getLocation().getX(), player.getLocation().getY(), racketSize.getScaledWidth().getValue(), racketSize.getScaledHeight().getValue());
      
      // ctx.fillRect(opponent.getLocation().getX(), opponent.getLocation().getY(), racketSize.width, racketSize.height);
      if (opponentRacketPosition !== null) {
        const opponentY = (canvas.height * opponentRacketPosition) / 100;
        ctx.fillRect(canvas.width - racketSize.getScaledWidth().getValue(), opponentY, racketSize.getScaledWidth().getValue(), racketSize.getScaledHeight().getValue());
      }

      ctx.beginPath();
      ctx.arc(ballEntity.getLocation().getX(), ballEntity.getLocation().getY(), ballSize.getScaledWidth().getValue() / 2, 0, Math.PI * 2);
      ctx.fillStyle = 'black'; // Couleur de la balle
      ctx.fill();
    };

    // Appeler la fonction de dessin
    draw();
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  // Gérer les mouvements de la raquette du client
  // const handleRacketMovement = (percent: number) => {
  //   if (socket) {
  //     socket.emit('racketMovement', percent); // Envoyer le pourcentage au serveur
  //   }
  // };

  if (socket) {
    // Écouter les mises à jour des raquettes des autres joueurs
    socket.on('racketMoved', (percent: number) => {
    });
  }
  return (
    <div className="centered-container">
      <div className="score">
        Nom 1------0 - 2-----Nom 2
      </div>
      <canvas ref={canvasRef} width={800} height={400} />
    </div>
  );
};

export default PongGame;
