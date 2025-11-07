// Data untuk Website (silakan ganti sesuai keinginanmu)
const data = {
  name: 'Bella',
  photoUrl:
    'https://images.unsplash.com/photo-1524636462500-c1e1b48c8fac?auto=format&fit=crop&w=1200&q=80',
  questions: [
    { q: 'Di mana kita pertama kali ngedate?', a: 'Jakarta Aquarium' },
    { q: 'Makanan apa yang sering kita pilih saat jalan ?', a: 'Gogi' },
    { q: 'Apa nama panggilan sayangku untukmu?', a: 'kentung' },
  ],
  message: `Sayang Bella,

Di hari yang spesial ini, aku mau bilang tetap semangat terus jangan cape cape buat ngadepin cueknya aku, tetap jadi bella yang baik, dan doaku pastinya pengen liat kamu sukses serta capai semua yang belum tercapai, bahagianya aku selain liat kamu senyum, juga bahagia atas pencapainmu. aku sangat bersyukur punya kamu sekarang karena jeleknya dan egonya aku membaik sering kita kalau lagi berantem atau engga yang pasti adanya kamu buat aku ngeliat mengalah itu bukan kesalahan melainkan hal yang baik untuk koreksi diri supaya yang baik bisa jadi baik lagi. Terima kasih untuk semuanya terima kasih utnuk tidak cape sama aku, maaf belum bisa romantis kwkwkwkwk, dan mungkin belum mencapai juga yang memang aku lagi jalani sekarang yang pasti aku tetap sama kamu sekarang engga neko neko, makasi atas perhatian manis yang selalu kamu berikan.

Semoga tahun ini dan tahun yang akan datang membawa banyak kebahagiaan, kesehatan, dan mimpi-mimpi kita yang jadi kenyataan.

Selamat ulang tahun, Bella. I love you ❤️`
};

// Referensi DOM
const gate = document.getElementById('gate');
const quiz = document.getElementById('quiz');
const finalView = document.getElementById('final');
const pwClose = document.querySelector('.pw-close');
const loaderEl = document.getElementById('loader');
const storyModal = document.getElementById('storyModal');
const storyText = document.getElementById('storyText');
const storyNextBtn = document.getElementById('storyNextBtn');
const storyCloseBtn = document.querySelector('.pw-close-story');
const bgMusic = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');

const startBtn = document.getElementById('startBtn');
const submitBtn = document.getElementById('submitBtn');
const questionText = document.getElementById('questionText');
const answerInput = document.getElementById('answerInput');
const feedback = document.getElementById('feedback');

const memoryPhoto1 = document.getElementById('memoryPhoto1');
const memoryPhoto2 = document.getElementById('memoryPhoto2');
const birthdayMessage = document.getElementById('birthdayMessage');
const confettiContainer = document.getElementById('confetti');
const sky = document.getElementById('sky');
const cloudCanvas = document.getElementById('cloudCanvas');
const sceneCanvas = document.getElementById('sceneCanvas');
// WhatsApp feedback elements
const waNumber = document.getElementById('waNumber');
const waMsg1 = document.getElementById('waMsg1');
const waMsg2 = document.getElementById('waMsg2');
const waMsg3 = document.getElementById('waMsg3');
const waSend1 = document.getElementById('waSend1');
const waSend2 = document.getElementById('waSend2');
const waSend3 = document.getElementById('waSend3');
let cloudCtx;
let clouds = [];
let cloudAnimId = null;
let sceneCtx;
let sceneAnimId = null;

let index = 0;

function showGate() {
  gate.classList.add('active');
  quiz.classList.add('hidden');
  finalView.classList.add('hidden');
}

function showQuiz() {
  gate.classList.remove('active');
  gate.classList.add('hidden');
  quiz.classList.remove('hidden');
  quiz.classList.add('active');
  // Pastikan overlay tidak menghalangi interaksi
  try {
    if (storyModal) storyModal.style.display = 'none';
    if (loaderEl) loaderEl.style.display = 'none';
    if (sky) sky.style.pointerEvents = 'none';
  } catch {}
  renderQuestion();
  // Fokuskan input setelah tampilan siap
  setTimeout(() => { try { answerInput && answerInput.focus(); } catch {} }, 0);
}

function renderQuestion() {
  const current = data.questions[index];
  questionText.textContent = current.q;
  feedback.textContent = '';
  feedback.className = 'feedback';
  answerInput.value = '';
  answerInput.focus();
  // apply fade-in setiap berubah pertanyaan
  const card = document.getElementById('card');
  card.classList.remove('fade-in');
  void card.offsetWidth; // reflow untuk reset animasi
  card.classList.add('fade-in');
}

function normalize(str) {
  return (str || '').trim().toLowerCase();
}

function handleSubmit() {
  const userAnswer = normalize(answerInput.value);
  const correctAnswer = normalize(data.questions[index].a);

  if (!userAnswer) {
    feedback.textContent = 'Tulis dulu jawabannya ya, sayang 💖';
    feedback.className = 'feedback error';
    return;
  }

  if (userAnswer === correctAnswer) {
    feedback.textContent = 'Benar! ❤️';
    feedback.className = 'feedback success';
    submitBtn.disabled = true;
    answerInput.disabled = true;

    setTimeout(() => {
      submitBtn.disabled = false;
      answerInput.disabled = false;
      index++;

      if (index < data.questions.length) {
        renderQuestion();
      } else {
        ensureMusic();
        showFinal();
      }
    }, 1000);
  } else {
    feedback.textContent = 'Hmm, yakin? Coba lagi deh! 😜';
    feedback.className = 'feedback error';
  }
}

function showFinal() {
  showLoader(700, () => {
    quiz.classList.remove('active');
    quiz.classList.add('hidden');
    finalView.classList.remove('hidden');
    finalView.classList.add('active');

    // Isi konten hadiah
    if (memoryPhoto1) memoryPhoto1.src = 'assets/music/Bella_1.jpeg';
    if (memoryPhoto2) memoryPhoto2.src = 'assets/music/Bella_2.jpeg';
    birthdayMessage.innerHTML = `<p>${data.message.replace(/\n/g, '<br/>')}</p>`;

    if (memoryPhoto1) memoryPhoto1.classList.add('animate');
    if (memoryPhoto2) memoryPhoto2.classList.add('animate');

    // Pasang handler WhatsApp jika elemen ada
    wireWhatsAppForm();

    // Jalankan confetti saat final muncul
    launchConfetti(200, 2200);
    burstSparklesForPhotos(28);
    ensureMusic();
  });
}

// Tutup kuis dan reload halaman secara otomatis
function handleCloseQuiz() {
  window.location.reload();
}

// Loader helpers
function showLoader(duration = 700, done) {
  if (loaderEl) {
    loaderEl.style.display = 'grid';
    if (duration && duration > 0) {
      setTimeout(() => {
        loaderEl.style.display = 'none';
        if (typeof done === 'function') done();
      }, duration);
    } else {
      if (typeof done === 'function') done();
    }
  } else if (typeof done === 'function') {
    done();
  }
}

// ===== Storytelling Pop-up =====
const storyLines = [
  'Engga boleh curiga berlebihan, nanti overthinking.',
  'Jangan mudah ngambek yaaaa..',
  'Sayangi keluarga mama dan papah, apapun itu kalau buat kamu kesel, tetep harus sayangi mereka.',
];
let storyIndex = 0;
let typerId = null;

function typeLine(text, el, done) {
  if (!el) return done && done();
  el.textContent = '';
  let i = 0;
  const speed = 28;
  clearInterval(typerId);
  typerId = setInterval(() => {
    el.textContent += text[i];
    i++;
    if (i >= text.length) {
      clearInterval(typerId);
      typerId = null;
      if (typeof done === 'function') done();
    }
  }, speed);
}

function showStory() {
  if (storyModal) {
    storyModal.style.display = 'grid';
    storyIndex = 0;
    typeLine(storyLines[storyIndex], storyText);
  }
}

function nextStory() {
  storyIndex++;
  if (storyIndex < storyLines.length) {
    typeLine(storyLines[storyIndex], storyText);
  } else {
    // selesai cerita -> lanjut ke kuis
    if (storyModal) storyModal.style.display = 'none';
    showLoader(600, showQuiz);
  }
}

// ===== Musik Romantis =====
function ensureMusic() {
  if (!bgMusic) return;
  try {
    if (!bgMusic.src) {
      // Sumber musik disimpan di folder assets/music
      bgMusic.src = 'assets/music/happy-birthday-220024.mp3';
    }
    bgMusic.loop = true;
    if (typeof bgMusic.volume === 'number') bgMusic.volume = 0.6;
    bgMusic.play().then(() => {
      updateMusicButton();
    }).catch(() => {
      // Autoplay bisa ditolak; tombol tetap dapat menyalakan musik
      updateMusicButton();
    });
  } catch (e) {
    updateMusicButton();
  }
}

function updateMusicButton() {
  if (!musicBtn) return;
  const on = bgMusic && !bgMusic.paused;
  musicBtn.textContent = on ? '♫ Musik: On' : '♫ Musik: Off';
}

if (musicBtn) {
  musicBtn.addEventListener('click', () => {
    if (!bgMusic) return;
    if (!bgMusic.src) ensureMusic();
    if (bgMusic.paused) {
      bgMusic.play().then(updateMusicButton).catch(updateMusicButton);
    } else {
      bgMusic.pause();
      updateMusicButton();
    }
  });
}

// Confetti sederhana tanpa library
function launchConfetti(count = 160, duration = 2000) {
  const colors = ['#ff8fb1', '#f8c8dc', '#d4af37', '#e6e6fa', '#ffffff'];

  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    const left = Math.random() * 100; // persen
    const size = 6 + Math.random() * 10;
    const delay = Math.random() * 0.8; // detik
    const fallTime = 1.6 + Math.random() * 1.4; // detik
    const color = colors[Math.floor(Math.random() * colors.length)];

    piece.style.left = left + 'vw';
    piece.style.width = size + 'px';
    piece.style.height = size * 1.4 + 'px';
    piece.style.background = color;
    piece.style.animationDuration = fallTime + 's';
    piece.style.animationDelay = delay + 's';

    confettiContainer.appendChild(piece);

    // Bersihkan setelah selesai
    setTimeout(() => {
      piece.remove();
    }, (delay + fallTime) * 1000 + 200);
  }

  // Hentikan confetti container setelah durasi
  setTimeout(() => {
    confettiContainer.innerHTML = '';
  }, duration + 1500);
}

function burstSparklesForPhotos(nPerPhoto = 26) {
  const targets = [memoryPhoto1, memoryPhoto2].filter(Boolean);
  const body = document.body;
  const colors = ['#ffd166', '#ff8fb1', '#ffffff', '#e6e6fa'];
  targets.forEach((el) => {
    const r = el.getBoundingClientRect();
    for (let i = 0; i < nPerPhoto; i++) {
      const piece = document.createElement('div');
      piece.className = 'sparkle-piece';
      const x = r.left + Math.random() * r.width;
      const y = r.top + Math.random() * r.height;
      piece.style.left = x + 'px';
      piece.style.top = y + 'px';
      const dx = (Math.random() - 0.5) * 120;
      const dy = -40 - Math.random() * 80;
      piece.style.setProperty('--dx', dx + 'px');
      piece.style.setProperty('--dy', dy + 'px');
      piece.style.setProperty('--t', (0.8 + Math.random() * 1.2) + 's');
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      body.appendChild(piece);
      setTimeout(() => piece.remove(), 2000);
    }
  });
}

// Awan realistis berbasis Canvas
function initCloudsCanvas() {
  if (!cloudCanvas) return;
  cloudCtx = cloudCanvas.getContext('2d');

  function resize() {
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const w = window.innerWidth;
    const h = window.innerHeight;
    cloudCanvas.width = Math.floor(w * dpr);
    cloudCanvas.height = Math.floor(h * dpr);
    cloudCanvas.style.width = w + 'px';
    cloudCanvas.style.height = h + 'px';
    cloudCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  resize();

  const W = () => window.innerWidth;
  const H = () => window.innerHeight;

  // Buat beberapa lapisan dengan kecepatan berbeda untuk efek parallax
  clouds = [];
  // Burung yang terbang di langit
  let birds = [];
  let birdFrames = [];

  function makeCloud(layer) {
    const baseSize = layer === 0 ? 160 : layer === 1 ? 220 : 300;
    const sizeVar = layer === 0 ? 80 : layer === 1 ? 120 : 160;
    const speedPx = layer === 0 ? 18 : layer === 1 ? 12 : 8; // piksel per detik
    const yMax = layer === 2 ? H() * 0.55 : layer === 1 ? H() * 0.5 : H() * 0.45;
    const blur = layer === 2 ? 2.2 : layer === 1 ? 1.2 : 0.5; // px

    const cx = Math.random() * W();
    const cy = Math.random() * yMax;
    const size = baseSize + Math.random() * sizeVar;
    const amp = 4 + Math.random() * 7; // amplitudo bobbing

    const puffCount = 6 + Math.floor(Math.random() * 5);

    // Buat sprite offscreen agar tidak menggambar gradient setiap frame
    const sprite = document.createElement('canvas');
    const sprW = Math.ceil(size * 1.6);
    const sprH = Math.ceil(size * 1.2);
    sprite.width = sprW;
    sprite.height = sprH;
    const sctx = sprite.getContext('2d');
    sctx.filter = `blur(${blur}px)`;
    sctx.globalAlpha = layer === 2 ? 0.75 : layer === 1 ? 0.85 : 0.95;

    // Pusat sprite
    const sx = sprW / 2;
    const sy = sprH / 2;

    for (let i = 0; i < puffCount; i++) {
      const angle = (i / puffCount) * Math.PI + (Math.random() * 0.3);
      const radius = size * (0.18 + Math.random() * 0.22);
      const ox = Math.cos(angle) * (size * (0.25 + Math.random() * 0.25));
      const oy = Math.sin(angle) * (size * (0.10 + Math.random() * 0.18));
      const gx = sx + ox;
      const gy = sy + oy;
      const grad = sctx.createRadialGradient(gx, gy, radius * 0.2, gx, gy, radius);
      grad.addColorStop(0, 'rgba(255,255,255,0.95)');
      grad.addColorStop(1, 'rgba(255,255,255,0.0)');
      sctx.fillStyle = grad;
      sctx.beginPath();
      sctx.arc(gx, gy, radius, 0, Math.PI * 2);
      sctx.fill();
    }

    // Body awan lembut
    const bodyGrad = sctx.createRadialGradient(sx, sy, size * 0.15, sx, sy, size * 0.7);
    bodyGrad.addColorStop(0, 'rgba(255,255,255,0.55)');
    bodyGrad.addColorStop(1, 'rgba(255,255,255,0.0)');
    sctx.fillStyle = bodyGrad;
    sctx.beginPath();
    sctx.arc(sx, sy, size * 0.65, 0, Math.PI * 2);
    sctx.fill();

    return {
      layer,
      x: cx,
      y: cy,
      size,
      speedPx,
      amp,
      phase: Math.random() * Math.PI * 2,
      sprite,
      sprW,
      sprH,
    };
  }

  // Inisialisasi awan untuk 3 lapisan
  const counts = [6, 4, 3];
  for (let l = 0; l < 3; l++) {
    for (let i = 0; i < counts[l]; i++) {
      clouds.push(makeCloud(l));
    }
  }

  // Buat sprite burung (2 frame untuk mengepak sayap)
  function makeBirdSprite(frame = 0) {
    const cvs = document.createElement('canvas');
    const w = 44;
    const h = 24;
    cvs.width = w;
    cvs.height = h;
    const ctx = cvs.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // Body (silhouette sederhana agar terlihat dari jauh)
    ctx.fillStyle = 'rgba(60,60,60,0.9)';
    ctx.beginPath();
    ctx.ellipse(18, 12, 12, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Kepala
    ctx.beginPath();
    ctx.arc(30, 11, 4, 0, Math.PI * 2);
    ctx.fill();

    // Paruh
    ctx.fillStyle = '#d0a050';
    ctx.fillRect(34, 11, 6, 2);

    // Ekor
    ctx.fillStyle = 'rgba(60,60,60,0.9)';
    ctx.beginPath();
    ctx.moveTo(8, 12);
    ctx.lineTo(4, 9);
    ctx.lineTo(4, 15);
    ctx.closePath();
    ctx.fill();

    // Sayap (dua posisi: up/down)
    ctx.fillStyle = 'rgba(60,60,60,0.9)';
    ctx.beginPath();
    if (frame === 0) {
      // sayap ke atas
      ctx.moveTo(14, 12);
      ctx.lineTo(2, 3);
      ctx.lineTo(9, 12);
    } else {
      // sayap ke bawah
      ctx.moveTo(14, 12);
      ctx.lineTo(2, 21);
      ctx.lineTo(9, 12);
    }
    ctx.closePath();
    ctx.fill();

    return { sprite: cvs, w, h };
  }

  birdFrames = [makeBirdSprite(0), makeBirdSprite(1)];

  function makeBird() {
    const dir = Math.random() < 0.5 ? -1 : 1; // kiri atau kanan
    const scale = 0.9 + Math.random() * 0.6; // variasi ukuran
    const speedPx = 70 + Math.random() * 60; // piksel/detik
    const baseY = H() * (0.12 + Math.random() * 0.28); // ketinggian di langit
    return {
      x: dir > 0 ? -60 : W() + 60,
      y: baseY,
      baseY,
      dir,
      scale,
      speedPx,
      amp: 3 + Math.random() * 5,
      phase: Math.random() * Math.PI * 2,
      frameIndex: 0,
      frameTimer: 0,
      frameDur: 0.12 + Math.random() * 0.06 // detik per frame
    };
  }

  birds = new Array(6).fill(0).map(() => makeBird());

  let last = performance.now();
  function loop(now) {
    const dt = Math.min(0.033, (now - last) / 1000); // clamp ~30fps step untuk stabilitas
    last = now;

    cloudCtx.clearRect(0, 0, W(), H());

    // Gambar per lapisan dari belakang ke depan
    for (let layer = 2; layer >= 0; layer--) {
      for (const c of clouds) {
        if (c.layer !== layer) continue;
        c.x += c.speedPx * dt; // piksel per detik
        c.y = c.y + Math.sin(now * 0.001 + c.phase) * (c.amp * dt);
        if (c.x - c.size > W()) {
          c.x = -c.size;
          c.y = Math.random() * (layer === 2 ? H() * 0.55 : layer === 1 ? H() * 0.5 : H() * 0.45);
        }
        // gambar sprite awan yang sudah diraster
        const dx = c.x - c.sprW / 2;
        const dy = c.y - c.sprH / 2;
        cloudCtx.drawImage(c.sprite, dx, dy);
      }
    }

    // Burung terbang (digambar di atas awan)
    for (const b of birds) {
      b.x += b.dir * b.speedPx * dt;
      b.y = b.baseY + Math.sin(now * 0.002 + b.phase) * b.amp;

      // Flap
      b.frameTimer += dt;
      if (b.frameTimer >= b.frameDur) {
        b.frameTimer = 0;
        b.frameIndex = (b.frameIndex + 1) % birdFrames.length;
      }

      // Respawn saat keluar layar
      if (b.dir > 0 && b.x > W() + 80) {
        const nb = makeBird(); nb.dir = 1; nb.x = -80; birds.splice(birds.indexOf(b), 1, nb);
      } else if (b.dir < 0 && b.x < -80) {
        const nb = makeBird(); nb.dir = -1; nb.x = W() + 80; birds.splice(birds.indexOf(b), 1, nb);
      }

      const fr = birdFrames[b.frameIndex];
      cloudCtx.save();
      cloudCtx.translate(b.x, b.y);
      cloudCtx.scale(b.dir, 1);
      const sw = fr.w * b.scale;
      const sh = fr.h * b.scale;
      cloudCtx.drawImage(fr.sprite, -sw / 2, -sh / 2, sw, sh);
      cloudCtx.restore();
    }

    cloudAnimId = requestAnimationFrame(loop);
  }

  if (cloudAnimId) cancelAnimationFrame(cloudAnimId);
  cloudAnimId = requestAnimationFrame(loop);

  window.addEventListener('resize', () => {
    resize();
    // Reset ukuran dan posisi burung saat resize
    birds = birds.map(() => makeBird());
  });
}

// Scene pixel picnic sederhana (procedural) di canvas
function initPicnicScene() {
  if (!sceneCanvas) return;
  sceneCtx = sceneCanvas.getContext('2d');

  function resize() {
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const w = window.innerWidth;
    const h = window.innerHeight;
    sceneCanvas.width = Math.floor(w * dpr);
    sceneCanvas.height = Math.floor(h * dpr);
    sceneCanvas.style.width = w + 'px';
    sceneCanvas.style.height = h + 'px';
    sceneCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();

  const W = () => window.innerWidth;
  const H = () => window.innerHeight;

  let hedgehogPhase = 0;
  let cat = { x: 0, dir: 1, speed: 1.2, phase: 0, state: 'walk', stateTimer: 0, scale: 0.10 };
  let moreCats = [];

  // Dua pasangan bergaya blok ala Minecraft
  let couples = [
    { x: 0, dir: 1, speed: 0.6, phase: 0 },
    { x: 0, dir: -1, speed: 0.55, phase: 0 }
  ];

  // Dialog obrolan acak untuk bubble
  const dialogues = [
    'Halo!',
    'Cantik banget hari ini',
    'Senja-nya indah ya',
    'Hehe 🤭',
    'Happy birthday! 🎉',
    'Aku sayang kamu 💖',
    'Foto yuk?',
    'Wah kucing lucu!',
    'Makan apa nanti?',
  ];

  function resetCat() {
    cat.x = window.innerWidth * 0.35;
    cat.dir = 1;
    cat.speed = 1.2;
    cat.phase = 0;
    cat.state = 'walk';
    cat.stateTimer = 0;
    cat.scale = 0.72; // perkecil ukuran kucing utama
  }
  resetCat();

  // Jalur pejalan kaki dan inisialisasi beberapa kucing tambahan
  function pathY() { return H() * 0.72; }
  function pathH() { return 28; }

  function resetMoreCats() {
    const w = W();
    moreCats = [
      { x: w * 0.25, dir: 1, speed: 1.05, phase: 0.2, state: 'walk', stateTimer: 0, fur: '#8e8e8e', furDark: '#7a7a7a', scale: 0.68 },
      { x: w * 0.75, dir: -1, speed: 0.95, phase: 0.6, state: 'walk', stateTimer: 0, fur: '#3b3b3b', furDark: '#2a2a2a', scale: 0.68 }
    ];
  }
  resetMoreCats();

  function resetCouples() {
    couples[0].x = W() * 0.22;
    couples[0].dir = 1;
    couples[1].x = W() * 0.78;
    couples[1].dir = -1;
    // Reset bubble
    for (const c of couples) {
      c.bubble = { text: null, timer: 0, cooldown: 120 + Math.floor(Math.random() * 180) };
    }
  }
  resetCouples();

  function drawFence() {
    const y = H() * 0.58;
    const postW = 14;
    const gap = 10;
    sceneCtx.fillStyle = '#d7b38c';
    for (let x = -postW; x < W() + postW; x += postW + gap) {
      const h = 70 + (Math.sin(x * 0.04) * 4);
      sceneCtx.fillRect(x, y - h, postW, h);
      sceneCtx.fillStyle = '#c69b73';
      sceneCtx.fillRect(x, y - h, postW, 6);
      sceneCtx.fillStyle = '#d7b38c';
    }
    sceneCtx.fillStyle = '#6fa96b';
    sceneCtx.fillRect(0, y + 8, W(), 12);
  }

  function drawGround() {
    const y = H() * 0.68;
    const g1 = sceneCtx.createLinearGradient(0, y, 0, H());
    g1.addColorStop(0, '#7fc36e');
    g1.addColorStop(1, '#5ea857');
    sceneCtx.fillStyle = g1;
    sceneCtx.fillRect(0, y, W(), H() - y);
  }

  function drawTree(x, y, scale = 1) {
    sceneCtx.fillStyle = '#6b8e23';
    for (let i = 0; i < 6; i++) {
      const r = 28 * scale + i * 6;
      const ox = (Math.sin(i) * 10) * scale;
      const oy = (-i * 12) * scale;
      sceneCtx.beginPath();
      sceneCtx.arc(x + ox, y + oy, r, 0, Math.PI * 2);
      sceneCtx.fill();
    }
    sceneCtx.fillStyle = '#8b5a2b';
    sceneCtx.fillRect(x - 8 * scale, y, 16 * scale, 60 * scale);
  }

  // Kelompok pohon di titik-titik yang estetis
  function drawForest() {
    // kiri dekat pagar
    drawTree(W() * 0.12, H() * 0.61, 1.0);
    drawTree(W() * 0.18, H() * 0.63, 0.9);
    // tengah belakang
    drawTree(W() * 0.50, H() * 0.60, 1.1);
    // kanan agak jauh
    drawTree(W() * 0.72, H() * 0.62, 0.95);
    drawTree(W() * 0.90, H() * 0.60, 1.0);
  }

  function drawBlanket() {
    const groundTop = H() * 0.68;
    const groundHeight = H() - groundTop;
    const bw = Math.min(420, W() * 0.40);
    const bh = Math.min(240, groundHeight * 0.45);
    const x = W() * 0.5 - bw * 0.5;
    const y = groundTop + (groundHeight * 0.5) - (bh * 0.5);
    sceneCtx.fillStyle = '#d34a4a';
    sceneCtx.fillRect(x, y, bw, bh);
    sceneCtx.fillStyle = '#ffffff';
    const cell = Math.max(24, Math.round(bw / 16));
    for (let i = 0; i < bw; i += cell) {
      for (let j = 0; j < bh; j += cell) {
        if (((i / cell) + (j / cell)) % 2 === 0) {
          sceneCtx.fillRect(x + i, y + j, cell, cell);
        }
      }
    }
  }

  // Aliran air yang mengalir (kanal kecil) dekat pagar
  function streamY() { return H() * 0.61; }
  function streamH() { return 50; }
  function drawWaterStream(timeMs) {
    const y = streamY();
    const h = streamH();
    const w = W();

    // Bentuk sungai dengan sedikit gelombang di tepi
    sceneCtx.save();
    sceneCtx.beginPath();
    sceneCtx.moveTo(0, y);
    for (let x = 0; x <= w; x += 16) {
      const wave = Math.sin(x * 0.06 + timeMs * 0.004) * 2;
      sceneCtx.lineTo(x, y + wave);
    }
    for (let x = w; x >= 0; x -= 16) {
      const wave = Math.sin(x * 0.06 + timeMs * 0.004 + Math.PI * 0.5) * 2;
      sceneCtx.lineTo(x, y + h + wave);
    }
    sceneCtx.closePath();

    // Gradasi air biru
    const grad = sceneCtx.createLinearGradient(0, y, 0, y + h);
    grad.addColorStop(0, '#6fb8e8');
    grad.addColorStop(1, '#4fa6d7');
    sceneCtx.fillStyle = grad;
    sceneCtx.fill();

    // Highlight arus yang bergerak ke kanan (dipusatkan di tengah kanal)
    const offset = (timeMs * 0.08) % 40;
    const centerY = y + h / 2;
    const lineH = 2;
    sceneCtx.globalAlpha = 0.35;
    sceneCtx.fillStyle = '#ffffff';
    for (let i = -40; i < w + 40; i += 40) {
      const fx = i + offset;
      const fy = Math.round(centerY - lineH / 2 + Math.sin(fx * 0.08 + timeMs * 0.003) * 1);
      sceneCtx.fillRect(fx, fy, 18, lineH);
    }
    sceneCtx.globalAlpha = 1.0;

    // Batas tepi tipis agar menyatu dengan rumput
    sceneCtx.strokeStyle = 'rgba(255,255,255,0.4)';
    sceneCtx.lineWidth = 1;
    sceneCtx.beginPath();
    sceneCtx.moveTo(0, y);
    for (let x = 0; x <= w; x += 16) {
      const wave = Math.sin(x * 0.06 + timeMs * 0.004) * 2;
      sceneCtx.lineTo(x, y + wave);
    }
    sceneCtx.stroke();
    sceneCtx.restore();
  }

  // Kotak hadiah pixel di tengah karpet
  function drawGiftBox() {
    const groundTop = H() * 0.68;
    const groundHeight = H() - groundTop;
    const bw = Math.min(420, W() * 0.40);
    const bh = Math.min(240, groundHeight * 0.45);
    const x = W() * 0.5 - bw * 0.5;
    const y = groundTop + (groundHeight * 0.5) - (bh * 0.5);

    const size = Math.min(bw, bh) * 0.35;
    const gx = Math.round(x + bw / 2 - size / 2);
    const gy = Math.round(y + bh / 2 - size / 2);

    // box dasar
    sceneCtx.fillStyle = '#f3c56b';
    sceneCtx.fillRect(gx, gy, size, size);
    sceneCtx.fillStyle = '#e5b658';
    sceneCtx.fillRect(gx, gy, size, 8);

    // pita merah
    sceneCtx.fillStyle = '#d34a4a';
    const ribbonW = Math.max(6, Math.round(size * 0.12));
    sceneCtx.fillRect(gx + size / 2 - ribbonW / 2, gy, ribbonW, size);
    sceneCtx.fillRect(gx, gy + size / 2 - ribbonW / 2, size, ribbonW);

    // pita bow sederhana
    sceneCtx.fillRect(gx + size / 2 - 10, gy - 10, 8, 10);
    sceneCtx.fillRect(gx + size / 2 + 2, gy - 10, 8, 10);
  }

  // Tambahkan beberapa bingkisan di atas karpet merah
  function drawGiftBoxAt(gx, gy, size, base = '#f3c56b', ribbon = '#d34a4a') {
    const s = Math.round(size);
    const x = Math.round(gx);
    const y = Math.round(gy);
    sceneCtx.fillStyle = base;
    sceneCtx.fillRect(x, y, s, s);
    sceneCtx.fillStyle = '#e5b658';
    sceneCtx.fillRect(x, y, s, Math.max(6, Math.round(s * 0.08)));
    sceneCtx.fillStyle = ribbon;
    const rW = Math.max(6, Math.round(s * 0.12));
    sceneCtx.fillRect(x + s / 2 - rW / 2, y, rW, s);
    sceneCtx.fillRect(x, y + s / 2 - rW / 2, s, rW);
    sceneCtx.fillRect(x + s / 2 - 10, y - 10, 8, 10);
    sceneCtx.fillRect(x + s / 2 + 2, y - 10, 8, 10);
  }

  function drawGiftBoxes() {
    const groundTop = H() * 0.68;
    const groundHeight = H() - groundTop;
    const bw = Math.min(420, W() * 0.40);
    const bh = Math.min(240, groundHeight * 0.45);
    const x = W() * 0.5 - bw * 0.5;
    const y = groundTop + (groundHeight * 0.5) - (bh * 0.5);

    // Ukuran relatif terhadap karpet
    const base = Math.min(bw, bh);
    const sizes = [base * 0.22, base * 0.18, base * 0.16, base * 0.20];
    const colors = [
      { base: '#f3c56b', ribbon: '#d34a4a' },
      { base: '#c0e0f8', ribbon: '#2a7bd3' },
      { base: '#f8e0e8', ribbon: '#bc6b24' },
      { base: '#d2f0c8', ribbon: '#6fa96b' },
    ];

    // Posisi di sudut-sudut karpet agar tidak menabrak kotak tengah
    const pad = Math.max(12, Math.round(base * 0.06));
    const positions = [
      { ox: pad, oy: pad },
      { ox: bw - pad, oy: pad, anchor: 'top-right' },
      { ox: pad, oy: bh - pad, anchor: 'bottom-left' },
      { ox: bw - pad, oy: bh - pad, anchor: 'bottom-right' },
    ];

    for (let i = 0; i < positions.length; i++) {
      const p = positions[i];
      const s = sizes[i % sizes.length];
      const col = colors[i % colors.length];
      const gx = x + (p.anchor && p.anchor.includes('right') ? p.ox - s : p.ox);
      const gy = y + (p.anchor && p.anchor.includes('bottom') ? p.oy - s : p.oy);
      drawGiftBoxAt(gx, gy, s, col.base, col.ribbon);
    }
  }

  // Beberapa balon di atas karpet
  function drawBalloon(x, y, color, t) {
    // Sedikit goyangan vertikal
    const bob = Math.sin(t * 0.003 + x * 0.01) * 4;
    const bx = Math.round(x);
    const by = Math.round(y + bob);
    sceneCtx.save();
    sceneCtx.fillStyle = color;
    sceneCtx.beginPath();
    sceneCtx.ellipse(bx, by, 16, 22, 0, 0, Math.PI * 2);
    sceneCtx.fill();
    // simpul kecil
    sceneCtx.fillStyle = '#8a6f4d';
    sceneCtx.fillRect(bx - 2, by + 20, 4, 4);
    // tali ke karpet
    sceneCtx.strokeStyle = 'rgba(60,60,60,0.8)';
    sceneCtx.lineWidth = 1;
    sceneCtx.beginPath();
    sceneCtx.moveTo(bx, by + 22);
    sceneCtx.lineTo(bx, by + 60);
    sceneCtx.stroke();
    sceneCtx.restore();
  }

  function drawBalloons(timeMs) {
    const groundTop = H() * 0.68;
    const groundHeight = H() - groundTop;
    const bw = Math.min(420, W() * 0.40);
    const bh = Math.min(240, groundHeight * 0.45);
    const x = W() * 0.5 - bw * 0.5;
    const y = groundTop + (groundHeight * 0.5) - (bh * 0.5);

    const colors = ['#ff8fb1', '#6fb8e8', '#ffd166', '#a0e7e5', '#cdb4db'];
    const anchors = [
      { ax: x + bw * 0.18, ay: y - 18 },
      { ax: x + bw * 0.82, ay: y - 22 },
      { ax: x + bw * 0.50, ay: y - 34 },
      { ax: x + bw * 0.32, ay: y - 28 },
      { ax: x + bw * 0.68, ay: y - 30 },
    ];
    for (let i = 0; i < anchors.length; i++) {
      const c = colors[i % colors.length];
      drawBalloon(anchors[i].ax, anchors[i].ay, c, timeMs);
    }
  }

  function updateCat() {
    if (cat.state === 'walk') {
      cat.phase += 0.18;
      cat.x += cat.dir * cat.speed;
      const left = W() * 0.10;
      const right = W() * 0.90;
      if (cat.x < left) cat.dir = 1;
      if (cat.x > right) cat.dir = -1;
      if (Math.random() < 0.006) { cat.state = 'sit'; cat.stateTimer = 180 + Math.floor(Math.random() * 180); }
    } else {
      cat.phase += 0.08;
      if (cat.stateTimer > 0) cat.stateTimer--; else cat.state = 'walk';
    }
  }

  function drawCat() {
    const baseY = pathY();
    const walkBob = cat.state === 'walk' ? Math.sin(cat.phase) * 2 : 0;
    const x = Math.round(cat.x);
    const y = Math.round(baseY + walkBob);

    const facing = cat.dir >= 0 ? 1 : -1;
    const s = typeof cat.scale === 'number' ? cat.scale : 0.72; // skala default kecil
    sceneCtx.save();
    sceneCtx.translate(x, y);
    sceneCtx.scale(facing * s, s);

    // body (blok)
    const fur = cat.fur || '#c7a26a';
    const furDark = cat.furDark || '#b58e58';
    sceneCtx.fillStyle = fur;
    sceneCtx.fillRect(-34, -22, 68, 36);
    sceneCtx.fillStyle = furDark;
    sceneCtx.fillRect(-34, -22, 68, 8);

    // head (kotak)
    sceneCtx.fillStyle = fur;
    sceneCtx.fillRect(36, -26, 28, 28);
    sceneCtx.fillStyle = '#000000';
    sceneCtx.fillRect(54, -12, 4, 4); // eye

    // ears (segitiga sederhana)
    sceneCtx.beginPath(); sceneCtx.moveTo(40, -26); sceneCtx.lineTo(46, -38); sceneCtx.lineTo(50, -26); sceneCtx.closePath(); sceneCtx.fillStyle = '#b58e58'; sceneCtx.fill();
    sceneCtx.beginPath(); sceneCtx.moveTo(60, -26); sceneCtx.lineTo(66, -36); sceneCtx.lineTo(70, -26); sceneCtx.closePath(); sceneCtx.fillStyle = '#b58e58'; sceneCtx.fill();

    // legs (langkah blok)
    const step = cat.state === 'walk' ? Math.sin(cat.phase * 0.9) * 3 : 0;
    sceneCtx.fillStyle = '#9c7a4a';
    sceneCtx.fillRect(-28, 14 + step, 10, 8);
    sceneCtx.fillRect(-4, 14 - step, 10, 8);
    sceneCtx.fillRect(20, 14 + step, 10, 8);
    sceneCtx.fillRect(44, 14 - step, 10, 8);

    // tail (ayunan blok)
    const wag = Math.sin(cat.phase * (cat.state === 'walk' ? 1.4 : 0.6)) * 6;
    sceneCtx.save();
    sceneCtx.translate(-40, -8);
    sceneCtx.rotate((wag * Math.PI) / 180);
    sceneCtx.fillStyle = fur;
    sceneCtx.fillRect(-24, -4, 24, 8);
    sceneCtx.restore();

    sceneCtx.restore();
  }

  function updateMoreCats() {
    const left = W() * 0.10;
    const right = W() * 0.90;
    for (const c of moreCats) {
      if (c.state === 'walk') {
        c.phase += 0.16;
        c.x += c.dir * c.speed;
        if (c.x < left) c.dir = 1;
        if (c.x > right) c.dir = -1;
        if (Math.random() < 0.004) { c.state = 'sit'; c.stateTimer = 160 + Math.floor(Math.random() * 160); }
      } else {
        c.phase += 0.06;
        if (c.stateTimer > 0) c.stateTimer--; else c.state = 'walk';
      }
    }
  }

  function drawMoreCats() {
    for (const c of moreCats) {
      const old = cat;
      cat = c;
      drawCat();
      cat = old;
    }
  }

  // Dialog "Meow meow" untuk kucing (utama dan tambahan)
  function updateEntitySpeech(entity) {
    if (!entity) return;
    if (!entity.bubble) {
      entity.bubble = { text: null, timer: 0, cooldown: 200 + Math.floor(Math.random() * 160) };
    }
    if (entity.bubble.timer > 0) {
      entity.bubble.timer--;
      if (entity.bubble.timer <= 0) entity.bubble.text = null;
    } else {
      entity.bubble.cooldown--;
      if (entity.bubble.cooldown <= 0) {
        entity.bubble.text = 'Meow meow';
        entity.bubble.timer = 180 + Math.floor(Math.random() * 140);
        entity.bubble.cooldown = 240 + Math.floor(Math.random() * 220);
      }
    }
  }

  function updateCatsSpeech() {
    updateEntitySpeech(cat);
    for (const c of moreCats) updateEntitySpeech(c);
  }

  function drawCatSpeechBubble(entity) {
    if (!entity || !entity.bubble || !entity.bubble.text) return;
    const facing = entity.dir >= 0 ? 1 : -1;
    const tx = Math.round(entity.x);
    const walkBob = entity.state === 'walk' ? Math.sin(entity.phase) * 2 : 0;
    // Posisi di atas kepala kucing
    const ty = Math.round(pathY() + walkBob - 34);

    sceneCtx.save();
    sceneCtx.font = '20px VT323, monospace';
    const metrics = sceneCtx.measureText(entity.bubble.text);
    const padX = 12, padY = 8;
    const bw = Math.max(64, Math.round(metrics.width) + padX * 2);
    const bh = 28;

    const bx = tx - bw / 2;
    const by = ty - bh;
    sceneCtx.fillStyle = 'rgba(255,255,255,0.92)';
    sceneCtx.fillRect(bx, by, bw, bh);
    sceneCtx.strokeStyle = '#2a2a2a';
    sceneCtx.lineWidth = 2;
    sceneCtx.strokeRect(bx, by, bw, bh);

    // ekor bubble mengarah ke kepala kucing
    sceneCtx.beginPath();
    const tailX = tx + (facing > 0 ? -6 : 6);
    const tailY = by + bh;
    sceneCtx.moveTo(tailX, tailY);
    sceneCtx.lineTo(tailX + (facing > 0 ? -10 : 10), tailY + 8);
    sceneCtx.lineTo(tailX + (facing > 0 ? -2 : 2), tailY);
    sceneCtx.closePath();
    sceneCtx.fillStyle = 'rgba(255,255,255,0.92)';
    sceneCtx.fill();
    sceneCtx.strokeStyle = '#2a2a2a';
    sceneCtx.stroke();

    sceneCtx.fillStyle = '#1a1a1a';
    sceneCtx.textBaseline = 'middle';
    sceneCtx.fillText(entity.bubble.text, bx + padX, by + bh / 2);
    sceneCtx.restore();
  }

  // Jalur pejalan kaki di atas rumput
  function drawPath() {
    const y = pathY() - pathH() / 2;
    sceneCtx.fillStyle = '#cdb79e';
    sceneCtx.fillRect(0, y, W(), pathH());
    sceneCtx.fillStyle = 'rgba(255,255,255,0.25)';
    for (let i = 0; i < W(); i += 24) {
      sceneCtx.fillRect(i, y + 6, 12, 2);
    }
  }

  // Gambar manusia bergaya blok
  function drawPerson(px, py, facing, phase, palette) {
    const P = palette || { hair: '#2a2a2b', skin: '#f1d3b3', top: '#5fa8d3', bottom: '#3c2e22' };
    const step = Math.sin(phase * 1.1) * 2;
    const x = Math.round(px), y = Math.round(py);
    sceneCtx.save();
    sceneCtx.translate(x, y);
    sceneCtx.scale(facing, 1);

    // legs
    sceneCtx.fillStyle = P.bottom;
    sceneCtx.fillRect(-10, 22 + step, 10, 10);
    sceneCtx.fillRect(0, 22 - step, 10, 10);

    // body
    sceneCtx.fillStyle = P.top;
    sceneCtx.fillRect(-12, -2, 24, 26);

    // head
    sceneCtx.fillStyle = P.skin;
    sceneCtx.fillRect(-12, -20, 24, 18);
    sceneCtx.fillStyle = P.hair;
    sceneCtx.fillRect(-12, -20, 24, 6);
    sceneCtx.fillStyle = '#000000';
    sceneCtx.fillRect(4, -12, 3, 3); // eye

    // arms
    sceneCtx.fillStyle = P.skin;
    sceneCtx.fillRect(-16, 2, 8, 10);
    sceneCtx.fillRect(8, 2, 8, 10);

    sceneCtx.restore();
  }

  function updateCouples() {
    for (const c of couples) {
      c.phase += 0.12;
      c.x += c.dir * c.speed; // gerak horizontal lurus
      // wrap-around agar tidak zigzag bolak-balik
      if (c.dir > 0 && c.x > W() + 40) {
        c.x = -40;
      } else if (c.dir < 0 && c.x < -40) {
        c.x = W() + 40;
      }
      // snap ke piksel agar tidak jitter
      c.x = Math.round(c.x);
    }
  }

  function drawCouple(c) {
    // Turunkan lagi posisi ke bawah agar makin jauh dari kucing
    const baseY = pathY() + pathH() * 0.5 + 56;
    const facing = c.dir >= 0 ? 1 : -1;
    // dua orang berdekatan, offset 18px, tangan bertemu
    drawPerson(c.x - 9 * facing, baseY, facing, c.phase, { hair: '#3b3022', skin: '#f1d3b3', top: '#d34a4a', bottom: '#8b5a2b' });
    drawPerson(c.x + 9 * facing, baseY, facing, c.phase + 0.5, { hair: '#1f1f1f', skin: '#ecd0aa', top: '#6fa96b', bottom: '#3c2e22' });

    // tangan berpegangan (garis kecil)
    sceneCtx.save();
    sceneCtx.strokeStyle = '#f1d3b3';
    sceneCtx.lineWidth = 4;
    sceneCtx.beginPath();
    const tx = Math.round(c.x);
    const ty = Math.round(baseY + 6);
    sceneCtx.moveTo(tx - 4 * facing, ty);
    sceneCtx.lineTo(tx + 4 * facing, ty);
    sceneCtx.stroke();
    sceneCtx.restore();
  }

  function pickDialogue() {
    return dialogues[Math.floor(Math.random() * dialogues.length)];
  }

  function updateCoupleSpeech() {
    for (const c of couples) {
      if (!c.bubble) c.bubble = { text: null, timer: 0, cooldown: 120 };
      if (c.bubble.timer > 0) {
        c.bubble.timer--;
        if (c.bubble.timer <= 0) c.bubble.text = null;
      } else {
        c.bubble.cooldown--;
        if (c.bubble.cooldown <= 0) {
          c.bubble.text = pickDialogue();
          c.bubble.timer = 200 + Math.floor(Math.random() * 120);
          c.bubble.cooldown = 240 + Math.floor(Math.random() * 200);
        }
      }
    }
  }

  function drawSpeechBubble(c) {
    if (!c.bubble || !c.bubble.text) return;
    const baseY = H() * 0.74 + 24;
    const facing = c.dir >= 0 ? 1 : -1;
    const tx = Math.round(c.x);
    const ty = Math.round(baseY - 15); // di atas kepala (lebih dekat lagi)

    // Ukuran bubble berdasar teks
    sceneCtx.save();
    sceneCtx.font = '20px VT323, monospace';
    const metrics = sceneCtx.measureText(c.bubble.text);
    const padX = 12, padY = 8;
    const bw = Math.max(64, Math.round(metrics.width) + padX * 2);
    const bh = 28;

    // Kotak bubble
    const bx = tx - bw / 2;
    const by = ty - bh;
    sceneCtx.fillStyle = 'rgba(255,255,255,0.92)';
    sceneCtx.fillRect(bx, by, bw, bh);
    sceneCtx.strokeStyle = '#2a2a2a';
    sceneCtx.lineWidth = 2;
    sceneCtx.strokeRect(bx, by, bw, bh);

    // Ekor bubble mengarah ke tengah pasangan
    sceneCtx.beginPath();
    const tailX = tx + (facing > 0 ? -6 : 6);
    const tailY = by + bh;
    sceneCtx.moveTo(tailX, tailY);
    sceneCtx.lineTo(tailX + (facing > 0 ? -10 : 10), tailY + 8);
    sceneCtx.lineTo(tailX + (facing > 0 ? -2 : 2), tailY);
    sceneCtx.closePath();
    sceneCtx.fillStyle = 'rgba(255,255,255,0.92)';
    sceneCtx.fill();
    sceneCtx.strokeStyle = '#2a2a2a';
    sceneCtx.stroke();

    // Teks obrolan
    sceneCtx.fillStyle = '#1a1a1a';
    sceneCtx.textBaseline = 'middle';
    sceneCtx.fillText(c.bubble.text, bx + padX, by + bh / 2);
    sceneCtx.restore();
  }

  function drawLaptop() {
    const w = 160, h = 22;
    const x = W() * 0.68 - w * 0.5;
    const y = H() * 0.74 + 40;
    sceneCtx.fillStyle = '#c0c3c7';
    sceneCtx.fillRect(x, y, w, h);
    sceneCtx.fillStyle = '#a4a8ac';
    sceneCtx.fillRect(x + 6, y + 4, w - 12, h - 8);
  }

  function drawCup() {
    const x = W() * 0.37, y = H() * 0.72;
    sceneCtx.fillStyle = '#eae8e6';
    sceneCtx.fillRect(x, y, 26, 42);
    sceneCtx.fillStyle = '#bdb9b6';
    sceneCtx.fillRect(x + 3, y + 4, 20, 30);
    sceneCtx.fillStyle = '#c38753';
    sceneCtx.fillRect(x + 6, y + 6, 14, 22);
    sceneCtx.fillStyle = '#f4d7c1';
    sceneCtx.fillRect(x + 10, y - 18, 4, 18);
  }

  function drawHedgehog() {
    const baseX = W() * 0.55;
    const baseY = H() * 0.74 + 16;
    const bob = Math.sin(hedgehogPhase) * 3;
    sceneCtx.fillStyle = '#8c6b4f';
    sceneCtx.fillRect(baseX - 36, baseY - 26 + bob, 72, 52);
    sceneCtx.fillStyle = '#e9d6c3';
    sceneCtx.fillRect(baseX + 20, baseY - 12 + bob, 18, 16);
    sceneCtx.fillStyle = '#000000';
    sceneCtx.fillRect(baseX + 34, baseY - 8 + bob, 4, 4);
  }

  function loop(now) {
    sceneCtx.clearRect(0, 0, W(), H());
    drawGround();
    drawFence();
    drawWaterStream(now);
    drawTree(W() * 0.2, H() * 0.62, 1.1);
    drawTree(W() * 0.85, H() * 0.6, 1.0);
    drawForest();
    drawPath();
    drawBlanket();
    drawGiftBox();
    drawGiftBoxes();
    drawBalloons(now);
    updateCouples();
    updateCoupleSpeech();
    drawCouple(couples[0]);
    drawCouple(couples[1]);
    drawSpeechBubble(couples[0]);
    drawSpeechBubble(couples[1]);
    updateCat();
    drawCat();
    updateMoreCats();
    drawMoreCats();
    // Perbarui dan gambar bubble dialog untuk kucing
    updateCatsSpeech();
    drawCatSpeechBubble(cat);
    for (const mc of moreCats) drawCatSpeechBubble(mc);
    hedgehogPhase += 0.02;
    drawHedgehog();
    sceneAnimId = requestAnimationFrame(loop);
  }

  if (sceneAnimId) cancelAnimationFrame(sceneAnimId);
  sceneAnimId = requestAnimationFrame(loop);

  window.addEventListener('resize', resize);
  window.addEventListener('resize', resetCat);
  window.addEventListener('resize', resetMoreCats);
  window.addEventListener('resize', resetCouples);
}

// Event listeners
startBtn.addEventListener('click', async () => {
  // Minta fullscreen berdasarkan gesture pengguna (disyaratkan oleh browser)
  try {
    const el = document.documentElement;
    if (el.requestFullscreen) {
      await el.requestFullscreen();
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    }
  } catch {}
  showLoader(500, showStory);
});
submitBtn.addEventListener('click', handleSubmit);
answerInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleSubmit();
});
if (pwClose) pwClose.addEventListener('click', handleCloseQuiz);
if (storyNextBtn) storyNextBtn.addEventListener('click', nextStory);
if (storyCloseBtn) storyCloseBtn.addEventListener('click', () => {
  if (storyModal) storyModal.style.display = 'none';
  showLoader(400, showQuiz);
});

// Inisialisasi awal
initCloudsCanvas();
initPicnicScene();
showGate();
// ===== WhatsApp helpers =====
function normalizePhone(phone) {
  const onlyDigits = (phone || '').replace(/\D+/g, '');
  if (!onlyDigits) return '';
  // Jika mulai dengan '0', ubah ke format internasional Indonesia '62'
  if (onlyDigits.startsWith('0')) {
    return '62' + onlyDigits.slice(1);
  }
  return onlyDigits;
}

function buildWhatsAppLink(text, phone) {
  const encodedText = encodeURIComponent(text || '');
  const p = normalizePhone(phone);
  if (p) return `https://wa.me/${p}?text=${encodedText}`;
  return `https://wa.me/?text=${encodedText}`;
}

function wireWhatsAppForm() {
  // Bind fleksibel: dukung 1 atau lebih kolom, tanpa early return
  // Isi default nomor jika kosong
  if (waNumber && !waNumber.value) {
    waNumber.value = '081385462587';
  }
  const bind = (btn, input) => {
    if (!btn || !input) return;
    btn.onclick = () => {
      const text = input.value.trim();
      if (!text) return;
      const url = buildWhatsAppLink(text, waNumber && waNumber.value);
      try { window.open(url, '_blank'); } catch {}
    };
  };
  bind(waSend1, waMsg1);
  bind(waSend2, waMsg2);
  bind(waSend3, waMsg3);
}