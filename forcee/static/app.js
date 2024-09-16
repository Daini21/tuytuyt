const tg = window.Telegram.WebApp;

let energy = 100;
const maxEnergy = 100;
const energyRegenAmount = 6;
const energyRegenInterval = 3000;
let isTouching = false;
let lastUpdate = Date.now();
let tapAmount = 1; // Значение дохода за свайп

// Обновление интерфейса энергии
function updateEnergy() {
    document.getElementById('energy-value').innerText = `${energy}/${maxEnergy}`;
}

// Создание и позиционирование анимации "+1" или большего значения
function createTapValue(x, y) {
    const tapValue = document.createElement('div');
    tapValue.classList.add('tap-value');
    tapValue.innerText = `+${tapAmount}`;
    tapValue.style.left = x + 'px';
    tapValue.style.top = y + 'px';
    tapValue.style.color = 'white'; // Белый цвет текста
    document.body.appendChild(tapValue);

    setTimeout(() => tapValue.remove(), 500); // Удаление анимации через 0.5 секунд
}

// Логика управления монеткой по жесту
function handleCoinGesture(event) {
    if (energy > 0) {
        let currentTime = Date.now();
        if (currentTime - lastUpdate >= 100) { // Проверка интервала 0.1 секунды
            let coins = parseInt(document.getElementById('coins').innerText);
            coins += tapAmount; // Увеличиваем количество монет в соответствии с tapAmount
            document.getElementById('coins').innerText = coins;

            // Показ анимации на месте касания
            const rect = event.target.getBoundingClientRect();
            createTapValue(event.clientX - rect.left, event.clientY - rect.top);

            // Уменьшение энергии на 1
            energy -= 1;
            updateEnergy();

            lastUpdate = currentTime; // Обновляем время последнего обновления
        }
    }
}

// Обработка жеста касания для монетки
function setupGesture() {
    const coinElement = document.getElementById('coin');
    
    coinElement.addEventListener('mousedown', () => isTouching = true);
    coinElement.addEventListener('mouseup', () => isTouching = false);
    coinElement.addEventListener('mouseleave', () => isTouching = false);
    coinElement.addEventListener('mousemove', (event) => {
        if (isTouching) {
            handleCoinGesture(event);
        }
    });

    coinElement.addEventListener('touchstart', (event) => {
        isTouching = true;
        handleCoinGesture(event.touches[0]);
    });

    coinElement.addEventListener('touchend', () => isTouching = false);
    coinElement.addEventListener('touchmove', (event) => {
        if (isTouching) {
            handleCoinGesture(event.touches[0]);
        }
    });
}

// Восстановление энергии
setInterval(() => {
    if (energy < maxEnergy) {
        energy = Math.min(energy + energyRegenAmount, maxEnergy);
        updateEnergy();
    }
}, energyRegenInterval);

// Инициализация интерфейса
updateEnergy();

// Инициализация обработки жестов
setupGesture();

// Информация о карточках
const cards = [
    { id: 1, price: 200, incomePerHour: 500, incomePerSecond: 500 / 3600 },
    { id: 2, price: 300, incomePerHour: 750, incomePerSecond: 750 / 3600 }
    // Добавьте больше карточек при необходимости
];

// Обновление информации о карточках
function updateCardInfo() {
    cards.forEach(card => {
        const cardElement = document.querySelector(`.card[data-card="${card.id}"]`);
        if (cardElement) {
            cardElement.querySelector('.card-price').innerText = `Цена: ${card.price} монет`;
            cardElement.querySelector('.card-income').innerText = `Доход в час: ${card.incomePerHour} монет`;
        }
    });
}

// Обработка прокачки карточек
function setUpUpgradeButtons() {
    document.querySelectorAll('.upgrade-button').forEach(button => {
        button.addEventListener('click', () => {
            const cardId = parseInt(button.getAttribute('data-card'));
            const card = cards.find(c => c.id === cardId);
            const coins = parseInt(document.getElementById('coins').innerText);

            if (coins >= card.price) {
                // Уменьшение баланса
                document.getElementById('coins').innerText = coins - card.price;

                // Увеличение дохода и цены
                card.price = Math.round(card.price * 1.5);
                card.incomePerHour *= 1.5;
                card.incomePerSecond = card.incomePerHour / 3600;

                // Обновление информации
                updateCardInfo();
            } else {
                alert('Недостаточно монет!');
            }
        });
    });
}

// Обновление баланса каждые 2 секунды на основе дохода от карточек
setInterval(() => {
    const totalIncomePerSecond = cards.reduce((total, card) => total + card.incomePerSecond, 0);
    let coins = parseInt(document.getElementById('coins').innerText);
    coins += totalIncomePerSecond * 2; // Обновляем баланс каждые 2 секунды
    document.getElementById('coins').innerText = Math.round(coins);
}, 2000);

// Функция для обновления информации о балансе и доходе на экране карточек
function updateBottomInfo() {
    const coins = document.getElementById('coins').innerText;
    const income = cards.reduce((total, card) => total + card.incomePerHour, 0);

    document.getElementById('cards-coins').innerText = coins;
    document.getElementById('cards-income').innerText = income;
}

function switchScreen(targetScreenId) {
    // Скрываем все экраны
    document.querySelectorAll('.screen').forEach(screen => {
        if (screen.classList.contains(targetScreenId)) {
            screen.style.display = 'block'; // Отображаем выбранный экран
        } else {
            screen.style.display = 'none'; // Скрываем остальные
        }
    });
    // Навигационная панель всегда остаётся видимой
    document.querySelector('.nav').style.display = 'flex';
}

// Обработчики кнопок навигации
document.querySelectorAll('.nav button').forEach(button => {
    button.addEventListener('click', function() {
        const targetScreen = button.getAttribute('data-target');
        switchScreen(targetScreen);
    });
});

// Инициализация после загрузки документа
document.addEventListener("DOMContentLoaded", function() {
    // Установка начального экрана
    switchScreen('main-screen');

    // Обработчик событий для кнопок "Прокачать"
    setUpUpgradeButtons();
    
    // Получаем данные пользователя из Telegram
    document.getElementById('username').innerText = tg.initDataUnsafe?.user?.first_name || "Username";
    document.getElementById('profile-pic').src = tg.initDataUnsafe?.user?.photo_url || 'https://via.placeholder.com/50';
});

// Логика слота
const slotItems = ['🍒', '🍋', '🍊', '🍉', '🍇', '🍓']; // Возможные символы слота

function getRandomSlotItem() {
    return slotItems[Math.floor(Math.random() * slotItems.length)];
}

function spinSlot() {
    const slotRows = document.querySelectorAll('.slot-row');
    slotRows.forEach(row => {
        row.querySelectorAll('.slot-item').forEach(item => {
            item.innerText = getRandomSlotItem();
        });
    });

    setTimeout(() => {
        checkSlotResults();
    }, 1000); // Проверяем результаты через 1 секунду
}

function checkSlotResults() {
    const rows = Array.from(document.querySelectorAll('.slot-row'));
    const results = rows.map(row => Array.from(row.querySelectorAll('.slot-item')).map(item => item.innerText));
    const uniqueResults = [...new Set(results.flat())];

    if (uniqueResults.length === 1) {
        alert('Congratulations! You won!');
        let coins = parseInt(document.getElementById('coins').innerText);
        coins += 100; // Увеличиваем количество монет за выигрыш
        document.getElementById('coins').innerText = coins;
    } else {
        alert('Try again!');
    }
}
