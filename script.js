const users = JSON.parse(localStorage.getItem('users')) || {};
let currentUser = null;
let userClickCount = 0;
let globalClickCount = 0;
let comboActive = false;
let lastClickTime = 0;
let comboTimeout = null;
let clickStreak = 0;

const authSection = document.getElementById('auth');
const gameSection = document.getElementById('game');
const userNameDisplay = document.getElementById('user-name');
const clickButton = document.getElementById('click-button');
const clickCountDisplay = document.getElementById('click-count');
const userStatsTableBody = document.querySelector('#user-stats tbody');
const allUsersList = document.getElementById('all-users');
const usernameInput = document.getElementById('username');
const loginButton = document.getElementById('login');
const logoutButton = document.getElementById('logout');
const floatingNumbersContainer = document.getElementById('floating-numbers');

function updateStats() {
  userStatsTableBody.innerHTML = '';
  allUsersList.innerHTML = '';

  const sortedUsers = Object.entries(users).sort((a, b) => b[1].clicks - a[1].clicks);

  sortedUsers.slice(0, 10).forEach(([name, stats]) => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${name}</td><td>${stats.clicks}</td>`;
    userStatsTableBody.appendChild(row);
  });

  sortedUsers.forEach(([name]) => {
    const listItem = document.createElement('li');
    listItem.textContent = name;
    allUsersList.appendChild(listItem);
  });
}

function login() {
  const username = usernameInput.value.trim();
  if (!username) {
    alert("Введіть ім'я користувача!");
    return;
  }
  if (!users[username]) {
    users[username] = { clicks: 0 };
  }
  currentUser = username;
  userClickCount = 0;
  localStorage.setItem('users', JSON.stringify(users));
  showGame();
}

function showGame() {
  authSection.style.display = 'none';
  gameSection.style.display = 'block';
  userNameDisplay.textContent = currentUser;
  clickCountDisplay.textContent = users[currentUser].clicks;
  updateStats();
}

function logout() {
  currentUser = null;
  authSection.style.display = 'block';
  gameSection.style.display = 'none';
}

function clickHandler() {
  const currentTime = Date.now();
  if (currentTime - lastClickTime < 500) {
    clickStreak++;
    if (clickStreak >= 5) {
      comboActive = true;
      clearTimeout(comboTimeout);
      comboTimeout = setTimeout(() => {
        comboActive = false;
      }, 3000);
      showCombo();
      clickStreak = 0;
    }
  } else {
    clickStreak = 0;
  }
  lastClickTime = currentTime;

  const points = comboActive ? 2 : 1;
  users[currentUser].clicks += points;
  clickCountDisplay.textContent = users[currentUser].clicks;
  localStorage.setItem('users', JSON.stringify(users));
  updateStats();
  userClickCount += points;
  showFloatingNumber(points);
  animateButton();
}

function animateButton() {
  clickButton.style.transform = 'scale(0.95)';
  setTimeout(() => {
    clickButton.style.transform = 'scale(1)';
  }, 100);
}

function showFloatingNumber(points) {
  globalClickCount += 1;
  const numberElement = document.createElement('div');
  numberElement.className = `floating-number color${(globalClickCount % 5) + 1}`;
  numberElement.textContent = `+${points}`;
  numberElement.style.left = `${Math.random() * 80 + 10}%`;
  floatingNumbersContainer.appendChild(numberElement);

  setTimeout(() => {
    floatingNumbersContainer.removeChild(numberElement);
  }, 1000);
}

function showCombo() {
  const comboElement = document.createElement('div');
  comboElement.className = 'floating-combo';
  comboElement.textContent = 'Комбо x2!';
  document.body.appendChild(comboElement);

  setTimeout(() => {
    document.body.removeChild(comboElement);
  }, 1000);
}

loginButton.addEventListener('click', login);
logoutButton.addEventListener('click', logout);
clickButton.addEventListener('click', clickHandler);
