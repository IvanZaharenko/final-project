import '../scss/app.scss';

/* Your JS Code goes here */
const containerAll = document.getElementById('containerAll');
let  currentBasa = [];

window.page = {
    html: ""
};
//const containerPagination = document.getElementById('container_pagination');
//const containerListMovie = document.getElementById('containerListMovie');
//const sortForm = document.getElementById('sortForm');
let activPage = 1;

//добавление структуры главной страницы
mainPage ();

//При прогрузке страницы
document.addEventListener ('DOMContentLoaded', function () {
    getMovis(1, selectTypeSort(document.getElementById('sortForm')))
        .then(post =>  {
            createGetMovie(post);

           // console.log(post)
        })
        .catch(err => console.log(err));

        createPagination ();
});

function mainPage () {
    page.html  += `
        <article id="containerHomePage">
            <select id="sortForm" name="typeSort">
                <option value="vote_count.desc" selected>Рейтинг зрителей (убывание)</option>
                <option value="vote_count.asc">Рейтинг зрителей (возростание)</option>
                <option value="release_date.desc">Дата выхода (убывание)</option>
                <option value="release_date.asc">Дата выхода (возростание)</option>
            </select>
            <div id="containerListMovie"></div>
            <div id="container_pagination"></div>
        </article>
    `;
  containerAll.innerHTML = page.html;
}

//Управление сортировкой
document.getElementById('sortForm').addEventListener("change", ()=>{
    let nodePage = document.getElementById('container_pagination').querySelectorAll('a');

    removeChild( document.getElementById('containerListMovie'));
    searchActivPage (nodePage);

     getMovis(activPage, selectTypeSort(document.getElementById('sortForm')) )
         .then(post =>  createGetMovie(post))
         .catch(err => console.log(err));
});

//Управление пагинацией
document.getElementById('container_pagination').addEventListener('click', (e) => {
    let target = e.target;
    let nodePage = document.getElementById('container_pagination').querySelectorAll('a');
    let page = Number(target.innerHTML);

    if (target.matches('a')) {
        if(target.classList.contains('page-prev') || target.classList.contains('page-next')) {
            rulePrevNext(target, nodePage);
        } else  {

            searchActivPage (nodePage);

            nodePage[activPage].classList.remove('activ_page');
            nodePage[page].classList.add('activ_page');
            removeChild( document.getElementById('containerListMovie'));

            getMovis(page, selectTypeSort(document.getElementById('sortForm')))
                .then(post =>  createGetMovie(post))
                .catch(err => console.log(err));
        }
    }
});


function rulePrevNext(context, allPage){
    searchActivPage (allPage);
    if (context.classList.contains('page-prev')){
        if(activPage !== 1){
            allPage[activPage].classList.remove('activ_page');
            activPage--;
            allPage[activPage].classList.add('activ_page');
            removeChild( document.getElementById('containerListMovie'));

            getMovis(activPage, selectTypeSort(document.getElementById('sortForm')))
                .then(post =>  createGetMovie(post))
                .catch(err => console.log(err));
        }
    } else {
        if(activPage !== 10){
            allPage[activPage].classList.remove('activ_page');
            activPage++;
            allPage[activPage].classList.add('activ_page');
            removeChild( document.getElementById('containerListMovie'));

            getMovis(activPage, selectTypeSort(document.getElementById('sortForm')))
                .then(post =>  createGetMovie(post))
                .catch(err => console.log(err));
        }
    }
}

//Получение базы фильмов по запросу
function getMovis (page, sortType) {
    return Promise.resolve().then(() => {
        return fetch (`https://api.themoviedb.org/3/discover/movie?api_key=dcc9acdebadcf222b7588db1d80573d0&language=ru-US&sort_by=${sortType}&include_adult=false&include_video=false&page=${page}&with_watch_monetization_types=flatrate`).then(
            response => response.json())
    })
}

//Создание полученных фильмов
function createGetMovie(basafilms) {
    window.currentBasa = basafilms.results.slice();

    const fragment = document.createDocumentFragment();

    for(let i=0; i < basafilms.results.length; i++) {

        let a = document.createElement('a');
        a.classList.add('item_movie');
        let div = document.createElement('div');

        let img = document.createElement('img');
            if (basafilms.results[i].poster_path === null ) {
                img.src = `http://placehold.it/200x319`;
            } else {
                img.src = `https://image.tmdb.org/t/p/w500${basafilms.results[i].poster_path}`;
            }
        img.alt = 'Постер фильма';

        let p_title = document.createElement('p');
        p_title.classList.add('title_item');
        p_title.innerHTML = basafilms.results[i].title;

        let p_vote = document.createElement('p');
        p_vote.classList.add('vote_item');
        p_vote.innerHTML = basafilms.results[i].vote_average;

        let p_release = document.createElement('p');
        p_release.classList.add('release_item');
        p_release.innerHTML = transformGetData(basafilms.results[i].release_date) ;

        div.appendChild(img);
        div.appendChild(p_title);
        div.appendChild(p_vote);
        div.appendChild(p_release);
        a.appendChild(div);

        fragment.appendChild(a)
    }
    document.getElementById('containerListMovie').appendChild(fragment);
}

//Создания блока пагинации
function createPagination () {
    const fragment = document.createDocumentFragment();
    let ul = document.createElement('ul');
    ul.classList.add('pagination');

    for (let i = 0; i <= 11; i++){
        let li = document.createElement('li');
        let a = document.createElement('a');
        li.appendChild(a);
        ul.appendChild(li);

        if( i>0 && i<11 ){
         a.innerHTML = i;
        }
    }
    ul.firstChild.querySelector('a').innerHTML = `‹ Предыдущая`;
    ul.firstChild.querySelector('a').classList.add('page-prev');

    ul.lastChild.querySelector('a').innerHTML = `Следующая ›`;
    ul.lastChild.querySelector('a').classList.add('page-next');

    ul.childNodes[1].querySelector('a').classList.add('activ_page');

    fragment.appendChild(ul);
    document.getElementById('container_pagination').appendChild(fragment)

}

//Определения выбранного типа сортивки
const selectTypeSort = form =>  form.value;

function searchActivPage (pages) {
    for(let i = 0; i <= pages.length; i++) {
              if (pages[i].classList.contains('activ_page')){
                  activPage = i;
                  break
               }
           }
}

//Преобразование даты
const transformGetData = (getData) => getData.split('-').reverse().join('/');

//функция удаления детей элемента
function removeChild(elem) {
    while (elem.firstChild) {
      elem.removeChild(elem.firstChild);
    }
  }



/* Demo JS */
import './aboutFilm'
import './mouseEvent';
