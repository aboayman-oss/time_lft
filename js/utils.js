
export function animateText(el, text) {
  gsap.to(el, { opacity: 0, duration: 0.3, onComplete: () => {
    el.innerText = text;
    gsap.to(el, { opacity: 1, duration: 0.3 });
  }});
}

export function showError(el, msg) {
  animateText(el, msg);
  gsap.fromTo(el, { x: -10 }, { x: 10, repeat: 5, yoyo: true, duration: 0.05 });
}

export function updateBar(id, percent) {
  document.getElementById(id).style.width = Math.min(percent * 100, 100) + "%";
}

export function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}h ${minutes}m ${seconds}s`;
}

export function formatHM(ms) {
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
}
