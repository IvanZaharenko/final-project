import '../scss/app.scss';

/* Your JS Code goes here */
const containerPagination = document.getElementById('container_pagination');
const containerListMovie = document.getElementById('containerListMovie')

function getMovis (page, sortType) {
    return Promise.resolve().then(() => {
        return fetch (`https://api.themoviedb.org/3/discover/movie?api_key=dcc9acdebadcf222b7588db1d80573d0&language=ru-US&sort_by=${sortType}&include_adult=false&include_video=false&page=${page}&with_watch_monetization_types=flatrate`).then(
            response => response.json())
    })
}

getMovis (1, 'release_date.asc')
    .then(post => {
        console.log(post.results)

        const fragment = document.createDocumentFragment();

        for(let i=0; i < post.results.length; i++) {
             console.log(i)
            let a = document.createElement('a');
            a.classList.add('item_movie');
            let div = document.createElement('div');

            let img = document.createElement('img');
            img.src = `https://image.tmdb.org/t/p/w500${post.results[i].poster_path}`;
            img.alt = 'Постер фильма';

            let p_title = document.createElement('p');
            p_title.classList.add('title_item');
            p_title.innerHTML = post.results[i].title;

            let p_vote = document.createElement('p');
            p_vote.classList.add('vote_item');
            p_vote.innerHTML = post.results[i].vote_average;

            let p_release = document.createElement('p');
            p_release.classList.add('release_item');
            p_release.innerHTML = post.results[i].release_date;

            div.appendChild(img);
            div.appendChild(p_title);
            div.appendChild(p_vote);
            div.appendChild(p_release);
            a.appendChild(div)
            
            fragment.appendChild(a)
        }
        containerListMovie.appendChild(fragment)
    })
    .catch(err => console.log(err));
     



function createPagination () {
    const fragment = document.createDocumentFragment();
    let ul = document.createElement('ul');
    ul.classList.add('pagination');

    for (let i = 0; i <= 11; i++){
        let li = document.createElement('li');
        let a = document.createElement('a');
        li.appendChild(a)
        ul.appendChild(li)

        if( i>0 && i<11 ){
         a.innerHTML = i;
        }
    }
    ul.firstChild.querySelector('a').innerHTML = `‹ Предыдущая`;
    ul.lastChild.querySelector('a').innerHTML = `Следующая ›`;
    ul.childNodes[1].querySelector('a').classList.add('activ_page');

    fragment.appendChild(ul)
    containerPagination.appendChild(fragment)
}

createPagination ()




/*
let main = document.getElementById('Main'),
    game = document.getElementById('Game'),
    setting = document.getElementById('Settings'),
    nameUser = "";
let objUser = [];

// в закладке УРЛа будем хранить   слова
// #Main - главная
// #game - игра
// #settings - настройки

// отслеживаем изменение закладки в УРЛе
// оно происходит при любом виде навигации
// в т.ч. при нажатии кнопок браузера ВПЕРЁД/НАЗАД
window.onhashchange=SwitchToStateFromURLHash;//когда изменяется hash работает функция

// текущее состояние приложения
let SPAStateH={};

function UpdateToState(NewStateH)
{
    SPAStateH=NewStateH; // устанавливаем - это теперь текущее состояние

    console.log('Новое состояние приложения:');
    console.log(SPAStateH);

    // обновляем вариабельную часть страницы под текущее состояние
    let PageHTML="";
    switch ( SPAStateH.pagename )
    {
        case 'Main':
            console.log('Main');
            break;

        case 'Game':
            console.log('Game');
            break;

        case 'Settings':
            console.log('Settings');
            break;
    }
    //document.getElementById('content').innerHTML = PageHTML;
}

// вызывается при изменении закладки УРЛа
// а также при первом открытии страницы
// читает нужное состояние приложения из закладки УРЛа
// // и устанавливает+отображает его
function SwitchToStateFromURLHash() // функция срабатывает при загрузке и сразу открывает  MAIN
{    let URLHash=window.location.hash;
    // убираем из закладки УРЛа решётку
    // (по-хорошему надо ещё убирать восклицательный знак, если есть)
    let StateStr=URLHash.substr(1);
    if ( StateStr!="" ) // если закладка непустая, читаем из неё состояние и отображаем
    {
        let PartsA=StateStr.split("_");
        let NewStateH={ pagename: PartsA[0] }; // первая часть закладки - номер страницы
        UpdateToState(NewStateH);
    }
    else
        UpdateToState( { pagename:'Main' } ); // иначе показываем главную страницу
}
// устанавливает в закладке УРЛа новое состояние приложения
// и затем устанавливает+отображает это состояние
function SwitchToState(NewStateH)
{
    // устанавливаем закладку УРЛа
    // нужно для правильной работы кнопок навигации браузера
    // (т.к. записывается новый элемент истории просмотренных страниц)
    // и для возможности передачи УРЛа другим лицам
    let StateStr=NewStateH.pagename;
    document.location.hash=StateStr;
    // АВТОМАТИЧЕСКИ вызовется SwitchToStateFromURLHash()
    // т.к. закладка УРЛа изменилась (ЕСЛИ она действительно изменилась)
}
function SwitchToMainPage() {
    SwitchToState( { pagename:'Main' } );
    clearing();
}

function SwitchToGamePage() {
    SwitchToState( { pagename:'Game', } );
}

function SwitchToAboutPage() {
    SwitchToState( { pagename:'Settings' } );
    clearing();
}

// переключаемся в состояние, которое сейчас прописано в закладке УРЛ
SwitchToStateFromURLHash();
*/

/* Demo JS */
import './mouseEvent';