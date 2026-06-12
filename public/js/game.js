/* Noughts & crosses: she plays hearts (♥), against Cupid's crosses (✗)
 * or against player two in duo mode. */
(function () {
  const HEART = '♥';
  const CROSS = '✗';
  const LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  const cells = Array.from(document.querySelectorAll('.cell'));
  const statusEl = document.getElementById('game-status');
  const restartBtn = document.getElementById('game-restart');
  const modeCupidBtn = document.getElementById('mode-cupid');
  const modeDuoBtn = document.getElementById('mode-duo');
  const scoreXLabel = document.getElementById('score-x-label');
  const scoreEls = {
    [HEART]: document.getElementById('score-hearts'),
    draw: document.getElementById('score-draws'),
    [CROSS]: document.getElementById('score-crosses')
  };

  let board, turn, gameOver, vsCupid, busy;
  const scores = { [HEART]: 0, [CROSS]: 0, draw: 0 };

  const WIN_LINES_HEART = [
    'You win! (You always had my heart anyway) ♥',
    'Victory! Cupid never stood a chance against you 🏆',
    'Hearts win! Just like in real life ♥'
  ];
  const WIN_LINES_CROSS = [
    "Cupid wins this round — but you've already won me ✗",
    'Cupid sneaks a win! Rematch, birthday girl? 🏹'
  ];
  const DRAW_LINES = [
    "A draw — a perfect match, just like us 💞",
    "It's a tie! Great minds (and hearts) think alike 💕"
  ];

  const pick = (arr) => arr[(Math.random() * arr.length) | 0];

  function winnerOf(b) {
    for (const line of LINES) {
      const [a, c, d] = line;
      if (b[a] && b[a] === b[c] && b[a] === b[d]) return { mark: b[a], line };
    }
    return null;
  }

  function setStatus(text) {
    statusEl.textContent = text;
  }

  function turnPrompt() {
    if (turn === HEART) return vsCupid ? 'Your move, birthday girl ♥' : 'Hearts ♥ to play';
    return vsCupid ? 'Cupid is thinking… 🏹' : 'Crosses ✗ to play';
  }

  function render() {
    cells.forEach((cell, i) => {
      cell.textContent = board[i];
      cell.classList.toggle('heart', board[i] === HEART);
      cell.classList.toggle('cross', board[i] === CROSS);
    });
  }

  function endRound(result) {
    gameOver = true;
    if (result.mark) {
      result.line.forEach((i) => cells[i].classList.add('winning'));
      scores[result.mark]++;
      scoreEls[result.mark].textContent = scores[result.mark];
      setStatus(result.mark === HEART ? pick(WIN_LINES_HEART) : pick(WIN_LINES_CROSS));
      if (result.mark === HEART || !vsCupid) window.confettiBurst();
    } else {
      scores.draw++;
      scoreEls.draw.textContent = scores.draw;
      setStatus(pick(DRAW_LINES));
    }
  }

  function place(i, mark) {
    board[i] = mark;
    cells[i].classList.add('pop');
    render();
    const win = winnerOf(board);
    if (win) return endRound(win);
    if (board.every(Boolean)) return endRound({ mark: null });
    turn = mark === HEART ? CROSS : HEART;
    setStatus(turnPrompt());
  }

  /* Cupid plays a decent but beatable game: win if possible, block if
   * needed, otherwise prefer centre, then corners — with the occasional
   * lapse of concentration, because he's distracted by romance. */
  function cupidMove() {
    const free = board.map((v, i) => (v ? null : i)).filter((i) => i !== null);
    const tryLine = (mark) =>
      free.find((i) => {
        const copy = board.slice();
        copy[i] = mark;
        return !!winnerOf(copy);
      });

    const distracted = Math.random() < 0.25;
    let move;
    if (!distracted) {
      move = tryLine(CROSS); // take the win
      if (move === undefined) move = tryLine(HEART); // block hers
    }
    if (move === undefined && board[4] === '' && Math.random() < 0.8) move = 4;
    if (move === undefined) {
      const corners = [0, 2, 6, 8].filter((i) => board[i] === '');
      move = corners.length && Math.random() < 0.7 ? pick(corners) : pick(free);
    }
    place(move, CROSS);
  }

  function onCellClick(e) {
    const i = +e.currentTarget.dataset.i;
    if (gameOver || busy || board[i]) return;
    if (vsCupid && turn === CROSS) return;
    place(i, turn);
    if (vsCupid && !gameOver && turn === CROSS) {
      busy = true;
      setTimeout(() => {
        cupidMove();
        busy = false;
      }, 550);
    }
  }

  function reset() {
    board = Array(9).fill('');
    turn = HEART;
    gameOver = false;
    busy = false;
    cells.forEach((c) => c.classList.remove('winning', 'pop'));
    render();
    setStatus(turnPrompt());
  }

  function setMode(cupid) {
    vsCupid = cupid;
    modeCupidBtn.classList.toggle('selected', cupid);
    modeDuoBtn.classList.toggle('selected', !cupid);
    scoreXLabel.textContent = cupid ? '✗ Cupid' : '✗ Player 2';
    reset();
  }

  cells.forEach((c) => c.addEventListener('click', onCellClick));
  restartBtn.addEventListener('click', reset);
  modeCupidBtn.addEventListener('click', () => setMode(true));
  modeDuoBtn.addEventListener('click', () => setMode(false));

  setMode(true);
})();
