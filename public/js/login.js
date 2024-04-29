const gosign = document.querySelector('#gosign');
const log = document.getElementById('log');
const sign = document.getElementById('sign');

gosign.addEventListener('click', () => {
    // اعمال انیمیشن fade-out به المان فعلی
    log.style.transition = 'opacity .3s ease-in-out';
    log.style.opacity = '0';

    // گوشه‌گیری رویداد transitionend برای پایان ترانزیشن
    log.addEventListener('transitionend', () => {
        // مخفی کردن المان فعلی
        log.style.visibility = 'hidden';
        // log.style.opacity = '0'

        // نمایش المان بعدی با انیمیشن fade-in
        log.style.display = 'none';
        sign.style.visibility = 'visible';
        sign.style.transition = 'opacity .5s ease-in-out';
        sign.style.display = 'flex';
        sign.style.opacity = '1';
    }, { once: true }); // استفاده از گزینه once برای یکبار اجرا
});


golog.addEventListener('click', () => {
    // اعمال انیمیشن fade-out به المان فعلی
    sign.style.transition = 'opacity .3s ease-in-out';
    sign.style.opacity = '0';

    // گوشه‌گیری رویداد transitionend برای پایان ترانزیشن
    sign.addEventListener('transitionend', () => {
        // مخفی کردن المان فعلی
        sign.style.visibility = 'hidden';

        sign.style.display = 'none';
        log.style.visibility = 'visible';
        log.style.display = 'flex';
        log.style.transition = 'opacity .5s ease-in-out';
        log.style.opacity = '1';
    }, { once: true }); // استفاده از گزینه once برای یکبار اجرا
});





