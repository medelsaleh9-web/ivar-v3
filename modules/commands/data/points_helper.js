const fs = require('fs');
const path = require('path');
const statePath = path.join(__dirname, 'malakState.json');

function getState() {
  try { return JSON.parse(fs.readFileSync(statePath, 'utf-8')); }
  catch { return {}; }
}
function saveState(s) {
  fs.writeFileSync(statePath, JSON.stringify(s, null, 2));
}
function getPoints(userID) {
  const s = getState();
  return (s.points && s.points[userID]) || 0;
}
function addPoints(userID, amount) {
  const s = getState();
  if (!s.points) s.points = {};
  s.points[userID] = (s.points[userID] || 0) + amount;
  saveState(s);
  return s.points[userID];
}
function setPoints(userID, amount) {
  const s = getState();
  if (!s.points) s.points = {};
  s.points[userID] = amount;
  saveState(s);
  return amount;
}
module.exports = { getPoints, addPoints, setPoints, getState, saveState };
