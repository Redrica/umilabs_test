(function () {
    var form = document.querySelector('.write__form'),
        name = document.getElementById('name'),
        email = document.getElementById('email'),
        phone = document.getElementById('phone');

    console.log(name);


    form.addEventListener('submit', function (evt) {
        if (name.value === '') {
            evt.preventDefault();
            console.log('не заполнено имя');
        }

        console.log(name.value);
    })
})();