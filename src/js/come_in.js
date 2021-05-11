
const comeIn = document.querySelector('.double-border-button');

//клик на вход
comeIn.addEventListener('click', () => {
    let user_head = document.querySelector('.user_head');
    if (user_head.innerHTML !== ''){
        user_head.classList.remove('visable');
        user_head.innerHTML = '';
        document.querySelector('.double-border-button').innerHTML = 'Sign In / Sign Up';

        adminMode = false;
       // console.log(adminMode)

    } else comeInPage()
});


/*//скачиваем базу вопросов и работаем с ней
getJSONFile('./dummy_data/users.json', function(data) {
  //  questionBase = JSON.parse(data);
    console.log('1')

});*/

//унккция скачивания локальных данных
function getJSONFile(url,callback) {
    let req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.overrideMimeType("application/json");
    req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === "200") {
            callback(req.responseText);
            }
        };
    req.send(null);
}

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
