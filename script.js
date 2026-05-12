// The Hunt — 謎解きロジック

// 答え正規化（カタカナ→ひらがな、空白除去、小文字化）
function normalize(str) {
  return str
    .trim()
    .replace(/\s+/g, '')
    .replace(/[ァ-ヶ]/g, ch =>
      String.fromCharCode(ch.charCodeAt(0) - 0x60)
    )
    .toLowerCase();
}

// ステージ表示
function showStage(num) {
  const stage = document.querySelector(`.stage[data-stage="${num}"]`);
  if (!stage) return;
  stage.hidden = false;
  setTimeout(() => {
    stage.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const input = stage.querySelector('input');
    if (input) input.focus({ preventScroll: true });
  }, 200);
}

// 紙吹雪を散らす
function spawnConfetti() {
  const wrap = document.getElementById('confetti-wrap');
  wrap.innerHTML = '';
  const colors = ['#ff7a5c', '#ffd23f', '#6bcfa8', '#ff8fab', '#a78bfa', '#ffffff'];
  const count = 60;

  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + '%';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = Math.random() * 0.6 + 's';
    piece.style.animationDuration = (2.5 + Math.random() * 1.8) + 's';
    piece.style.width = (6 + Math.random() * 8) + 'px';
    piece.style.height = (10 + Math.random() * 8) + 'px';
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    wrap.appendChild(piece);
  }
}

// 正解オーバーレイを表示
let currentStageNum = 0;

function showCorrectOverlay(stage) {
  const overlay = document.getElementById('correct-overlay');
  const hintPlace = document.getElementById('hint-place');
  const nextBtn = document.getElementById('next-btn');

  hintPlace.textContent = stage.dataset.place;
  currentStageNum = parseInt(stage.dataset.stage, 10);

  // 最後のステージならボタン文言変更
  if (currentStageNum === 3) {
    nextBtn.textContent = 'ゴールへ 🎉';
  } else {
    nextBtn.textContent = '次のクエストへ →';
  }

  overlay.hidden = false;
  spawnConfetti();
}

// 「次へ」ボタン
document.getElementById('next-btn').addEventListener('click', () => {
  const overlay = document.getElementById('correct-overlay');
  overlay.hidden = true;

  if (currentStageNum < 3) {
    showStage(currentStageNum + 1);
  } else {
    // フィナーレ
    const final = document.getElementById('final');
    final.hidden = false;
    setTimeout(() => {
      final.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // フィナーレでも紙吹雪
      spawnConfettiInBody();
    }, 100);
  }
});

// フィナーレ用：bodyに紙吹雪
function spawnConfettiInBody() {
  const wrap = document.createElement('div');
  wrap.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:50;overflow:hidden;';
  wrap.id = 'final-confetti';
  document.body.appendChild(wrap);

  const colors = ['#ff7a5c', '#ffd23f', '#6bcfa8', '#ff8fab', '#a78bfa'];
  for (let i = 0; i < 80; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + '%';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = Math.random() * 1.2 + 's';
    piece.style.animationDuration = (3 + Math.random() * 2) + 's';
    piece.style.width = (6 + Math.random() * 8) + 'px';
    piece.style.height = (10 + Math.random() * 8) + 'px';
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    wrap.appendChild(piece);
  }

  setTimeout(() => wrap.remove(), 6000);
}

// 各ステージのフォーム設定
function setupStage(stage) {
  const form = stage.querySelector('.answer-form');
  const input = form.querySelector('input');
  const fb = stage.querySelector('.feedback');
  const answers = form.dataset.answers.split('|').map(normalize);

  form.addEventListener('submit', e => {
    e.preventDefault();
    const value = normalize(input.value);
    if (!value) return;

    if (answers.includes(value)) {
      // 正解
      input.disabled = true;
      form.querySelector('button').disabled = true;
      fb.classList.remove('visible', 'error');
      setTimeout(() => showCorrectOverlay(stage), 200);
    } else {
      // 不正解
      fb.textContent = '違うみたい… もう一度！';
      fb.classList.remove('error');
      void fb.offsetWidth;
      fb.classList.add('visible', 'error');
      form.classList.remove('shake');
      void form.offsetWidth;
      form.classList.add('shake');
      input.select();
    }
  });
}

// スタートボタン
document.querySelector('[data-action="start"]').addEventListener('click', () => {
  const intro = document.getElementById('intro');
  intro.style.transition = 'opacity 0.4s, transform 0.4s';
  intro.style.opacity = '0';
  intro.style.transform = 'translateY(-20px)';
  setTimeout(() => {
    intro.hidden = true;
    showStage(1);
  }, 400);
});

// 全ステージにイベント設定
document.querySelectorAll('.stage').forEach(setupStage);
