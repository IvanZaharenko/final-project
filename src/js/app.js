import '../scss/app.scss';

/* Your JS Code goes here */
window.users = [
    {user: 'Admin', userLastName:'', password: '1', email: 'admin@gmail.com'},
    {user: 'Ivan',userLastName:'', password: '2', email: 'IV@gmail.com'},
];
window.page = { html: "" };
window.adminMode = false;
window.otherUserMode = false;
window.deleteFilm = [];
window.basaGenre = [];
window.newFilm = [];
let activPage = 1;

const containerAll = document.getElementById('containerAll');
const user_head = document.querySelector('.user_head');
const logo = document.querySelector('.logo');
const comeIn = document.querySelector('.double-border-button');

//добавление структуры главной страницы
mainPage ();

//При прогрузке страницы
document.addEventListener ('DOMContentLoaded', function () {
    let currentBasa = [];
    //получаем базу жанров
    getMoveGenre()
        .then(post => {
            window.basaGenre = post.genres;
        })
        .catch(err => {//при ошибке сообщаение в консоль
            console.log(err);
            createPage404 ()
        });

    //отправляется запрос за порцией фильмов
    getMovis(1, selectTypeSort(document.getElementById('sortForm')))
        .then(post =>  {
            document.querySelector('.preloader-5').classList.remove('display-block');
            window.currentBasa = post.results.slice();
            //при получении создаём страницу
            createGetMovie();
        })
        .catch(err => {
            createPage404 ();
            console.log(err)
        }); //при ошибке сообщаение в консоль
        createPagination ();  // создание пагинации

    containerAll.addEventListener('click', (event) =>{
        let target = event.target;
        //кликнули по разным страницам
        if (target.classList.contains('work_pag') ) {
            document.querySelector('.preloader-5').classList.add('display-block');

            let nodePage = document.getElementById('container_pagination').querySelectorAll('a');
            searchActivPage (nodePage);
            nodePage[activPage].classList.remove('activ_page');
            nodePage[Number(target.innerHTML)].classList.add('activ_page');
            removeChild( document.getElementById('containerListMovie'));

            getMovis(Number(target.innerHTML), selectTypeSort(document.getElementById('sortForm')))
                .then(post => {
                    document.querySelector('.preloader-5').classList.remove('display-block');
                    window.currentBasa = post.results.slice();
                    createGetMovie(currentBasa)
                })
                .catch(err => {
                    createPage404 ();
                    console.log(err)
                });
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
            document.querySelector('.preloader-5').classList.add('display-block');

            let nodePage = document.getElementById('container_pagination').querySelectorAll('a');
            removeChild( document.getElementById('containerListMovie'));
            searchActivPage (nodePage);
            //получение новой порции с сортировкой по выбору
            getMovis(activPage, selectTypeSort(document.getElementById('sortForm')) )
                .then(post =>  {
                    document.querySelector('.preloader-5').classList.remove('display-block');
                    window.currentBasa = post.results.slice();
                    createGetMovie(currentBasa)
                })
                .catch(err => {
                    createPage404 ();
                    console.log(err)
                });
        }
    });
});

//переход на главнуб страницу при клике на лого
logo.addEventListener('click',  () => createHomePage());

//удаление фильма с главной страницы в режиме admin
containerAll.addEventListener('click', () => {
    let target = event.target;
    if (!target.classList.contains('deleteFilm')) return ;

    let item = target.closest('.item_movie');
    let title = item.querySelector('.title_item').innerHTML;
    item.remove();
     for (let i = 0; i < currentBasa.length; i++){
         if (title === currentBasa[i].title){
            deleteFilm.push(currentBasa[i].title);
            currentBasa.splice(i,1);
             break
         }
     }
});

// Создание формы заполнения для нового фильма, по нажатию на +
containerAll.addEventListener('click', function () {
   let target = event.target;
   if (!target.classList.contains('addFilm')) return;

   page.html  = `<div class="container_come-in">
        <div class="formWrapper">
            <h2>Add new film</h2>
            <form action="#"
                  method="get"
                  name="newFilm"
            >
                <div>
                    <input type="text"
                           id="addTitle"
                           placeholder="title"
                           minlength="3"
                           required
                           autofocus
                           class="DisainPlaceholder form_Style"
                    >                                
                    <textarea 
                      id="addOverview"
                      placeholder="Overview"
                      minlength="6"
                      maxlength="150"
                      required
                      class="DisainPlaceholder form_Style"
                     ></textarea>                              
                    <input type="number"
                           id="addPopularity"
                           placeholder="Popularity"
                           required
                           class="DisainPlaceholder form_Style"
                    >                     
                    <input type="date"
                           id="addRelease_date"
                           placeholder="release date"
                           required
                           class="DisainPlaceholder form_Style"
                    >
<select id="addGenres" multiple size="1" required>`;
   for (let i = 0; i < basaGenre.length; i++){
       page.html  +=`<option value="${basaGenre[i].id}">${basaGenre[i].name}</option>`;
   }
   page.html  += `  </select>
                     <input type="number"
                            id="addVote_average"
                            placeholder="Vote average"
                            required        
                            max="10"
                            class="DisainPlaceholder form_Style"
                     >                 
                    <input type="number"
                           id="addVote_count "
                           placeholder="Vote count"
                           required
                           class="DisainPlaceholder form_Style"
                    >
                </div>
                <div class="control_btn">
                    <button type="submit"
                            id="addNewFilm"
                            class="addFilm-admin ">
                        Add
                    </button>
                    <button  type="reset"
                             class="clear-newFilm"
                             id="clearNew film"
                    >
                           Clear
                    </button>
                </div>
            </form>           
        </div>
    </div>`;

    while (containerAll.firstChild) {
        containerAll.removeChild(containerAll.firstChild);
    }
    containerAll.innerHTML = page.html;
});

//обработка  данных и добавление нового фильма
containerAll.addEventListener('click', () => {
    let target = event.target;
    if (!target.classList.contains('addFilm-admin')) return;

    const infoNewFilm = { id:0,
                          title:'',
                          overview:'',
                          tagline: '',
                          popularity: 0,
                          release_date:'',
                          vote_average: 0,
                          vote_count:0,
                          genres:[]
                        };
    const form = document.forms.newFilm;

    if (form[0].value === '' || form[0].value.length < 3 || form[1].value === '' || form[1].value.length < 6
        || form[2].value === '' || form[3].value === '' || form[5].value === '' || Number(form[5].value) > 10 || form[6].value === ''  ) {
        alert ('Заполните пустые поля');
    } else {
        event.preventDefault();
        alert('Фильм и информация о нём добавлены');
        infoNewFilm.title = form[0].value;
        form[0].value = '';

        infoNewFilm.overview = form[1].value;
        form[1].value = '';

        infoNewFilm.popularity = Number(form[2].value);
        form[2].value = '';

        infoNewFilm.release_date = form[3].value;
        form[3].value = '';

        infoNewFilm.vote_average = Number(form[5].value);
        form[5].value = '';

        infoNewFilm.vote_count = Number(form[6].value);
        form[6].value = '';

        let arrayGenres =  [...form[4].options].filter(option => option.selected).map(option => option.value);
        let x = [];
        for(let i =0 ; i < arrayGenres.length; i++) {
             x.push({ id: Number(arrayGenres[i]) });
        }
        infoNewFilm.genres =  x;

        form[4].value = '';
        newFilm.push(infoNewFilm);
    }
});

//удаление фильма на страницe его описания
containerAll.addEventListener('click', () => {
   let target = event.target;
   if (!target.classList.contains('deleteFilm_about')) return ;

   let title = containerAll.querySelector('.about_title').innerHTML.slice(1);
   for (let i = 0; i < currentBasa.length; i++){
        if (title === currentBasa[i].title){
            deleteFilm.push(currentBasa[i].title);
            currentBasa.splice(i,1);
            break
        }
   }
   createHomePage()
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
        if (email.value === 'admin@gmail.com')  window.adminMode = true;
        if (email.value !== 'admin@gmail.com')  window.otherUserMode = true;
        //отображает юзера при входе
        autorizationUser(user_head,activUser );
        //создаём главную страницу
        mainPage ();
        getMovis(1, selectTypeSort(document.getElementById('sortForm')))
            .then(post =>  {
                window.currentBasa = post.results.slice();
                createGetMovie();
            })
            .catch(err => {
                createPage404 ();
                console.log(err)
            });
        createPagination ();
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
    if(!target.classList.contains('upRegistrtion'))   return;

    let registrationName = document.getElementById('registrationName');
    let registrationSurname = document.getElementById('registrationSurname');
    let registrationPassword = document.getElementById('registrationPassword');
    let registrationConfirm = document.getElementById('registrationConfirm');
    let registrationEmail = document.getElementById('registrationEmail');
    let newUsers = {user: '', userLastName:'', password: '', email: ''};

    //по нажатию на регистрацию проверяет заполнение формы
    if (registrationName.value === '' || registrationSurname.value === '' || registrationPassword.value === '' || registrationConfirm.value === '' || registrationEmail.value === '' ) {
        alert('Заполните пустые поля ');
        return
    } else {
        if (registrationPassword.value !== registrationConfirm.value) {
        alert('Пароли не совпадают');
        return
        } else {
            newUsers.user = registrationName.value;
            newUsers.userLastName = registrationSurname.value;
            newUsers.password = registrationPassword.value;
            newUsers.email = registrationEmail.value;
            users.push(newUsers);
            window.otherUserMode = true;

            //отображает юзера при входе
            user_head.innerHTML = registrationName.value;
            user_head.classList.add('visable');
            document.querySelector('.double-border-button').innerHTML = 'Sign Up';

            //создаём главную страницу
            mainPage ();
            getMovis(1, selectTypeSort(document.getElementById('sortForm')))
                .then(post =>  {
                    window.currentBasa = post.results.slice();
                    createGetMovie(currentBasa);
                })
                .catch(err => {
                    createPage404 ();
                    console.log(err)
                });
            createPagination ();
        }
    }
});

//отрисовка структуры главной страницы
function mainPage () {
    if (adminMode){
        page.html = `
        <article id="containerHomePage">
            <select id="sortForm" name="typeSort" class="sel_main">
                <option value="vote_count.desc" selected>Рейтинг зрителей (убывание)</option>
                <option value="vote_count.asc">Рейтинг зрителей (возростание)</option>
                <option value="release_date.desc">Дата выхода (убывание)</option>
                <option value="release_date.asc">Дата выхода (возростание)</option>
            </select>
            <a class="addFilm floating-button">+</a><div 
            id="containerListMovie" class="listMovie"></div>
            <div id="container_pagination" class="pag_contain"></div>
        </article>
    `;
    containerAll.innerHTML = page.html;

    } else {
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
}

function autorizationUser (block, userInSystem) {
    block.innerHTML = userInSystem[0].user;
    block.classList.add('visable');
    document.querySelector('.double-border-button').innerHTML = 'Sign Up';
}

//Получение базы фильмов по запросу
function getMovis (page, sortType) {
    return Promise.resolve().then(() => {
        return fetch (`https://api.themoviedb.org/3/discover/movie?api_key=dcc9acdebadcf222b7588db1d80573d0&language=ru-US&sort_by=${sortType}&include_adult=false&include_video=false&page=${page}&with_watch_monetization_types=flatrate`).then(
            response => response.json())
    })
}

//Создание полученных фильмов
function createGetMovie() {
    let nodePage = document.getElementById('container_pagination').querySelectorAll('a');
    searchActivPage (nodePage);

    if (newFilm.length !== 0 && activPage === 1 && selectTypeSort(document.getElementById('sortForm')) === 'vote_count.desc') {
       currentBasa.splice(-newFilm.length);

       for (let k = 0; k < newFilm.length; k++){
       currentBasa.unshift(newFilm[k])
      }
    }
    const fragment = document.createDocumentFragment();
    for (let i=0; i < currentBasa.length; i++) {
        //проверяем полученные фильмы на совпадениея с удалёнными до запроса
        let coincidence = false;
        for (let j = 0; j < deleteFilm.length; j++ ) {
            if (currentBasa[i].title === deleteFilm[j]) {
                coincidence = true;
                break
            }
        }
        //если происходит совпадение id пропускаем и не отрисовываем полученный фильм
         if (coincidence) {
             continue;
         }
             let a = document.createElement('a');
             a.classList.add('item_movie');
             let div = document.createElement('div');

             let img = document.createElement('img');
             if (currentBasa[i].poster_path === null || currentBasa[i].poster_path === undefined) {
                 img.src = `http://placehold.it/200x319`;
             } else {
                 img.src = `https://image.tmdb.org/t/p/w500${currentBasa[i].poster_path}`;
             }
             img.alt = 'Постер фильма';

             let p_title = document.createElement('p');
             p_title.classList.add('title_item');
             p_title.innerHTML = currentBasa[i].title;

             let p_vote = document.createElement('p');
             p_vote.classList.add('vote_item');
             p_vote.innerHTML = currentBasa[i].vote_average;

             let p_release = document.createElement('p');
             p_release.classList.add('release_item');
             p_release.innerHTML = transformGetData(currentBasa[i].release_date) ;

             div.appendChild(img);
             div.appendChild(p_title);
             div.appendChild(p_vote);
             div.appendChild(p_release);
             a.appendChild(div);

             if (adminMode){
                 let deleteFilm = document.createElement('a');
                 deleteFilm.innerHTML = '☒';
                 deleteFilm.classList.add('deleteFilm');
                 a.appendChild(deleteFilm);
             }
             fragment.appendChild(a)

    }
    document.getElementById('containerListMovie').appendChild(fragment);
}

//При клике на кнопку входа в  систему
comeIn.addEventListener('click', () => {
    let user_head = document.querySelector('.user_head');
    if (user_head.innerHTML !== ''){
        user_head.classList.remove('visable');
        user_head.innerHTML = '';
        document.querySelector('.double-border-button').innerHTML = 'Sign In / Sign Up';
        window.adminMode = false;
        window.otherUserMode = false;

        //создаём главную страницу
        mainPage ();
        getMovis(1, selectTypeSort(document.getElementById('sortForm')))
            .then(post =>  {
                window.currentBasa = post.results.slice();
                createGetMovie(currentBasa);
            })
            .catch(err => {
                createPage404 ();
                console.log(err)
            });
        createPagination ();
    } else comeInPage()
});

// создаётся страница формы-входа.
function comeInPage() {
    page.html  = `
    <div class="container_come-in">
                        <div class="formWrapper">
                            <form action="#"
                                      method="get"
                                      name="comeInForm"
                                >
                                    <div>
                                        <div>
                                            <input type="email"
                                                   id="comeInEmailForm"
                                                 
                                                   placeholder="Email"
                                                   required
                                                   autofocus
                                                   class="DisainPlaceholder form_Style"
                                            >
                                            <label class="controlLabel" for="comeInEmailForm">Обязательное поле для заполнения</label>

                                        </div>
                                        <div>
                                            <input type="password"
                                                   id="comeInPhoneForm"
                                                   placeholder="Password"
                                                   required
                                                   class="DisainPlaceholder form_Style"
                                            >
                                            <label class="controlLabel" for="comeInPhoneForm">Обязательное поле для заполнения</label>
                                        </div>
                                    </div>
                                    
                                    <div class="control_btn">
                                        <button type="submit"
                                                id="start_take_home_button"
                                                class="form_button_come_in upComeIn">
                                           Sign 
                                        </button>
    
                                        <button
                                                type="button"
                                                class="registration"
                                                id="finish_take_home_button"
                                        >
                                            Registration
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
    document.querySelector('.preloader-5').classList.add('display-block')

    searchActivPage (allPage);
    if (context.classList.contains('page-prev')){
        if(activPage !== 1){
            allPage[activPage].classList.remove('activ_page');
            activPage--;
            allPage[activPage].classList.add('activ_page');
            removeChild( document.getElementById('containerListMovie'));
            getMovis(activPage, selectTypeSort(document.getElementById('sortForm')))
                .then(post =>  {
                    document.querySelector('.preloader-5').classList.remove('display-block');
                    window.currentBasa = post.results.slice();
                    createGetMovie(currentBasa)
                })
                .catch(err => {
                    createPage404 ();
                    console.log(err)
                });
        }
    } else {
        if(activPage !== 10){
            allPage[activPage].classList.remove('activ_page');
            activPage++;
            allPage[activPage].classList.add('activ_page');
            removeChild( document.getElementById('containerListMovie'));
            getMovis(activPage, selectTypeSort(document.getElementById('sortForm')))
                .then(post =>  {
                    document.querySelector('.preloader-5').classList.remove('display-block');
                    window.currentBasa = post.results.slice();
                    createGetMovie(currentBasa)
                })
                .catch(err => {
                    createPage404 ();
                    console.log(err)
                });
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
const transformGetData = (getData) => getData.split('-').reverse().join('.');

//функция удаления детей элемента
function removeChild(elem) {
    while (elem.firstChild) {
      elem.removeChild(elem.firstChild);
    }
  }

  //переход на главную страницу
function createHomePage() {
    document.querySelector('.preloader-5').classList.add('display-block');

    if (document.getElementById('containerAboutFilm') != null) {
        document.getElementById('containerAboutFilm').remove();
    }
    mainPage ();
    getMovis(1, selectTypeSort(document.getElementById('sortForm')))
        .then(post =>  {
            document.querySelector('.preloader-5').classList.remove('display-block');
            window.currentBasa = post.results.slice();
            createGetMovie();
        })
        .catch(err => {
            createPage404 ();
            console.log(err)
        });
    createPagination ();
}

//Получить список жанров
function getMoveGenre () {
    return Promise.resolve().then(() => {
        return fetch (` https://api.themoviedb.org/3/genre/movie/list?api_key=dcc9acdebadcf222b7588db1d80573d0&language=ru`).then(
            response => response.json())
    })
}

function createPage404 () {
    page.html = `
     <div class="wrap">
		<div class="logoMistake">
			<h1>404</h1>
			<p> Sorry - File not Found!</p>
			<p> Вернитесь на главную страницу и попробуйте еще раз</p>
		</div>
	</div>
    `;
    while (containerAll.firstChild) {
        containerAll.removeChild(containerAll.firstChild);
    }
    containerAll.innerHTML = page.html;
}

/* Demo JS */
import './aboutFilm'
import './mouseEvent';
