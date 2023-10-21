import React, { useEffect, useRef, useState } from 'react';
import './PongGame.css';
import Area from './utils/Area';
import io from 'socket.io-client';

const PongGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ball = { x: 0, y: 0, radius: 10 }; // Coordonnées de la balle et son rayon
  var socket = io('http://localhost:8001');
  const [opponentRacketPosition, setOpponentRacketPosition] = useState<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Établir une connexion WebSocket avec le serveur
    // const newSocket = io('http://localhost:8001'); // Remplacez par l'URL du serveur WebSocket

    // Gérer les messages reçus du serveur
    socket.on('message', (data) => {
      console.log(data);
    });

    // setSocket(socket);


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
      console.log('Racket Width:', racketSize.width);
      console.log('Racket Height:', racketSize.height);
      
      // Log des valeurs de la raquette de l'opposant
      console.log('Opponent Y:', opponent.getLocation().getY());
      
      // Log des valeurs de la balle
      console.log('Ball Y:', ballEntity.getLocation().getY());
      console.log('Ball Width:', ballSize.width);

      // Dessiner les raquettes et la balle en utilisant les données de Area
      ctx.fillRect(player.getLocation().getX(), player.getLocation().getY(), racketSize.width, racketSize.height);
      
      // ctx.fillRect(opponent.getLocation().getX(), opponent.getLocation().getY(), racketSize.width, racketSize.height);
      if (opponentRacketPosition !== null) {
        const opponentY = (canvas.height * opponentRacketPosition) / 100;
        ctx.fillRect(canvas.width - racketSize.width, opponentY, racketSize.width, racketSize.height);
      }

      ctx.beginPath();
      ctx.arc(ballEntity.getLocation().getX(), ballEntity.getLocation().getY(), ballSize.width / 2, 0, Math.PI * 2);
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
  const handleRacketMovement = (percent: number) => {
    if (socket) {
      socket.emit('racketMovement', percent); // Envoyer le pourcentage au serveur
    }
  };

  if (socket) {
    // Écouter les mises à jour des raquettes des autres joueurs
    socket.on('racketMoved', (percent: number) => {
      // Mettez à jour l'affichage avec la nouvelle position de la raquette de l'adversaire
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