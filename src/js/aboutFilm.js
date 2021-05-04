
document.addEventListener ('DOMContentLoaded', function () {

document.getElementById('containerListMovie').addEventListener('click', (event) => {
    let target = event.target;
    if (target.closest('.item_movie') !== null) {

        getMoveID(searchMoveID(target))
            .then(post =>  {
                aboutFilmPage (post);
                console.log(post);
            })
            .catch(err => console.log(err));
        }
    });
});

function aboutFilmPage (postID) {

    page.html  = `
        <article id="containerAboutFilm">
            <div id="about-film_poster">
                <img src="http://placehold.it/200x319" alt="Постер фильма"/>
            </div>
            <div id="about-film_info">
                <h2 class="about_title">${postID.title}</h2>
                <p class="about_miniOverview">${postID.tagline}</p>
                <p class="about_release">Год выпуска: <span class="white_color">${postID.release_date}</span></p>
                <p class="about_genres">Жанры <span class="white_color"></span></p>
                <p class="about_vote">рейтинг: <span class="white_color">${postID.vote_average}/10</span></p>
                <p class="about_overview">Описание фильма: <br><br><span class="white_color">${postID.overview}</span></p>
            </div>
        </article>
    `;

    while (document.getElementById('containerAll').firstChild) {
        document.getElementById('containerAll').removeChild(document.getElementById('containerAll').firstChild);
    }

   // console.log( page.html)
   document.getElementById('containerAll').innerHTML = page.html;
}


function getMoveID (id) {
    return Promise.resolve().then(() => {
        return fetch (`https://api.themoviedb.org/3/movie/${id}?api_key=dcc9acdebadcf222b7588db1d80573d0&language=ru`).then(
            response => response.json())
    })
}
const searchMoveID = (context) => {
    let item = 0;
    for (item; item <= currentBasa.length; item++){
        if (currentBasa[item].title === context.closest('.item_movie').querySelector('.title_item').innerHTML ) {
            break
        }
    }
    return currentBasa[item].id
};
