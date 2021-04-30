import '../scss/app.scss';

/* Your JS Code goes here */
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
