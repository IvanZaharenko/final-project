const containerAll = document.getElementById('containerAll');


containerAll.addEventListener('click', (event) =>{
    let target = event.target;

    if (target.classList.contains('item_movie')) {
        getMoveID(searchMoveID(target))
            .then(post =>  {
                aboutFilmPage (post);
            })
            .catch(err => console.log(err));
    }
});

function aboutFilmPage (postID) {
    let src = '';
    let genre = [];

    for (let i = 0; i < postID.genres.length; i++) {
       let item = postID.genres[i].name;
       genre.push(' ' + item.charAt(0).toUpperCase() + item.slice(1) );
    }
    if (postID.poster_path === null ) {
        src = `http://placehold.it/200x319`;
    } else {
        src = `https://image.tmdb.org/t/p/w500${postID.poster_path}`;
    }

    document.getElementById('containerListMovie').remove();

    if (adminMode){
        page.html  = `
        <article id="containerAboutFilm">
            <div id="about-film_poster">
                <img src="${src}" alt="Постер фильма"/>
                <a class="deleteFilm_about">☒</a>
                <a class="redactFilm">&#9998;</a>
            </div>
            <div id="about-film_info">
                <h2 class="about_title"> ${postID.title}</h2>
                <p class="about_miniOverview">${postID.tagline}</p>
                <p class="about_release">Год выпуска: <span class="white_color"> ${postID.release_date.split('-').reverse().join('/')}</span></p>
                <p class="about_genres">Жанры:  <span class="white_color">${genre + '.'}</span></p>
                <p class="about_vote">рейтинг: <span class="white_color">${postID.vote_average}/10</span></p>
                <p class="about_overview">Описание фильма: <br><br><span class="white_color">${postID.overview}</span></p>
            </div>
        </article>
    `;
    containerAll.innerHTML = page.html;
    } else {
        page.html  = `
        <article id="containerAboutFilm">
            <div id="about-film_poster">
                <img src="${src}" alt="Постер фильма"/>
            </div>
            <div id="about-film_info">
                <h2 class="about_title"> ${postID.title}</h2>
                <p class="about_miniOverview">${postID.tagline}</p>
                <p class="about_release">Год выпуска: <span class="white_color"> ${postID.release_date.split('-').reverse().join('/')}</span></p>
                <p class="about_genres">Жанры:  <span class="white_color">${genre + '.'}</span></p>
                <p class="about_vote">рейтинг: <span class="white_color">${postID.vote_average}/10</span></p>
                <p class="about_overview">Описание фильма: <br><br><span class="white_color">${postID.overview}</span></p>
            </div>
        </article>
    `;
    containerAll.innerHTML = page.html;
    }



}

//Получить фильм по выбранному id
function getMoveID (id) {
    return Promise.resolve().then(() => {
        return fetch (`https://api.themoviedb.org/3/movie/${id}?api_key=dcc9acdebadcf222b7588db1d80573d0&language=ru`).then(
            response => response.json())
    })
}
//Получить фильм по выбранному id
const searchMoveID = (context) => {
    let item = 0;
    for (item; item <= currentBasa.length; item++){
        if (currentBasa[item].title === context.closest('.item_movie').querySelector('.title_item').innerHTML ) {
            break
        }
    }
    return currentBasa[item].id
};
