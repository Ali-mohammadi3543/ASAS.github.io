document.addEventListener('DOMContentLoaded', function () {
    const textElement = document.getElementById('text-box-h1');
    const textToType = 'Code the Future,Today';

    function startTypewriter() {
        typeWriter(textToType, 0, () => {
            setTimeout(() => {
                eraseText(() => {
                    startTypewriter();
                });
            }, 1000);
        });
    }

    function typeWriter(text, i, callback) {
        if (i < text.length) {
            textElement.innerHTML += text.charAt(i);
            i++;
            setTimeout(() => typeWriter(text, i, callback), 100);
        } else {
            callback();
        }
    }

    function eraseText(callback) {
        const text = textElement.innerHTML;
        const length = text.length;
        if (length > 0) {
            textElement.innerHTML = text.slice(0, length - 1);
            setTimeout(() => eraseText(callback), 50);
        } else {
            callback();
        }
    }

    startTypewriter();
});



function gotosupport() {
    var supportSection = document.getElementById('about-us');

    if (supportSection) {
        supportSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function gotoServices() {
    var servicesSection = document.getElementById('Services');

    if (servicesSection) {
        servicesSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function gotoContact() {
    var ContactSection = document.getElementById('footer');

    if (ContactSection) {
        ContactSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

const hamber_menu2 = document.getElementById('hamber-menu2');
const li_hamber2 = document.getElementById('li-hamber2');

function toggleul2() {
    li_hamber2.classList.toggle('hidden');
}
let mybutton = document.getElementById("myBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () { scrollFunction() };

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    // For modern browsers
    document.documentElement.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

    // For Safari
    document.body.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}
document.addEventListener("keydown",
    (event) => {
        if (event.keyCode === 123) {
            event.preventDefault()
        }
    }
)
var modal = document.getElementById("myModal");
var btn = document.getElementById("myBtn4");
var span = document.getElementsByClassName("close")[0];

// تابعی که پنجره پاپ‌آپ را باز می‌کند
btn.onclick = function () {
    modal.style.display = "block";
}

// تابعی که پنجره پاپ‌آپ را می‌بندد
span.onclick = function () {
    modal.style.display = "none";
}

// بستن پنجره پاپ‌آپ با کلیک در بیرون از آن
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

var modal2 = document.getElementById("myModal2");
var btn2 = document.getElementById("myBtn2");
var span2 = document.getElementsByClassName("close2")[0];

// تابعی که پنجره پاپ‌آپ را باز می‌کند
btn2.onclick = function () {
    modal2.style.display = "block";
}

// تابعی که پنجره پاپ‌آپ را می‌بندد
span2.onclick = function () {
    modal2.style.display = "none";
}

// بستن پنجره پاپ‌آپ با کلیک در بیرون از آن
window.onclick = function (event) {
    if (event.target == modal2) {
        modal2.style.display = "none";
    }
}


var modal3 = document.getElementById("myModal3");
var btn3 = document.getElementById("myBtn3");
var span3 = document.getElementsByClassName("close3")[0];

btn3.onclick = function () {
    modal3.style.display = "block";
}

span3.onclick = function () {
    modal3.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modal3) {
        modal3.style.display = "none";
    }
}

const socket = io();

// Listen for the 'updateUserCount' event and update the display
socket.on('updateUserCount', (userCount) => {
    document.getElementById('userCount').innerText = userCount;
});
