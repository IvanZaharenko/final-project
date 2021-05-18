const containerAll = document.getElementById('containerAll');

containerAll.addEventListener('click', (event) => {
    let target = event.target;
    if (!target.classList.contains('item_movie')) return;
    document.querySelector('.preloader-5').classList.add('display-block');
    window.scrollTo(0,0);
    if (searchMoveID(target) === 0) {
        aboutFilmPage(newFilm[searchNewMoveTitle(target)]);
    } else {
        getMoveID(searchMoveID(target))
            .then(post => aboutFilmPage(post))
            .catch(err => console.log(err));
    }
});

containerAll.addEventListener('click', () => {
    let target = event.target;
    if (!target.classList.contains('like'))return;
    target.classList.toggle('click_like');
    if (target.classList.contains('click_like')) {
        target.closest('.about-vote_count').querySelector('.count_like').innerHTML = Number(target.closest('.about-vote_count').querySelector('.count_like').innerHTML) + 1;
    }   else {
        target.closest('.about-vote_count').querySelector('.count_like').innerHTML = Number(target.closest('.about-vote_count').querySelector('.count_like').innerHTML) -1;
    }
});

function aboutFilmPage (postID) {
    let infoFilm = postID;
    let src = '';
    document.querySelector('.preloader-5').classList.remove('display-block');

    if (infoFilm.poster_path === null || infoFilm.poster_path === undefined) {
        src = `http://placehold.it/200x319`;
    } else {
        src = `https://image.tmdb.org/t/p/w500${infoFilm.poster_path}`;
    }
    document.getElementById('containerListMovie').remove();
        page.html  = `
        <article id="containerAboutFilm">
            <div id="about-film_poster">
                <img src="${src}" alt="Постер фильма"/>`;
        if (adminMode) {
            page.html  += ` <a class="deleteFilm_about">☒</a>
                            <a class="redactFilm">&#9998;</a>`
        }
        page.html  += ` 
            </div>
                <div id="about-film_info">
                    <h2 class="about_title"> ${infoFilm.title}</h2>
                    <p class="about_miniOverview">${infoFilm.tagline}</p>
                    <p class="about_release">Год выпуска: <span class="white_color"> ${infoFilm.release_date.split('-').reverse().join('/')}</span></p>
                    <p class="about_genres">Жанры: <span class="white_color">${actualGenre(infoFilm).slice(1,-1)+'.'}</span></p>
                    <p class="about_vote">Рейтинг: <span class="white_color">${infoFilm.vote_average}/10</span></p>
                    <p class="about-vote_count">Понравилось: <span class="white_color count_like">${infoFilm.vote_count}</span> людям.`;
        if (window.otherUserMode) {
            page.html += `<input id="toggle-heart" type="checkbox"/>
                          <label for="toggle-heart" aria-label="like" class="like">❤</label>`
        }
        page.html +=`</p>
                <p class="about_overview">Описание фильма: <br><span class="white_color">${infoFilm.overview}</span></p>
                </div>
            </article>`;
    containerAll.innerHTML = page.html;
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

const searchNewMoveTitle = context => {
    let item = 0;
    for(item; item <= newFilm.length; item++) {
        if (newFilm[item].title === context.closest('.item_movie').querySelector('.title_item').innerHTML ) {
            break
        }
    }
    return item;
};

 const actualGenre = basa => {
    let genresIdFilm = [];
    let genreFilm = '';
    for (let j = 0; j < basa.genres.length; j++) {
        genresIdFilm.push(basa.genres[j].id)
    }
    for (let i = 0; i < basaGenre.length; i++) {
        for(let k = 0; k < genresIdFilm.length; k++ ){
            if (basaGenre[i].id === genresIdFilm[k]) {
                let item = basaGenre[i].name;
                genreFilm += ' ' + item.charAt(0).toUpperCase() + item.slice(1) + ',';
                continue
                }
        }
    }
    return genreFilm
 };
