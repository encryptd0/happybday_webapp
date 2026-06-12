/* Tiny dependency-free confetti on a full-screen canvas. */
(function () {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  const COLORS = ['#ff6b9d', '#ffd166', '#9b5de5', '#00d4ff', '#ff8fab', '#f15bb5', '#fee440'];
  let pieces = [];
  let running = false;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function makePiece(burstX, burstY) {
    const fromBurst = burstX !== undefined;
    return {
      x: fromBurst ? burstX : Math.random() * canvas.width,
      y: fromBurst ? burstY : -20 - Math.random() * canvas.height * 0.5,
      vx: fromBurst ? (Math.random() - 0.5) * 12 : (Math.random() - 0.5) * 2,
      vy: fromBurst ? -Math.random() * 10 - 2 : Math.random() * 2 + 1.5,
      size: Math.random() * 8 + 4,
      color: COLORS[(Math.random() * COLORS.length) | 0],
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.3,
      shape: Math.random() < 0.15 ? 'heart' : 'rect',
      life: 1
    };
  }

  function drawHeart(p) {
    ctx.font = `${p.size * 1.6}px serif`;
    ctx.fillStyle = p.color;
    ctx.fillText('❤', -p.size / 2, p.size / 2);
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach((p) => {
      p.vy += 0.12;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life -= 0.002;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = Math.max(p.life, 0);
      if (p.shape === 'heart') {
        drawHeart(p);
      } else {
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      }
      ctx.restore();
    });
    pieces = pieces.filter((p) => p.y < canvas.height + 40 && p.life > 0);
    if (pieces.length) {
      requestAnimationFrame(tick);
    } else {
      running = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  function start() {
    if (!running) {
      running = true;
      requestAnimationFrame(tick);
    }
  }

  /** Gentle rain of confetti from the top of the screen. */
  window.confettiRain = function (count = 120) {
    for (let i = 0; i < count; i++) pieces.push(makePiece());
    start();
  };

  /** Firework-style burst from a point (defaults to centre). */
  window.confettiBurst = function (x, y, count = 80) {
    const bx = x === undefined ? canvas.width / 2 : x;
    const by = y === undefined ? canvas.height / 2 : y;
    for (let i = 0; i < count; i++) pieces.push(makePiece(bx, by));
    start();
  };
})();
