/* Screen navigation, floating balloons, and the typewriter love letter. */
(function () {
  const screens = document.querySelectorAll('.screen');
  const letterBody = document.getElementById('letter-body');
  const letterSignature = document.getElementById('letter-signature');
  const letterReplay = document.getElementById('letter-replay');
  const menuName = document.querySelector('.menu-name');

  menuName.textContent = BIRTHDAY_CONFIG.name;

  /* ---------- navigation ---------- */
  function show(id) {
    screens.forEach((s) => s.classList.toggle('active', s.id === id));
    if (id === 'screen-message') typeLetter();
  }

  document.querySelectorAll('[data-goto]').forEach((btn) =>
    btn.addEventListener('click', () => show(btn.dataset.goto))
  );

  /* ---------- typewriter letter ---------- */
  let typeToken = 0; // invalidates an in-flight typing run on replay/leave

  function typeLetter() {
    const token = ++typeToken;
    letterBody.innerHTML = '';
    letterSignature.textContent = '';
    letterReplay.classList.add('hidden');

    const paragraphs = BIRTHDAY_CONFIG.message;
    let p = 0;
    let ch = 0;
    let el = null;

    function step() {
      if (token !== typeToken) return;
      if (p >= paragraphs.length) {
        letterSignature.textContent = BIRTHDAY_CONFIG.signature;
        letterReplay.classList.remove('hidden');
        window.confettiBurst(undefined, window.innerHeight * 0.35, 100);
        return;
      }
      if (ch === 0) {
        el = document.createElement('p');
        letterBody.appendChild(el);
      }
      el.textContent = paragraphs[p].slice(0, ++ch);
      if (ch >= paragraphs[p].length) {
        p++;
        ch = 0;
        setTimeout(step, 500);
      } else {
        setTimeout(step, 28);
      }
    }
    step();
  }

  letterReplay.addEventListener('click', typeLetter);

  /* ---------- floating balloons ---------- */
  const balloonsHost = document.getElementById('balloons');
  const BALLOON_EMOJI = ['🎈', '🎈', '💖', '🎈', '✨', '🎈', '💝'];
  for (let i = 0; i < 12; i++) {
    const b = document.createElement('span');
    b.className = 'balloon';
    b.textContent = BALLOON_EMOJI[(Math.random() * BALLOON_EMOJI.length) | 0];
    b.style.left = `${Math.random() * 100}%`;
    b.style.animationDuration = `${9 + Math.random() * 10}s`;
    b.style.animationDelay = `${Math.random() * 12}s`;
    b.style.fontSize = `${1.4 + Math.random() * 1.6}rem`;
    balloonsHost.appendChild(b);
  }

  /* ---------- opening fanfare ---------- */
  window.addEventListener('load', () => window.confettiRain(140));
})();
