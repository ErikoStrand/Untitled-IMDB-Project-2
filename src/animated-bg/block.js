function createFlyingNotes() {
  const container = document.getElementById('flying-notes-container');
  const notes = ['🎬', '🎥', '📽️', '🎞️', '🎫', '🍿', '🎭', '🎪'];
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FDCB6E', '#6C5CE7'];

  function removeOutOfViewNotes() {
      const allNotes = container.querySelectorAll('.flying-note');
      allNotes.forEach(note => {
          const rect = note.getBoundingClientRect();
          if (rect.bottom < 0 || rect.top > window.innerHeight) {
              note.remove();
          }
      });
  }

  setInterval(() => {
      const note = document.createElement('div');
      note.className = 'flying-note';
      note.textContent = notes[Math.floor(Math.random() * notes.length)];
      note.style.left = `${Math.random() * 100}%`;
      note.style.color = colors[Math.floor(Math.random() * colors.length)];
      note.style.animationDuration = `${2 + Math.random() * 20}s`;

      container.appendChild(note);

      // Remove the note after animation completes

  }, 500);

  // Check and remove out-of-view notes periodically
  setInterval(removeOutOfViewNotes, 100);
}

// Start the animation when the page loads
window.addEventListener('load', createFlyingNotes);