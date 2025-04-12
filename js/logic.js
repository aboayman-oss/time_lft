
import { animateText, showError, updateBar, formatHM, formatTime } from './utils.js';

let targetTime = null;
const BASELINE_SLEEP_HOURS = 8;

export function startCalculation() {
  const input = document.getElementById('datetime-value').value;
  if (!input) return showError(document.getElementById('countdown'), 'Please select a valid date.');

  targetTime = new Date(input).getTime();
  if (targetTime < Date.now()) return showError(document.getElementById('countdown'), '⛔ Time already passed!');

  document.getElementById('sleep-block').style.display = 'block';
  document.getElementById('course-block').style.display = 'block';

  updateCountdown();
}

export function updateCountdown() {
  const now = Date.now();
  let remaining = targetTime - now;

  const days = Math.ceil(remaining / 86400000);
  const sleep = parseFloat(document.getElementById('sleepHours').value) || 0;
  const sleepMs = sleep * days * 3600000;
  const baselineSleepMs = BASELINE_SLEEP_HOURS * days * 3600000;
  const sleepDiffMs = baselineSleepMs - sleepMs;

  const course = parseFloat(document.getElementById('courseHours').value) || 0;
  const speed = parseFloat(document.getElementById('speed').value);
  const courseMs = (course / speed) * 3600000;
  const savedCourseMs = (course * 3600000) - courseMs;

  let totalDeductions = sleepMs + courseMs;
  if (totalDeductions > remaining) {
    totalDeductions = remaining;
  }

  const finalMs = Math.max(0, remaining - totalDeductions);

  updateBar("sleepBar", sleepMs / remaining);
  updateBar("courseBar", courseMs / remaining);

  animateText(document.getElementById("countdown"), `⏰ ${formatTime(finalMs)} left`);

  document.getElementById("summary").innerHTML = `
    <p><strong>Original:</strong> ${formatTime(remaining)}</p>
    <p><strong>– Sleep (${sleep}h/day):</strong> ${formatTime(sleepMs)}</p>
    <p><strong>– Courses (${course}h @ ${speed}x):</strong> ${formatTime(courseMs)}</p>
    <p><strong>= Final:</strong> ${formatTime(finalMs)}</p>
  `;

  const badge = document.getElementById('badge');
  let badgeHTML = '';

  if (sleepDiffMs > 0) {
    badgeHTML += `<div class="badge green">You saved ${formatHM(sleepDiffMs)} by sleeping less</div>`;
  } else if (sleepDiffMs < 0) {
    badgeHTML += `<div class="badge red">You lost ${formatHM(-sleepDiffMs)} by sleeping more</div>`;
  }

  if (savedCourseMs > 0) {
    badgeHTML += `<div class="badge green">You saved ${formatHM(savedCourseMs)} by watching faster</div>`;
  }

  badge.innerHTML = badgeHTML;
  badge.style.display = badgeHTML ? 'block' : 'none';
}

export function resetApp() {
  document.getElementById('datetime-value').value = '';
  document.getElementById('sleepHours').value = '';
  document.getElementById('courseHours').value = '';
  document.getElementById('summary').innerHTML = '';
  document.getElementById('sleep-block').style.display = 'none';
  document.getElementById('course-block').style.display = 'none';
  document.getElementById('sleepBar').style.width = '0';
  document.getElementById('courseBar').style.width = '0';
  document.getElementById('badge').style.display = 'none';
  animateText(document.getElementById('countdown'), '⏳');
}
