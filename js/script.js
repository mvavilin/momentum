// Constants

const time = document.querySelector('.time');
const date = document.querySelector('.date');

const hours = new Date().getHours();
const greeting = document.querySelector('.greeting');
const name = document.querySelector('.name');

const slidePrev = document.querySelector('.slide-prev');
const slideNext = document.querySelector('.slide-next');
let randomNum = getRandomNum(1, 20);

const city = document.querySelector('.city');
const weatherIcon = document.querySelector('.weather-icon');
const weatherError = document.querySelector('.weather-error');
const descriptionContainer = document.querySelector('.description-container');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');

const qoute = document.querySelector('.qoute');
const author = document.querySelector('.author');
const changeQuote = document.querySelector('.change-quote');

// 1. Clock and calendar

function showTime() {
    time.textContent = new Date().toLocaleTimeString();
    showDate();
    showGreeting();
    setTimeout(showTime, 1000);
}
showTime(); 
function showDate() {
    const options = {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    };
    date.textContent = new Date().toLocaleDateString('en-Us', options);
}

// 2. Greeting

function getTimeOfDay() {
    switch (Math.floor(hours / 6)) {
        case 0: return 'night';
        case 1: return 'morning';
        case 2: return 'afternoon';
        case 3: return 'evening';
    }
}
function showGreeting() {
    greeting.textContent = `Good ${getTimeOfDay()}`;
}
function setLocalStorage() {
    localStorage.setItem('name', name.value);
    localStorage.setItem('city', city.value);
}
window.addEventListener('beforeunload', setLocalStorage);
city.addEventListener('change', setLocalStorage);
function getLocalStorage() {
    if(localStorage.getItem('name')) {
        name.value = localStorage.getItem('name');
    }
    if(localStorage.getItem('city')) {
        city.value = localStorage.getItem('city');
    }
}
window.addEventListener('load', getLocalStorage);
city.addEventListener('change', getLocalStorage);

// 3. Image Slider

function getRandomNum(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function setBg() {
    const timeOfDay = getTimeOfDay();
    const bgNum = `${randomNum}`.padStart(2,"0");
    const img = new Image();
    img.src = `https://raw.githubusercontent.com/mvavilin/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg`;
    img.onload = () => {      
        document.body.style.backgroundImage = `url('${img.src}')`;
        document.body.style.backgroundSize = "cover";
        document.body.style.transition = "all 1s"
    }; 
}
window.addEventListener('load', setBg);
function getSlidePrev() {
    randomNum--;
    if (randomNum < 1) randomNum = 20;
    setBg();
}
slidePrev.addEventListener('click', getSlidePrev);
function getSlideNext() {
    randomNum++;
    if (randomNum > 20) randomNum = 1;
    setBg();
}
slideNext.addEventListener('click', getSlideNext);

// 4. Weather widget

function setDefaultCity() {
    if (!city.value) localStorage.setItem('city', "Minsk");
}
window.addEventListener('beforeunload', setDefaultCity);
async function getWeather() {
    city.value = localStorage.getItem('city');
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=en&appid=97a862b35430aa1a79b814458c150f5a&units=metric`;
    const res = await fetch(url);
    switch (res.status) {
        case 400:
        weatherError.textContent = 'Please enter a city!';
        clearWeartherData();
        return;
        case 404:
        weatherError.textContent = 'Sorry, city not found!';
        clearWeartherData();
        return;
        default:
        weatherError.textContent = '';
    }
    const data = await res.json();
    weatherIcon.className = 'weather-icon owf';
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${Math.floor(data.main.temp)}°C`;
    weatherDescription.textContent = data.weather[0].description;
    wind.textContent = `Wind speed: ${Math.floor(data.wind.speed)} m/s`;
    humidity.textContent = `Humidity: ${data.main.humidity}%`;
}
function clearWeartherData() {
    weatherIcon.className = 'weather-icon owf';
    temperature.textContent = '';
    weatherDescription.textContent = '';
    wind.textContent = '';
    humidity.textContent = '';
}

function setCity(event) {
    if (event.code === 'Enter') {
        getWeather();
        city.blur();
    }
}
document.addEventListener('DOMContentLoaded', getWeather);
city.addEventListener('change', getWeather);

// 5. Quote of the day widget

async function getQuotes() {  
    const quotes = 'https://type.fit/api/quotes';
    const res = await fetch(quotes);
    const data = await res.json();
    const randomNum = getRandomNum(0, 1642);
    qoute.textContent = data[randomNum].text;
    author.textContent = data[randomNum].author;
}
getQuotes();
changeQuote.addEventListener('click', getQuotes);

// 6. Audio player

import playList from './playList.js';

const playPrevBtn = document.querySelector('.play-prev');
const play = document.querySelector('.play');
const playNextBtn = document.querySelector('.play-next');
const playListContainer = document.querySelector('.play-list');
let isPlay = false;
let playNum = 0;
const audio = new Audio();

playList.forEach(element => {
    const li = document.createElement('li');
    li.classList.add('play-item');
    li.textContent = element.title;
    playListContainer.append(li);
})

function playAudio() {
    audio.src = playList[playNum].src;
    audio.currentTime = 0;
    playListContainer.children[playNum].classList.add('item-active');
    if (!isPlay) {
        audio.play();
        isPlay = true;
    } else {
        audio.pause();
        isPlay = false;
    }
    toggleBtn();
}

function toggleBtn() {
    play.classList.toggle('pause');
}

function addBtn() {
    play.classList.add('pause');
}

function playNext() {
    playNum++;
    playListContainer.children[playNum - 1].classList.remove('item-active');
    if (playNum > 3) playNum = 0;
    isPlay = false;
    playAudio();
    addBtn();
}

function playPrev() {
    playNum--;
    playListContainer.children[playNum + 1].classList.remove('item-active');
    if (playNum < 0) playNum = 3;
    isPlay = false;
    playAudio();
    addBtn();
}

play.addEventListener("click", playAudio);
playNextBtn.addEventListener("click", playNext);
playPrevBtn.addEventListener("click", playPrev);

// 7. Advanced audio player

// 8. Translation app

// 9. Getting the background image from the API

// 10. App settings