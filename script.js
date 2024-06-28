document.addEventListener('DOMContentLoaded', () => {
  const authContainer = document.getElementById('auth');
  const gameContainer = document.getElementById('game');
  const usernameInput = document.getElementById('username');
  const loginButton = document.getElementById('login');
  const logoutButton = document.getElementById('logout');
  const clickButton = document.getElementById('click-button');
  const clickCountSpan = document.getElementById('click-count');
  const userNameSpan = document.getElementById('user-name');
  const userStatsTable = document.getElementById('user-stats').querySelector('tbody');
  const floatingNumbersContainer = document.getElementById('floating-numbers');

  let currentUser = null;
  let clickCount = 0;

  const mockUsers = [
      { username: 'Alice', clickCount: 10 },
      { username: 'Bob', clickCount: 20 },
      { username: 'Charlie', clickCount: 15 },
      { username: 'Dave', clickCount: 5 },
      { username: 'Eve', clickCount: 25 },
      { username: 'Frank', clickCount: 8 },
      { username: 'Grace', clickCount: 22 },
      { username: 'Heidi', clickCount: 13 },
      { username: 'Ivan', clickCount: 30 },
      { username: 'Judy', clickCount: 18 },
  ];

  function updateLeaderboard() {
      userStatsTable.innerHTML = '';
      mockUsers.sort((a, b) => b.clickCount - a.clickCount);
      const topUsers = mockUsers.slice(0, 10);

      topUsers.forEach((user) => {
          const row = document.createElement('tr');
          const nameCell = document.createElement('td');
          const clickCell = document.createElement('td');

          nameCell.textContent = user.username;
          clickCell.textContent = user.clickCount;

          row.appendChild(nameCell);
          row.appendChild(clickCell);
          userStatsTable.appendChild(row);
      });
  }

  function showFloatingNumber(number) {
      const floatingNumber = document.createElement('div');
      floatingNumber.textContent = `+${number}`;
      floatingNumber.className = 'floating-number';

      // Випадковий вибір кольорового класу
      const colors = ['red', 'green', 'blue', 'orange', 'purple'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      floatingNumber.classList.add(randomColor);

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

      const rect = floatingNumbersContainer.getBoundingClientRect();
      movingNumber.style.left = `${rect.left + rect.width / 2}px`;
      movingNumber.style.top = `${rect.top}px`;

      const userRow = Array.from(userStatsTable.rows).find(row => row.cells[0].textContent === currentUser.username);
      if (userRow) {
          const cellRect = userRow.cells[1].getBoundingClientRect();
          setTimeout(() => {
              movingNumber.style.left = `${cellRect.left + cellRect.width / 2}px`;
              movingNumber.style.top = `${cellRect.top}px`;
              setTimeout(() => {
                  document.body.removeChild(movingNumber);
                  updateLeaderboard();
              }, 1000);
          }, 100);
      } else {
          document.body.removeChild(movingNumber);
      }
  }

  loginButton.addEventListener('click', () => {
      const username = usernameInput.value.trim();
      if (username) {
          currentUser = mockUsers.find(user => user.username === username);
          if (!currentUser) {
              currentUser = { username: username, clickCount: 0 };
              mockUsers.push(currentUser);
          }
          clickCount = currentUser.clickCount;
          clickCountSpan.textContent = clickCount;
          userNameSpan.textContent = currentUser.username;
          authContainer.style.display = 'none';
          gameContainer.style.display = 'block';
          updateLeaderboard();
      }
  });

  logoutButton.addEventListener('click', () => {
      authContainer.style.display = 'block';
      gameContainer.style.display = 'none';
      usernameInput.value = '';
      currentUser = null;
  });

  clickButton.addEventListener('click', () => {
      clickCount++;
      currentUser.clickCount = clickCount;
      clickCountSpan.textContent = clickCount;
      showFloatingNumber(1);
      updateLeaderboard();
  });
});
