import React from 'react';
import Entity from './Entity';

class Racket extends Entity {
  user_id: number;

  constructor(user_id: number) {
    super();
    this.user_id = user_id;
  }

  getUserId() {
    return this.user_id;
  }
}

export default Racket;
