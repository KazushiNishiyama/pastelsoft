document.addEventListener("DOMContentLoaded", function () {
    const works = document.querySelectorAll('.work,.contact,.skill,.profile');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // 一度表示したら監視解除（繰り返し不要なら）
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2 // 20%表示されたら発火
    });

    works.forEach(work => {
        observer.observe(work);
    });
});