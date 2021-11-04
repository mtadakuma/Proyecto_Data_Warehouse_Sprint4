const regiones = document.getElementById('regiones');
const token = localStorage.getItem('token');
const popUp = document.getElementById('pop-up');
const titleName = document.getElementById('title-name');
const titleNameValue = document.getElementById('title-name-value');
const titleInput = document.getElementById('title-input');
const btnSubmit = document.getElementById('submit');
popUp.style.display = 'none';
const popUpDiv = document.querySelector('.pop-up-div');

const userTab = document.getElementById('users-tab');
const userIsAdmin = localStorage.getItem('isAdmin');

const headers = new Headers();    
headers.append('Accept','application/json');
headers.append('Content-Type','application/json');
headers.append('Authorization', `Bearer ${token}`);
headers.append('Access-Control-Allow-Origin', '*');

let btnAll = [];

class AllRegionsCities {
    async getAllRegionsCities() {
        try {

            /* let result = await fetch('regions.json');  */
            let result = await fetch('http://localhost:3000/allRegionsCities', {
                headers,
            });
            let data = await result.json();
            
            let allRegionsCities = data.map(region => region);
            return allRegionsCities;
        } catch (err) {
            console.error(err);
        }
    }
}

class UI {
    displayRegionCities(allRegionsCities) {
        allRegionsCities.forEach(region => {
            /* -----------seccion de regiones----------- */
            let region_id = region.id;
            let region_name = region.name;
            let myRegion = document.createElement('div');
            myRegion.classList.add('region');
            myRegion.innerHTML += `
                <div class='title-buttons'>
                    <h2>${region_name}</h2>
                    <button class='add-ctry btn' name='${region_name}' data-id=${region_id}><i class="fas fa-plus-circle"></i> Agregar País</button>
                </div>
            `
            /* -----------seccion de paises----------- */
            if (region.countries != null) {
                let countriesDiv = document.createElement('div');
                countriesDiv.classList.add('paises');
                myRegion.appendChild(countriesDiv);
                region.countries.forEach(country => {
                    let country_id = country.id;
                    let country_name = country.name;
                    let myCountry = document.createElement('div');
                    myCountry.classList.add('pais');
                    myCountry.innerHTML += `
                    <div class='title-buttons'>
                        <h2>${country_name}</h2>
                        <div>
                        <button class='edt-ctry btn' name='${country_name}' data-id=${country_id}><i class="fas fa-edit"></i> Editar País</button>
                        <button class='del-ctry btn' name='${country_name}' data-id=${country_id}><i class="fas fa-trash"></i> Eliminar País</button>
                        <button class='add-city btn' name='${country_name}' data-id=${country_id}><i class="fas fa-plus-circle"></i> Agregar Ciudad</button>
                        </div>
                    </div>
                    `
                    /* -----------seccion de ciudades----------- */
                    if (country.cities != null) {
                        let citiesDiv = document.createElement('div');
                        citiesDiv.classList.add('ciudades');
                        myCountry.appendChild(citiesDiv);
                        country.cities.forEach(city => {
                            let city_id = city.id;
                            let city_name = city.name;
                            let myCity = document.createElement('div');
                            myCity.classList.add('ciudad');
                            myCity.innerHTML += `
                            <div class='title-buttons'>
                                <h2>${city_name}</h2>
                                <div class='title-bnts-city'>
                                <button class='edt-city btn' name='${city_name}' data-id=${city_id}><i class="fas fa-edit"></i> Editar Ciudad</button>
                                <button class='del-city btn' name='${city_name}' data-id=${city_id}><i class="fas fa-trash"></i> Eliminar Ciudad</button>
                                </div>
                            </div>
                            `
                            citiesDiv.appendChild(myCity);
                        })
                    }
                    countriesDiv.appendChild(myCountry);
                })
            }
            regiones.appendChild(myRegion);
        });
    }

    getButtons() {
        btnAll = [...document.querySelectorAll('.btn')];
        btnAll.forEach(button => {
            /*Agrego el contenido al pop-up de todos los botones*/
            button.addEventListener('click', async (event) => {
                /* event.preventDefault(); */
                var idRegion = '';
                var idCountry = '';
                var idCity = '';
                if (button.classList.contains('cancel')) {
                    popUp.style.display = 'none';
                } else {
                    popUp.style.display = 'block';
                    titleInput.style.display = 'block';
                    titleNameValue.style.display = 'none';
                    titleInput.value = '';
                    if (button.classList.contains('add-reg')) {
                        titleName.textContent = 'Región a agregar: ';
                        btnSubmit.textContent = 'Agregar región';
                    } else if (button.classList[0].includes('ctry')) {
                        titleName.textContent = 'País ';
                        if (button.classList[0].includes('add')) {
                            titleName.textContent += 'a agregar: ';
                            btnSubmit.textContent = 'Agregar país';
                            idRegion = button.dataset.id;
                            btnSubmit.dataset.id = idRegion;
                        } else if (button.classList[0].includes('edt')) {
                            titleName.textContent += 'a modificar: ';
                            titleInput.value = button.name;
                            btnSubmit.textContent = 'Modificar país';
                            idCountry = button.dataset.id;
                            btnSubmit.dataset.id = idCountry;
                        } else if (button.classList[0].includes('del')) {
                            titleName.textContent += 'a eliminar: ';
                            titleNameValue.style.display = 'block';
                            titleNameValue.textContent = button.name;
                            titleInput.style.display = 'none';
                            btnSubmit.textContent = 'Eliminar país';
                            idCountry = button.dataset.id;
                            btnSubmit.dataset.id = idCountry;
                        }
                    } else if (button.classList[0].includes('city')) {
                        titleName.textContent = 'Ciudad ';
                        if (button.classList[0].includes('add')) {
                            titleName.textContent += 'a agregar: ';
                            btnSubmit.textContent = 'Agregar ciudad';
                            idCountry = button.dataset.id;
                            btnSubmit.dataset.id = idCountry;
                        } else if (button.classList[0].includes('edt')) {
                            titleName.textContent += 'a modificar: ';
                            titleInput.value = button.name;
                            btnSubmit.textContent = 'Modificar ciudad';
                            idCity = button.dataset.id;
                            btnSubmit.dataset.id = idCity;
                        } else if (button.classList[0].includes('del')) {
                            titleName.textContent += 'a eliminar: ';
                            titleNameValue.style.display = 'block';
                            titleNameValue.textContent = button.name;
                            titleInput.style.display = 'none';
                            btnSubmit.textContent = 'Eliminar ciudad';
                            idCity = button.dataset.id;
                            btnSubmit.dataset.id = idCity;
                        }
                    }
                }
            })
        })

        /*Lógica al hacer click en submit para enviar request al servidor*/
        popUpDiv.addEventListener('click', async (event) => {
            if (event.target.classList.contains('submit')) {
                let url = ``;
                let fetchMethod = '';
                let fetchBody = '';
                let tgtTextCnt = event.target.textContent;
                let tgtName = titleInput.value;
                let idBtn = event.target.dataset.id;
                /*----------regiones----------*/
                if (tgtTextCnt == 'Agregar región') {
                    url = 'http://localhost:3000/regions';
                    fetchMethod = 'POST';
                    fetchBody = JSON.stringify({ name: tgtName });
                }
                /*----------paises----------*/
                else if (tgtTextCnt == 'Agregar país') {
                    url = 'http://localhost:3000/countries';
                    fetchMethod = 'POST';
                    fetchBody = JSON.stringify({ region_id: idBtn, name: tgtName });
                }else if (tgtTextCnt == 'Modificar país') {
                    url = `http://localhost:3000/countries/${idBtn}`
                    fetchMethod = 'PUT';
                    fetchBody = JSON.stringify({ name: tgtName});
                }else if (tgtTextCnt == 'Eliminar país') {
                    url = `http://localhost:3000/countries/${idBtn}`
                    fetchMethod = 'DELETE';
                }
                /*----------ciudades----------*/
                else if (tgtTextCnt == 'Agregar ciudad') {
                    url = 'http://localhost:3000/cities';
                    fetchMethod = 'POST';
                    fetchBody = JSON.stringify({ countries_id: idBtn, name: tgtName });
                }
                else if (tgtTextCnt == 'Modificar ciudad') {
                    url = `http://localhost:3000/cities/${idBtn}`
                    fetchMethod = 'PUT';
                    fetchBody = JSON.stringify({ name: tgtName});
                }else if (tgtTextCnt == 'Eliminar ciudad') {
                    url = `http://localhost:3000/cities/${idBtn}`
                    fetchMethod = 'DELETE';
                }
                
                
                
                try {
                    const responseLogin = await fetch(url, {
                        method: fetchMethod,
                        body: fetchBody,
                        headers
                    });
                
                    const responseObject = await responseLogin.json();
                    if (responseLogin.status != 201) {
                        alert(responseObject.error);
                    } else {
                        location.reload(); 
                    }
                } catch (error) {
                    alert("algo salio mal intente mas tarde");
                    console.error(error);
                }
                
            }
        })
    }

    checkAdmin() {
        if (userIsAdmin == 'false') {
            userTab.style.display = 'none';
        }else{
            userTab.style.display = 'block';
        }
    }
}


document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI();
    const allRegionCities = new AllRegionsCities();
    ui.checkAdmin();
    //get all region and cities
    allRegionCities.getAllRegionsCities().then(regions => {
        ui.displayRegionCities(regions);
    }).then(() => {
        ui.getButtons();
    })
});


