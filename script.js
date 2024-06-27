let users = JSON.parse(localStorage.getItem('users')) || {};
let currentUser = null;
let userClickCount = 0;
const clickButton = document.getElementById('click-button');
const clickCountDisplay = document.getElementById('click-count');
const floatingNumbersContainer = document.getElementById('floating-numbers');
const loginButton = document.getElementById('login');
const logoutButton = document.getElementById('logout');
const usernameInput = document.getElementById('username');
const authContainer = document.getElementById('auth');
const gameContainer = document.getElementById('game');
const userNameDisplay = document.getElementById('user-name');
const userStatsTable = document.getElementById('user-stats').querySelector('tbody');
const allUsersList = document.getElementById('all-users');
const burgerMenu = document.getElementById('burger-menu');

let comboActive = false;
let comboMultiplier = 1;
let comboTimeout;

function login() {
  const username = usernameInput.value.trim();
  if (username) {
    currentUser = username;
    if (!users[username]) {
      users[username] = { clicks: 0 };
    }
    localStorage.setItem('users', JSON.stringify(users));
    updateUI();
  }
}

function logout() {
  currentUser = null;
  updateUI();
}

function updateUI() {
  if (currentUser) {
    authContainer.style.display = 'none';
    gameContainer.style.display = 'block';
    userNameDisplay.textContent = currentUser;
    clickCountDisplay.textContent = users[currentUser].clicks;
    updateStats();
  } else {
    authContainer.style.display = 'block';
    gameContainer.style.display = 'none';
  }
}

function updateStats() {
  const sortedUsers = Object.entries(users).sort((a, b) => b[1].clicks - a[1].clicks);
  userStatsTable.innerHTML = '';
  sortedUsers.slice(0, 10).forEach(([username, data]) => {
    const row = document.createElement('tr');
    const nameCell = document.createElement('td');
    const clicksCell = document.createElement('td');
    nameCell.textContent = username;
    clicksCell.textContent = data.clicks;
    row.appendChild(nameCell);
    row.appendChild(clicksCell);
    userStatsTable.appendChild(row);
  });
  updateAllUsersList();
}

function updateAllUsersList() {
  allUsersList.innerHTML = '';
  Object.keys(users).forEach((username) => {
    const userItem = document.createElement('li');
    userItem.textContent = username;
    allUsersList.appendChild(userItem);
  });
}

function animateButton() {
  clickButton.classList.add('active');
  setTimeout(() => {
    clickButton.classList.remove('active');
  }, 100);
}

function showFloatingNumber(number) {
  const floatingNumber = document.createElement('div');
  floatingNumber.textContent = `+${number}`;
  floatingNumber.className = 'floating-number';
  floatingNumber.style.left = `${Math.random() * 80 + 10}%`;
  floatingNumber.style.top = `${Math.random() * 50 + 25}%`;
  floatingNumbersContainer.appendChild(floatingNumber);
  setTimeout(() => {
    floatingNumbersContainer.removeChild(floatingNumber);
    moveFloatingNumberToTable(number);
  }, 1000);
}

function moveFloatingNumberToTable(number) {
  const movingNumber = document.createElement('div');
  movingNumber.textContent = `+${number}`;
  movingNumber.className = 'moving-number';
  document.body.appendChild(movingNumber);

  const table = document.getElementById('user-stats');
  const rect = table.getBoundingClientRect();
  const endX = rect.left + rect.width / 2;
  const endY = rect.top;

  movingNumber.style.left = `${window.innerWidth / 2}px`;
  movingNumber.style.top = `${window.innerHeight / 2}px`;

  setTimeout(() => {
    movingNumber.style.left = `${endX}px`;
    movingNumber.style.top = `${endY}px`;
  }, 10);

  setTimeout(() => {
    document.body.removeChild(movingNumber);
    users[currentUser].clicks += number;
    updateStatsWithAnimation(currentUser, number);
    localStorage.setItem('users', JSON.stringify(users));
  }, 1000);
}

function updateStatsWithAnimation(username, number) {
  const rows = userStatsTable.getElementsByTagName('tr');
  for (let row of rows) {
    if (row.firstChild.textContent === username) {
      const clicksCell = row.lastChild;
      const currentClicks = parseInt(clicksCell.textContent, 10);
      const newClicks = currentClicks + number;
      clicksCell.textContent = newClicks;
      clicksCell.classList.add('animated-update');
      setTimeout(() => {
        clicksCell.classList.remove('animated-update');
      }, 500);
      break;
    }
  }
}


function clickHandler() {
  userClickCount += comboMultiplier;
  showFloatingNumber(comboMultiplier);
  animateButton();
  activateCombo();
}

loginButton.addEventListener('click', login);
logoutButton.addEventListener('click', logout);
clickButton.addEventListener('click', clickHandler);

function activateCombo() {
  if (comboActive) {
    clearTimeout(comboTimeout);
  } else {
    comboActive = true;
    determineComboMultiplier();
    showComboIndicator();
  }

  comboTimeout = setTimeout(() => {
    comboActive = false;
    comboMultiplier = 1;
    hideComboIndicator();
  }, 3000);
}

function determineComboMultiplier() {
  const randomValue = Math.random();
  if (randomValue < 0.01) {
    comboMultiplier = 3;
  } else if (randomValue < 0.1) {
    comboMultiplier = 2;
  } else {
    comboMultiplier = 1;
  }
}

function showComboIndicator() {
  const comboDisplay = document.getElementById('combo-display');
  comboDisplay.textContent = `x${comboMultiplier}`;
  comboDisplay.style.display = 'block';
  comboDisplay.classList.add('active');
}

function hideComboIndicator() {
  const comboDisplay = document.getElementById('combo-display');
  comboDisplay.style.display = 'none';
  comboDisplay.classList.remove('active');
}

burgerMenu.addEventListener('click', () => {
  const userList = burgerMenu.querySelector('.user-list');
  userList.classList.toggle('open');
  if (userList.classList.contains('open')) {
    userList.style.animation = 'slideIn 0.5s forwards';
  } else {
    userList.style.animation = 'slideOut 0.5s forwards';
  }
});
