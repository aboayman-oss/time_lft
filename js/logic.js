
import { animateText, showError, updateBar, formatTime, formatHM } from './utils.js';

let targetTime = null;

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
  const course = parseFloat(document.getElementById('courseHours').value) || 0;
  const speed = parseFloat(document.getElementById('speed').value);

  const baselineSleep = 8;
  const actualSleepMs = sleep * days * 3600000;
  const baselineSleepMs = baselineSleep * days * 3600000;
  const sleepDiffMs = baselineSleepMs - actualSleepMs;

  const courseMs = (course / speed) * 3600000;
  const savedCourseMs = course * 3600000 - courseMs;

  const cappedSleepMs = Math.min(actualSleepMs, remaining);
  const cappedCourseMs = Math.min(courseMs, remaining - cappedSleepMs);
  const finalMs = Math.max(remaining - cappedSleepMs - cappedCourseMs, 0);

  updateBar("sleepBar", cappedSleepMs / remaining);
  updateBar("courseBar", cappedCourseMs / remaining);

  animateText(document.getElementById("countdown"), `⏰ ${formatTime(finalMs)} left`);

  document.getElementById("summary").innerHTML = `
    <p><strong>Original:</strong> ${formatTime(remaining)}</p>
    <p><strong>– Sleep (${sleep}h/day):</strong> ${formatTime(cappedSleepMs)}</p>
    <p><strong>– Courses (${course}h @ ${speed}x):</strong> ${formatTime(cappedCourseMs)}</p>
    <p><strong>= Final:</strong> ${formatTime(finalMs)}</p>
  `;

  const badge = document.getElementById('badge');
  let result = "";

  if (sleepDiffMs > 0) {
    result += `<div class="save-box">You saved ${formatHM(sleepDiffMs)} by sleeping less</div>`;
  } else if (sleepDiffMs < 0) {
    result += `<div class="lost-box">You lost ${formatHM(-sleepDiffMs)} by oversleeping</div>`;
  }

  if (savedCourseMs > 0) {
    result += `<div class="save-box">You saved ${formatHM(savedCourseMs)} by watching faster</div>`;
  }

  badge.innerHTML = result;
  badge.style.display = result ? 'block' : 'none';
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
  document.getElementById('badge').innerHTML = '';
  animateText(document.getElementById('countdown'), '⏳');
}
