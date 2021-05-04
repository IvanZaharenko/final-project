
document.addEventListener ('DOMContentLoaded', function () {
    document.getElementById('containerListMovie').addEventListener('mouseover',  (event) => {
        const target = event.target;

        if (target.closest('.item_movie') !== null) {
            const voteItem = target.closest('.item_movie').querySelector('.vote_item');
            const releaseItem = target.closest('.item_movie').querySelector('.release_item');
            voteItem.classList.add('visable');
            releaseItem.classList.add('visable');

            document.getElementById('containerListMovie').addEventListener('mouseout',  (event) => {
                voteItem.classList.remove('visable');
                releaseItem.classList.remove('visable');
            });
        }
    });
});


