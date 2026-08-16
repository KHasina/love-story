/**
 * =========================================================================
 * Notre Histoire d'Amour - Logique JavaScript Vanilla
 * =========================================================================
 */

let currentPage = 1;
const totalPages = 9;
let noClickCount = 0;
let isMusicPlaying = false;

const teasingMessages = ["Hmm... tu es sûre ? 😂","Tu réfléchis encore ? 👀","Ce bouton est plus rapide que toi ! 😜","Il n'y a qu'une seule vraie bonne réponse... ✨","Bon... je crois que tu connais déjà la bonne réponse 😌"];
const typewriterLines = ["Je voulais te préparer quelque chose de différent.","Pas un simple message.","Pas une simple photo.","Mais un petit endroit qui rassemble quelques souvenirs, quelques sourires et quelques mots que je voulais te laisser.","Alors prends quelques minutes...","Et découvre."];
const photosList = [{"id":"p1","url":"https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80","caption":"Un souvenir que je garde précieusement.","date":"Un après-midi inoubliable"},{"id":"p2","url":"https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80","caption":"Ce fou rire partagé ensemble.","date":"Notre premier voyage"},{"id":"p3","url":"https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80","caption":"Ce regard qui me fait toujours craquer.","date":"Une soirée magique"},{"id":"p4","url":"https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80","caption":"Quand le temps s'arrête simplement quand tu es là.","date":"Balade sous les lumières"},{"id":"p5","url":"https://images.unsplash.com/photo-1494774157365-9e04c6720e47?auto=format&fit=crop&w=800&q=80","caption":"La douceur de nos petits moments à deux.","date":"Instant précieux"}];

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initMusicButton();
  updateProgress();

  document.getElementById('start-btn').addEventListener('click', () => {
    nextPage();
    playMusic();
  });
});

// Navigate to a specific page
function goToPage(pageNum) {
  if (pageNum < 1 || pageNum > totalPages) return;
  
  const currentElem = document.getElementById('page-' + currentPage);
  const targetElem = document.getElementById('page-' + pageNum);

  if (currentElem) currentElem.classList.remove('active');
  if (targetElem) targetElem.classList.add('active');

  currentPage = pageNum;
  updateProgress();
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Trigger page-specific behaviors
  if (currentPage === 2) {
    startTypewriter();
  } else if (currentPage === 9) {
    launchConfetti();
  }
}

function nextPage() {
  goToPage(currentPage + 1);
}

function prevPage() {
  goToPage(currentPage - 1);
}

function updateProgress() {
  const fill = document.getElementById('progress-fill');
  const text = document.getElementById('progress-text');
  if (fill && text) {
    fill.style.width = (currentPage / totalPages * 100) + '%';
    text.textContent = currentPage + ' / ' + totalPages;
  }
}

// Typewriter effect for Page 2
let typewriterDone = false;
function startTypewriter() {
  const container = document.getElementById('typewriter-box');
  if (!container || typewriterDone) return;
  typewriterDone = true;
  container.innerHTML = '';

  let lineIdx = 0;
  let charIdx = 0;
  let currentP = document.createElement('p');
  container.appendChild(currentP);

  function typeChar() {
    if (lineIdx >= typewriterLines.length) return;

    const line = typewriterLines[lineIdx];
    if (charIdx < line.length) {
      currentP.textContent += line.charAt(charIdx);
      charIdx++;
      setTimeout(typeChar, 28);
    } else {
      lineIdx++;
      charIdx = 0;
      if (lineIdx < typewriterLines.length) {
        currentP = document.createElement('p');
        currentP.style.marginTop = '12px';
        container.appendChild(currentP);
        setTimeout(typeChar, 350);
      }
    }
  }

  typeChar();
}

// Mini Game: Runaway No button
/*function moveNoButton(e) {
  if (e) e.preventDefault();
  const noBtn = document.getElementById('no-btn');
  const arena = document.getElementById('game-arena');
  const feedback = document.getElementById('tease-feedback');
  if (!noBtn || !arena) return;

  noClickCount++;

  // Update teasing feedback text
  const msgIdx = (noClickCount - 1) % teasingMessages.length;
  if (feedback) {
    feedback.textContent = teasingMessages[msgIdx];
  }

  // Random relative position within reasonable bounds
  const maxOffset = Math.min(window.innerWidth * 0.35, 120);
  const randomX = (Math.random() - 0.5) * maxOffset * 2;
  const randomY = (Math.random() - 0.5) * 80;

  noBtn.style.transform = `translate(${randomX}px, ${randomY}px) scale(0.92)`;
}
*/

function moveNoButton(e) {
  if (e) e.preventDefault();

  const noBtn = document.getElementById('no-btn');
  const arena = document.getElementById('game-arena');
  const feedback = document.getElementById('tease-feedback');

  if (!noBtn || !arena) return;

  noClickCount++;

  // Message taquin
  const msgIdx = (noClickCount - 1) % teasingMessages.length;
  if (feedback) {
    feedback.textContent = teasingMessages[msgIdx];
  }

  // Mouvement beaucoup plus grand
  const arenaRect = arena.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();

  const maxX = (arenaRect.width - btnRect.width) / 2;
  const maxY = (arenaRect.height - btnRect.height) / 2;

  // Position aléatoire très éloignée
  const randomX = (Math.random() * 2 - 1) * maxX;
  const randomY = (Math.random() * 2 - 1) * maxY;

  // Rotation + légère variation de taille
  const rotation = (Math.random() * 40) - 20;
  const scale = 0.85 + Math.random() * 0.15;

  noBtn.style.transition = 'transform 0.12s cubic-bezier(.17,.67,.2,1.3)';
  noBtn.style.transform =
    `translate(${randomX}px, ${randomY}px) rotate(${rotation}deg) scale(${scale})`;
}


function handleYesClick() {
  launchConfetti();
  createHeartsBurst();
  setTimeout(() => {
    nextPage();
  }, 1200);
}

// Quiz answers
function selectQuizAnswer(qIndex, reaction) {
  const reactionElem = document.getElementById('quiz-reaction-' + qIndex);
  if (reactionElem) {
    reactionElem.textContent = reaction;
  }
}

// Confetti & Celebration
function launchConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#fb7185', '#fda4af', '#ffffff', '#e11d48']
    });
  }
}

function launchLoveCelebration() {
  launchConfetti();
  for (let i = 0; i < 20; i++) {
    createFloatingHeart();
  }
}

// Background particles generator
function initParticles() {
  const container = document.getElementById('particles-container');
  if (!container) return;

  for (let i = 0; i < 15; i++) {
    const heart = document.createElement('div');
    heart.className = 'heart-particle';
    heart.innerHTML = '❤️';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = (6 + Math.random() * 6) + 's';
    heart.style.animationDelay = (Math.random() * 5) + 's';
    heart.style.fontSize = (12 + Math.random() * 16) + 'px';
    container.appendChild(heart);
  }
}

function createFloatingHeart() {
  const container = document.getElementById('particles-container');
  if (!container) return;
  const heart = document.createElement('div');
  heart.className = 'heart-particle';
  heart.innerHTML = ['💖', '💕', '🌹', '✨', '❤️'][Math.floor(Math.random() * 5)];
  heart.style.left = Math.random() * 100 + 'vw';
  heart.style.animationDuration = '4s';
  heart.style.fontSize = (18 + Math.random() * 18) + 'px';
  container.appendChild(heart);

  setTimeout(() => heart.remove(), 4000);
}

function createHeartsBurst() {
  for (let i = 0; i < 12; i++) {
    setTimeout(createFloatingHeart, i * 60);
  }
}

// Lightbox for photos
function openPhoto(index) {
  const photo = photosList[index];
  if (!photo) return;
  const lightbox = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  const caption = document.getElementById('lightbox-caption');

  if (lightbox && img && caption) {
    img.src = photo.url;
    caption.textContent = photo.caption || '';
    lightbox.classList.add('active');
  }
}

function closePhoto() {
  const lightbox = document.getElementById('lightbox');
  if (lightbox) lightbox.classList.remove('active');
}

// Audio management
function initMusicButton() {
  const btn = document.getElementById('music-btn');
  const audio = document.getElementById('bg-audio');
  if (!btn || !audio) return;

  btn.addEventListener('click', () => {
    if (isMusicPlaying) {
      audio.pause();
      isMusicPlaying = false;
      btn.querySelector('.music-text').textContent = 'Musique';
    } else {
      audio.play().catch(() => {});
      isMusicPlaying = true;
      btn.querySelector('.music-text').textContent = 'Pause ⏸️';
    }
  });
}

function playMusic() {
  const audio = document.getElementById('bg-audio');
  const btn = document.getElementById('music-btn');
  if (audio && !isMusicPlaying) {
    audio.play().then(() => {
      isMusicPlaying = true;
      if (btn) btn.querySelector('.music-text').textContent = 'Pause ⏸️';
    }).catch(() => {
      // Browsers block autoplay until user interacts
    });
  }
}
