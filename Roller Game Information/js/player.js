var Player = {
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  angle: 0,
  onGround: false
};

Player.reset = function () {
  Player.x = Level.startX + (CONFIG.TILE - CONFIG.PLAYER_SIZE) / 2;
  Player.y = Level.startY + (CONFIG.TILE - CONFIG.PLAYER_SIZE) / 2;
  Player.vx = 0;
  Player.vy = 0;
  Player.angle = 0;
  Player.onGround = false;
};

Player.update = function () {
  var move = 0;

  if (Input.left) { move -= 1; }
  if (Input.right) { move += 1; }

  if (move !== 0) {
    Player.vx = move * CONFIG.MOVE_SPEED;
  } else {
    Player.vx *= 0.75;
    if (Math.abs(Player.vx) < 0.1) {
      Player.vx = 0;
    }
  }

  if (Input.jump && Player.onGround) {
    Player.vy = -CONFIG.JUMP_POWER;
    Player.onGround = false;
  }

  Player.angle += Player.vx / 10;

  var nextX = Player.x + Player.vx;
  if (!Collide.hitsSolid(nextX, Player.y, CONFIG.PLAYER_SIZE, CONFIG.PLAYER_SIZE)) {
    Player.x = nextX;
  } else {
    Player.vx = 0;
  }

  Player.vy = Math.min(Player.vy + CONFIG.GRAVITY, CONFIG.MAX_FALL);
  var nextY = Player.y + Player.vy;

  if (!Collide.hitsSolid(Player.x, nextY, CONFIG.PLAYER_SIZE, CONFIG.PLAYER_SIZE)) {
    Player.y = nextY;
    Player.onGround = false;
  } else {
    if (Player.vy > 0) {
      Player.onGround = true;
      Player.vy = 0;

      while (!Collide.hitsSolid(Player.x, Player.y + 1, CONFIG.PLAYER_SIZE, CONFIG.PLAYER_SIZE)) {
        Player.y += 1;
      }
    } else {
      Player.vy = 0;

      while (Collide.hitsSolid(Player.x, Player.y, CONFIG.PLAYER_SIZE, CONFIG.PLAYER_SIZE)) {
        Player.y += 1;
      }
    }
  }
};

Player.isDead = function () {
  var box = {
    x: Player.x,
    y: Player.y,
    width: CONFIG.PLAYER_SIZE,
    height: CONFIG.PLAYER_SIZE
  };

  if (Collide.hitsSpike(box.x, box.y, box.width, box.height)) {
    return true;
  }

  if (Player.y > CONFIG.CANVAS_H + 100) {
    return true;
  }

  if (SpikeWall.hitsPlayer()) {
    return true;
  }

  return false;
};

Player.hasWon = function () {
  return Collide.hitsFinish(Player.x, Player.y, CONFIG.PLAYER_SIZE, CONFIG.PLAYER_SIZE);
};
