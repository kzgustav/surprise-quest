// The Hunt — 謎解きロジック

// カタカナ→ひらがな + 全角空白除去 + lowercase で揺らぎ吸収
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
  // スムーズスクロール
  setTimeout(() => {
    stage.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const input = stage.querySelector('input');
    if (input) input.focus({ preventScroll: true });
  }, 100);
}

// フィードバック表示
function showFeedback(stage, message, type) {
  const fb = stage.querySelector('.feedback');
  fb.textContent = message;
  fb.classList.remove('error', 'success');
  fb.classList.add('visible', type);
}

// 各ステージのフォーム送信処理
function setupStage(stage) {
  const form = stage.querySelector('.answer-form');
  const input = form.querySelector('input');
  const answers = form.dataset.answers.split('|').map(normalize);
  const stageNum = parseInt(stage.dataset.stage, 10);

  form.addEventListener('submit', e => {
    e.preventDefault();
    const value = normalize(input.value);

    if (!value) return;

    if (answers.includes(value)) {
      // 正解
      showFeedback(stage, '— 扉がひらく音 —', 'success');
      stage.classList.add('cleared');
      input.disabled = true;
      form.querySelector('button').disabled = true;

      setTimeout(() => {
        if (stageNum < 3) {
          showStage(stageNum + 1);
        } else {
          // 最終
          const final = document.getElementById('final');
          final.hidden = false;
          setTimeout(() => {
            final.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }
      }, 1200);
    } else {
      // 不正解
      showFeedback(stage, '— 違うようだ —', 'error');
      form.classList.remove('shake');
      void form.offsetWidth; // reflow
      form.classList.add('shake');
      input.select();
    }
  });
}

// イントロのスタートボタン
document.querySelector('[data-action="start"]').addEventListener('click', () => {
  document.getElementById('intro').style.transition = 'opacity 0.5s';
  document.getElementById('intro').style.opacity = '0.25';
  showStage(1);
});

// 全ステージにイベント設定
document.querySelectorAll('.stage').forEach(setupStage);

// Enter キーで input にフォーカスが残るように
document.querySelectorAll('input').forEach(input => {
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      // form submit に任せる
    }
  });
});
