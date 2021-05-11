import '../scss/app.scss';

/* Your JS Code goes here */
window.users = [
    {user: 'Admin', userLastName:'', password: '1', email: 'admin@gmail.com', authorized: false},
    {user: 'Ivan',userLastName:'', password: '2', email: 'IV@gmail.com',  authorized: false},
];
window.page = { html: "" };
window.adminMode = false;

const containerAll = document.getElementById('containerAll');
const user_head = document.querySelector('.user_head');
const logo = document.querySelector('.logo');

let  currentBasa = [];
let activPage = 1;
//let currentBasaGenre = [];

//добавление структуры главной страницы
mainPage ();

//При прогрузке страницы
document.addEventListener ('DOMContentLoaded', function () {
    //отправляется запрос за порцией фильмов
    getMovis(1, selectTypeSort(document.getElementById('sortForm')))
        .then(post =>  { //при получении создаём страницу
            createGetMovie(post);
        })
        .catch(err => console.log(err)); //при ошибке сообщаение в консоль
        createPagination ();  // создание пагинации

    containerAll.addEventListener('click', (event) =>{
        let target = event.target;
        //кликнули по разным страницам
        if (target.classList.contains('work_pag') ) {
            let nodePage = document.getElementById('container_pagination').querySelectorAll('a');
            searchActivPage (nodePage);
            nodePage[activPage].classList.remove('activ_page');
            nodePage[Number(target.innerHTML)].classList.add('activ_page');
            removeChild( document.getElementById('containerListMovie'));

            getMovis(Number(target.innerHTML), selectTypeSort(document.getElementById('sortForm')))
                .then(post =>  createGetMovie(post))
                .catch(err => console.log(err));
        }// кликнули по стрелкам право/лево
        if (target.classList.contains('page-prev')|| target.classList.contains('page-next') ) {
            let nodePage = document.getElementById('container_pagination').querySelectorAll('a');
            rulePrevNext(target, nodePage);
        }
    });
    //выбор сортировки
    containerAll.addEventListener('change', () => {
        let target = event.target;
        if (target.classList.contains('sel_main')) {
            let nodePage = document.getElementById('container_pagination').querySelectorAll('a');
            removeChild( document.getElementById('containerListMovie'));
            searchActivPage (nodePage);
            //получение новой порции с сортировкой по выбору
            getMovis(activPage, selectTypeSort(document.getElementById('sortForm')) )
                .then(post =>  createGetMovie(post))
                .catch(err => console.log(err));
        }
    });

});

//переход на главнуб страницу при клике на лого
logo.addEventListener('click', function () {
    if (document.getElementById('containerAboutFilm') != null) {
        document.getElementById('containerAboutFilm').remove();
    }

    mainPage ();
    getMovis(1, selectTypeSort(document.getElementById('sortForm')))
        .then(post =>  {
            createGetMovie(post);
        })
        .catch(err => console.log(err));

    createPagination ();
});

//при в нажатие на авторизацию
containerAll.addEventListener('click', () =>{
    let target = event.target;
    if (!target.classList.contains('upComeIn')){
        return
    }

    let email = document.getElementById('comeInEmailForm');
    let password = document.getElementById('comeInPhoneForm');

    const activUser = users.filter( user => user.email === email.value && user.password === password.value);

    if (activUser.length === 0) {
        email.value = '';
        password.value ='';
        alert('Неправильный электронный адрес, или пароль');
    } else {
        //отображает юзера при входе
        autorizationUser(user_head,activUser );

        //создаём главную страницу
        mainPage ();
        getMovis(1, selectTypeSort(document.getElementById('sortForm')))
            .then(post =>  {
                createGetMovie(post);
            })
            .catch(err => console.log(err));
        createPagination ();

        if (email.value === 'admin@gmail.com') {
           // var adminMode;
            adminMode = true;
            console.log(adminMode);
        }
    }
});

//при нажатии на регистрацию
containerAll.addEventListener('click', () =>{
    let target = event.target;
    if (!target.classList.contains('registration')){
        return
    }
    page.html  = `
    <div class="container_come-in">
        <div class="formWrapper">
            <h2>Registration</h2>
            <form action="#"
                  method="get"
                  name="registrationForm"
            >
                <div>
                                        <div>
                                          <input type="text"
                                                 id="registrationName"
                                                 placeholder="Name"
                                                 minlength="4"
                                                 required
                                                 autofocus
                                                 class="DisainPlaceholder form_Style"
                                           >
                                           <label class="controlLabel" for="registrationName">Обязательное поле для заполнения</label>
                                        </div>
                                        
                                        <div>
                                          <input type="text"
                                                 id="registrationSurname"
                                                 placeholder="Surname"
                                                 minlength="6"
                                                 required
                                                 class="DisainPlaceholder form_Style"
                                          >
                                          <label class="controlLabel" for="registrationSurname">Обязательное поле для заполнения</label>
                                        </div>
                                        
                                        <div>
                                          <input type="password"
                                                 id="registrationPassword"
                                                 placeholder="Password"
                                                 minlength="6"
                                                 required
                                                 class="DisainPlaceholder form_Style"
                                          >
                                          <label class="controlLabel" for="registrationPassword">Обязательное поле для заполнения</label>
                                        </div>
                                         
                                        <div>
                                          <input type="password"
                                                 id="registrationConfirm"
                                                 placeholder="Confirm password"
                                                 minlength="6"
                                                 required
                                                 class="DisainPlaceholder form_Style"
                                          >
                                          <label class="controlLabel" for="registrationConfirm">Обязательное поле для заполнения</label>
                                        </div>
                                         <div>
                                          <input type="email"
                                                id="registrationEmail"
                                                placeholder="Email"
                                                required
                                                class="DisainPlaceholder form_Style"
                                                >
                                           <label class="controlLabel" for="registrationEmail">Обязательное поле для заполнения</label>
                                         </div>     
                                    </div>
                <div class="control_btn">
                    <button type="submit"
                            id="start_take_home_button"
                            class="form_button_come_in upRegistrtion">
                        Sign Up
                    </button>
                    <button  type="reset"
                             class="registration"
                             id="finish_take_home_button"
                    >
                           Clear
                    </button>
                </div>
            </form>
                      
        </div>
    </div>
    `;
    while (containerAll.firstChild) {
        containerAll.removeChild(containerAll.firstChild);
    }
    containerAll.innerHTML = page.html;
});

//проверка введенной формы регистрации
containerAll.addEventListener('click', () => {
    let target = event.target;
    if(!target.classList.contains('upRegistrtion')) {
        return
    }
    let registrationName = document.getElementById('registrationName');
    let registrationSurname = document.getElementById('registrationSurname');
    let registrationPassword = document.getElementById('registrationPassword');
    let registrationConfirm = document.getElementById('registrationConfirm');
    let registrationEmail = document.getElementById('registrationEmail');
    let newUsers = {user: '', userLastName:'', password: '', email: ''};

    //по нажатию на регистрацию проверяет заполнение формы
    if (registrationName.value === '' || registrationSurname.value === '' || registrationPassword.value === '' || registrationConfirm.value === '' || registrationEmail.value === '' ) {
        alert('Заполните пустые поля ');
    } else {
        if (registrationPassword.value !== registrationConfirm.value) {
        alert('Пароли не совпадают');
        } else {
            newUsers.user = registrationName.value;
            newUsers.userLastName = registrationSurname.value;
            newUsers.password = registrationPassword.value;
            newUsers.email = registrationEmail.value;
            users.push(newUsers);
            //отображает юзера при входе
            user_head.innerHTML = registrationName.value;
            user_head.classList.add('visable');
            document.querySelector('.double-border-button').innerHTML = 'Sign Up';
            //создаём главную страницу
            mainPage ();
            getMovis(1, selectTypeSort(document.getElementById('sortForm')))
                .then(post =>  {
                    createGetMovie(post);
                })
                .catch(err => console.log(err));
            createPagination ();
        }
    }
});

//отрисовка главной страницы
function mainPage () {
    page.html = `
        <article id="containerHomePage">
            <select id="sortForm" name="typeSort" class="sel_main">
                <option value="vote_count.desc" selected>Рейтинг зрителей (убывание)</option>
                <option value="vote_count.asc">Рейтинг зрителей (возростание)</option>
                <option value="release_date.desc">Дата выхода (убывание)</option>
                <option value="release_date.asc">Дата выхода (возростание)</option>
            </select>
            <div id="containerListMovie" class="listMovie"></div>
            <div id="container_pagination" class="pag_contain"></div>
        </article>
    `;
  containerAll.innerHTML = page.html;
}

function createAdminTools() {
    let listMovie = containerAll.querySelector('.listMovie');

    console.log(listMovie.childNodes[0].style.display = 'none')
}

function autorizationUser (block, userInSystem) {
    block.innerHTML = userInSystem[0].user;
    block.classList.add('visable');
    document.querySelector('.double-border-button').innerHTML = 'Sign Up';
   /* for (let i = 0; i < users.length; i++) {
        if (users[i].user === userInSystem[0].user) {
            users[i].authorized = true
        }
    }*/
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
        a.classList.add('work_pag');
        li.appendChild(a);
        ul.appendChild(li);

        if( i>0 && i<11 ){
         a.innerHTML = i;
        }
    }
    ul.firstChild.querySelector('a').innerHTML = `‹ Предыдущая`;
    ul.firstChild.querySelector('a').classList.add('page-prev');
    ul.firstChild.querySelector('a').classList.remove('work_pag');

    ul.lastChild.querySelector('a').innerHTML = `Следующая ›`;
    ul.lastChild.querySelector('a').classList.add('page-next');
    ul.lastChild.querySelector('a').classList.remove('work_pag');

    ul.childNodes[1].querySelector('a').classList.add('activ_page');

    fragment.appendChild(ul);
    document.getElementById('container_pagination').appendChild(fragment)

}

//стрелки вправо и влево
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
import './come_in'
import './mouseEvent';
