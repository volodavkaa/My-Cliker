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
    const burgerIcon = document.querySelector('.burger-icon');
    const userList = document.querySelector('.user-list');

    let currentUser = null;
    let clickCount = 0;

    const mockUsers = JSON.parse(localStorage.getItem('mockUsers')) || [
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

    function saveUsers() {
        localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
    }

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

    function showFloatingNumber(number, multiplier) {
        const floatingNumber = document.createElement('div');
        floatingNumber.textContent = `+${number * multiplier}`;
        floatingNumber.className = 'floating-number';

        const colors = ['red', 'green', 'blue', 'orange', 'purple'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        floatingNumber.classList.add(randomColor);

        const rect = clickButton.getBoundingClientRect();
        floatingNumber.style.left = `${rect.left + rect.width / 2}px`;
        floatingNumber.style.top = `${rect.top}px`;

        document.body.appendChild(floatingNumber);

        moveFloatingNumberToTable(floatingNumber, number * multiplier);
    }

    function moveFloatingNumberToTable(floatingNumber, number) {
        const userRow = Array.from(userStatsTable.rows).find(row => row.cells[0].textContent === currentUser.username);
        if (userRow) {
            const cellRect = userRow.cells[1].getBoundingClientRect();
            floatingNumber.style.transition = 'all 1s ease-in-out';
            floatingNumber.style.left = `${cellRect.left + cellRect.width / 2}px`;
            floatingNumber.style.top = `${cellRect.top}px`;

            setTimeout(() => {
                document.body.removeChild(floatingNumber);
                updateLeaderboard();
                userRow.cells[1].classList.add('animated-cell');
                setTimeout(() => {
                    userRow.cells[1].classList.remove('animated-cell');
                }, 1000);
            }, 1000);
        } else {
            document.body.removeChild(floatingNumber);
        }
    }

    function getRandomMultiplier() {
        const chance = Math.random();
        if (chance < 0.05) {  // 5% шанс на х3
            return 3;
        } else if (chance < 0.2) {  // 15% шанс на х2
            return 2;
        } else {
            return 1;
        }
    }

    function updateBurgerMenu() {
        userList.innerHTML = ''; // Очищаємо список

        mockUsers.forEach(user => {
            const listItem = document.createElement('li');
            listItem.textContent = user.username;
            userList.appendChild(listItem);
        });
    }

    loginButton.addEventListener('click', () => {
        const username = usernameInput.value.trim();
        if (username) {
            currentUser = mockUsers.find(user => user.username === username);
            if (!currentUser) {
                currentUser = { username: username, clickCount: 0 };
                mockUsers.push(currentUser);
                saveUsers();
            }
            clickCount = currentUser.clickCount;
            clickCountSpan.textContent = clickCount;
            userNameSpan.textContent = currentUser.username;
            authContainer.style.display = 'none';
            gameContainer.style.display = 'block';
            updateLeaderboard();
            updateBurgerMenu(); // Оновлюємо бургер-меню
        }
    });

    logoutButton.addEventListener('click', () => {
        authContainer.style.display = 'block';
        gameContainer.style.display = 'none';
        usernameInput.value = '';
        currentUser = null;
        updateBurgerMenu(); // Оновлюємо бургер-меню
    });

    clickButton.addEventListener('click', () => {
        const multiplier = getRandomMultiplier();
        clickCount += multiplier;
        currentUser.clickCount = clickCount;
        clickCountSpan.textContent = clickCount;
        showFloatingNumber(1, multiplier);
        saveUsers();
        updateLeaderboard();
    });

    burgerIcon.addEventListener('click', () => {
        userList.classList.toggle('open');
        burgerIcon.classList.toggle('open');
    });

    // Ініціалізуємо бургер-меню та таблицю рекордів при завантаженні
    updateBurgerMenu();
    updateLeaderboard();
});