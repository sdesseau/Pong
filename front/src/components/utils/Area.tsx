import React, { useState } from 'react';
import Racket from './Racket';
import Entity from './Entity';


// Classe Size
class Size {
  width: number;
  height: number;

  constructor(width: number = 0, height: number = 0) {
    this.width = width;
    this.height = height;
  }

  sizeFor(width: number, height: number) {
    return new Size(width, height);
  }
}
class Area {
    private size: Size;
    private opponent: Racket;
    private player: Racket;
    private ball: Entity;
  
    constructor(width: number, height: number, player_id: number, opponent_id: number) {
      this.size = new Size(width, height);
      this.player = new Racket(player_id);
      this.player.getLocation().setY(50);
  
      this.opponent = new Racket(opponent_id);
      this.opponent.getLocation().setY(50);
      this.opponent.getLocation().setToLeft(true);
  
      this.ball = new Entity();
      this.ball.getLocation().setXY(50, 50);
    }
  
    racketSize(): Size {
      return this.size.sizeFor(10, 75);
    }
  
    ballSize(): Size {
      return this.size.sizeFor(10, 13);
    }
  
    getOpponent(): Racket {
      return this.opponent;
    }
  
    getPlayer(): Racket {
      return this.player;
    }
  
    getBall(): Entity {
      return this.ball;
    }
  
    getSize(): Size {
      return this.size;
    }
  }

export default Area;