//Загрузка данных из localStorage
function loadPlayers() {
    // Получаем данные из localStorage
    let storedItems = localStorage.getItem('players');
    // Проверяем, есть ли данные в localStorage
    if (storedItems) {
        // Если данные есть, парсим их обратно в массив
        return JSON.parse(storedItems);
    } else return [];
}
let players = loadPlayers();

// Обновление данных в LocalStorage
function updatePlayersInLocalStorage() {
    if (players.length < 1) {
        localStorage.removeItem('players');
        return
    }
    localStorage.setItem('players', JSON.stringify(players));
}

// Константы и переменные
// let players = ['Яна', 'Филипп', 'Аня', 'Ангелина', "Витя"];
// let players = [];
const startMenu = document.getElementById('start-menu');
const startMenuBody = startMenu.querySelector('.start-menu__body')
const PopUp = document.getElementById('popup')
const NewPlayerPopup = document.getElementById('new-player-popup')
const PlayerPopupInput = document.getElementById('player-inp')
const errorPar = document.getElementById('error-par')
const addPlayerBtn = document.getElementById('add-player-btn')
const activePopupClass = '_active'
const playerPopupForm = document.querySelector('.player-popup__form')

let closePopupBtns = PopUp.querySelectorAll('.close-btn')

playerPopupForm.addEventListener('submit', addNewPlayer)

closePopupBtns.forEach((btn) => { btn.addEventListener('click', closePopup) })

function generatePlayersList() {
    return `<div class="start-menu__body">
            <ul id="players-list" class="start-menu__list players-list">
            </ul>
            <div class="start-menu__buttons-wrapper">
            <button class="button start-menu__button start-menu__button--create">Добавить игрока</button>
            <button class="button start-menu__button start-menu__button--clear">Очистить все</button>
            </div>
            <button class="button button-start" disabled>Начать игру</button>
            </div>`
}

function addPlayerListItem(name) {
    return `<li class="players-list__item player">
                <h3 class="player__name">${name}</h3>
                <div class="player__buttons-wrapper">
                    <button class="button player__button player__button--delete">Х</button>
                </div>
            </li>`;
}
let buttonNewPlayer = document.createElement('button');
buttonNewPlayer.classList.add('button', 'start-menu__button', 'start-menu__button--create');
buttonNewPlayer.textContent = 'Добавить игрока';

// Функции

function checkPlayers() {
    if (players.length <= 0) {
        startMenuBody.innerHTML = '';
        startMenuBody.appendChild(Object.assign(buttonNewPlayer))
        buttonNewPlayer.addEventListener('click', function () {
            PopUp.classList.add('_popup-active')
            NewPlayerPopup.classList.add(activePopupClass)
        })
        return
    }
    updatePlayersInLocalStorage()
    
    startMenuBody.innerHTML = generatePlayersList()
    const playersList = document.getElementById('players-list')
    players.forEach((player)=>{
        playersList.insertAdjacentHTML('afterbegin', addPlayerListItem(player))
    })

    // Удаление игрока
    playersList.querySelectorAll('.player').forEach((player)=>{
        player.querySelector('.player__button--delete').addEventListener('click', ()=>{
            let playerName = player.querySelector('.player__name').textContent
            console.log(playerName)
            players = players.filter((name) => name !== playerName)
            console.log(players)
            checkPlayers()
        })
    })

    // Сброс игроков
    startMenu.querySelector('.start-menu__button--clear').addEventListener('click', ()=>{
        players = []
        checkPlayers()
    })


    startMenuBody.querySelector('.start-menu__button--create').addEventListener('click', ()=>{
        PopUp.classList.add('_popup-active')
        NewPlayerPopup.classList.add(activePopupClass)
    })
}

function closePopup() {
    PopUp.classList.remove('_popup-active')
    PopUp.querySelectorAll('input').forEach((inp) => { inp.value = '' })
    PopUp.querySelectorAll(activePopupClass).forEach((el) => { el.classList.remove(activePopupClass) })
}


function playerNameValidation(name, arr) {
    const pattern = /^[a-zA-Z0-9а-яА-Я]+$/;
    if (!name) {

        errorMessageReplace('Поле пустое')
        return undefined
    }
    if (name.length < 2) {
        errorMessageReplace('Имя должно содержать 2 или более символа')
        return undefined
    }
    if (!pattern.test(name)) {
        errorMessageReplace('Неверное имя')
        return undefined
    }

    if (arr.includes(name)) {
        errorMessageReplace('Такое имя уже существует')
        return undefined
    }
    return name
}

function errorMessageReplace(message) {
    errorPar.textContent = message
    errorPar.classList.add('_active')
}

function addNewPlayer() {
    if (playerNameValidation(PlayerPopupInput.value, players)) {
        players.push(playerNameValidation(PlayerPopupInput.value, players))
        updatePlayersInLocalStorage()
        
        errorPar.classList.remove('_active')
        PlayerPopupInput.value = '';
        checkPlayers()
    }
}

checkPlayers();
// playerNameValidation('Аня', ['Яна', 'Филипп', 'Аня'])