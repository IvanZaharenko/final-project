
document.addEventListener ('DOMContentLoaded', function () {
    document.getElementById('containerAll').addEventListener('mouseover',  (event) => {
        const target = event.target;

        if (target.closest('.item_movie') !== null) {
            if (adminMode) {
                target.closest('.item_movie').querySelector('.deleteFilm').classList.add('visable');
            }
            const voteItem = target.closest('.item_movie').querySelector('.vote_item');
            const releaseItem = target.closest('.item_movie').querySelector('.release_item');

            voteItem.classList.add('visable');
            releaseItem.classList.add('visable');
            //console.log('www');

            document.getElementById('containerListMovie').addEventListener('mouseout',  (event) => {

                if (adminMode) {
                    target.closest('.item_movie').querySelector('.deleteFilm').classList.remove('visable');
                }
                voteItem.classList.remove('visable');
                releaseItem.classList.remove('visable');
            });
        }
    });
});


