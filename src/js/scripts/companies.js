const token = localStorage.getItem('token');
const headers = new Headers();
headers.append('Accept','application/json');
headers.append('Content-Type','application/json');
headers.append('Authorization', `Bearer ${token}`);
headers.append('Access-Control-Allow-Origin', '*');

const tableBody = document.getElementById('tableData');

const nameTitle = document.getElementById('name');
const addressTitle = document.getElementById('address');
const countryTitle = document.getElementById('country');
const telephoneTitle = document.getElementById('telephone');
const selectRegion = document.getElementById('regions');
const selectCountries = document.getElementById('countries');
const selectCities = document.getElementById('cities');
const popUpCompanyWindow = document.getElementById('pop-up-company');
const addCompanyBtn = document.getElementById('add-company');
const submitPopUp = document.getElementById('submit-pop-up');
const cancelPopUp = document.getElementById('cancel-pop-up');
const popUpTitle = document.getElementById('pop-up-title');
const userTab = document.getElementById('users-tab');

const userIsAdmin = localStorage.getItem('isAdmin');

let sortDirection = false;

let companiesArr = [];

let allRegions = [];
let allCountries = [];
let allCities = [];


class Companies {
    async getCompanies() {
        try {

            /* let result = await fetch('companies.json'); */
            let result = await fetch('http://localhost:3000/companies', {
                headers,
            });
            let data = await result.json();
            
            let companies = data.map(company => company);
            companiesArr = companies;
            return companies;
        } catch (err) {
            console.log(err);
        }
    }
}

class AllRegionsCities {
    async getAllRegionsCities() {
        try {

            /* let result = await fetch('regions.json');  */
            let result = await fetch('http://localhost:3000/allRegionsCities', {
                headers,
            });
            let data = await result.json();
            /*vacío los arrays para que no acumulen resultados*/
            allRegions.length = 0;
            allCountries.length = 0;
            allCities.length = 0;

            let allRegionsCities = data.map(region => region);
            allRegionsCities.forEach(region => {
                let region_id = region.id;
                let region_name = region.name;
                allRegions.push({ region_id, region_name });
                region.countries.forEach(country => {
                    let country_id = country.id;
                    let country_name = country.name;
                    allCountries.push({ region_id, country_id, country_name });
                    country.cities.forEach(city => {
                        let city_id = city.id;
                        let city_name = city.name;
                        allCities.push({ country_id, city_id, city_name });
                    })
                })
            });

            return allRegionsCities;
        } catch (err) {
            console.error(err);
        }
    }
}


class UI{

    displayCompanies(companies) {
        let dataHtml = '';
        for (let company of companies) {
            dataHtml += `
            <tr>
                <td>
                    <div class='tableDiv'>
                        <span>${company.name}</span>
                        <span class='subtext'>${company.email}</span>
                    </div>
                </td>
                <td>${company.address}</td>
                <td>
                    <div class='tableDiv'>
                        <span>${company.city.country.name}</span>
                        <span class='subtext'>${company.city.country.region.name}</span>
                    </div>
                </td>
                <td>${company.telephone}</td>
                <td>
                    <div>
                        <span data-id=${company.id} class='edit-cpny'><i class="fas fa-edit"></i></span>
                        <span data-id=${company.id} class='remove-cpny'><i class="fas fa-trash remove-cpny" data-id=${company.id}></i></span>
                    </div>
                </td>
            </tr>
            `;
        }
        tableBody.innerHTML = dataHtml;
    }

    sortColumn(companies, sort, columnName) {
        let companiesSorted = companies.sort((p1, p2) => {
            return sort ? p1[columnName].toUpperCase() < p2[columnName].toUpperCase() : p2[columnName].toUpperCase() < p1[columnName].toUpperCase();
        })
        this.displayCompanies(companiesSorted);
    }

    sortColumnCountry(companies, sort) {
        let companiesSorted = companies.sort((p1, p2) => {
            return sort ? p1.city.country.name.toUpperCase() < p2.city.country.name.toUpperCase() : p2.city.country.name.toUpperCase() < p1.city.country.name.toUpperCase();
        })
        this.displayCompanies(companiesSorted);
    }

    titlesOrder(companies) {
        nameTitle.addEventListener('click', () => {
            sortDirection = !sortDirection;
            this.sortColumn(companies, sortDirection, 'name');
        });
        addressTitle.addEventListener('click', () => {
            sortDirection = !sortDirection;
            this.sortColumn(companies, sortDirection, 'address');
        });
        countryTitle.addEventListener('click', () => {
            sortDirection = !sortDirection;
            this.sortColumnCountry(companies, sortDirection);
        });
        telephoneTitle.addEventListener('click', () => {
            sortDirection = !sortDirection;
            this.sortColumn(companies, sortDirection, 'telephone');
        });
    }

    displayRegions(regions, id) {
        selectRegion.innerHTML = '';
        let selectHTML = '';
        if (id == '') {
            selectHTML += '<option value="" disabled selected>Seleccionar región</option>';
        } else {
            selectHTML += '<option value="" disabled>Seleccionar región</option>';
        }

        regions.forEach(region => {
            if (id == region.id) {
                selectHTML += `<option value="${region.region_id}" selected>${region.region_name}</option>`
            } else {
                selectHTML += `<option value="${region.region_id}">${region.region_name}</option>`
            }
        })
        selectRegion.innerHTML += selectHTML;
    }

    displayCountries(region_id, country_id) {
        selectCountries.disabled = false;
        selectCountries.innerHTML = '';
        let countriesToDisplay = allCountries.filter(country => country.region_id == region_id);
        let selectHTML = '';
        if (country_id == '') {
            selectHTML += '<option value="" disabled selected>Seleccionar País</option>';
        }else {
            selectHTML += '<option value="" disabled>Seleccionar País</option>';
        }
        countriesToDisplay.forEach(country => {
            if (country_id == country.country_id) {
                selectHTML += `<option value="${country.country_id}" selected>${country.country_name}</option>`
            } else {
                selectHTML += `<option value="${country.country_id}">${country.country_name}</option>`
            }
        })
        selectCountries.innerHTML += selectHTML;
    }

    displayCities( country_id, city_id) {
        selectCities.disabled = false;
        selectCities.innerHTML = '';
        let citiesToDisplay = allCities.filter(city => city.country_id == country_id);
        let selectHTML = '';
        if (city_id == '') {
            selectHTML += '<option value="" disabled selected>Seleccionar Ciudad</option>';
        } else {
            selectHTML += '<option value="" disabled>Seleccionar Ciudad</option>';
        }
        citiesToDisplay.forEach(city => {
            if (city_id == city.city_id) {
                selectHTML += `<option value="${city.city_id}" selected>${city.city_name}</option>`
            } else {
                selectHTML += `<option value="${city.city_id}">${city.city_name}</option>`
            }
        })
        selectCities.innerHTML += selectHTML;
    }

    resetCountriesCities() {
        selectCountries.innerHTML = '<option value="" disabled selected>Seleccionar País</option>';
        selectCities.innerHTML = '<option value="" disabled selected>Seleccionar Ciudad</option>';
    }

    resetPopUp() {
        document.getElementById('input-name').value = '';
        document.getElementById('input-address').value = '';
        document.getElementById('input-email').value = '';
        document.getElementById('input-telephone').value = '';
        selectRegion.getElementsByTagName('option')[0].selected = 'selected';
        selectCountries.disabled = 'disabled';
        selectCities.disabled = 'disabled';
        this.resetCountriesCities();
        popUpCompanyWindow.style.display = 'none';
    }

    regionChangesListener() {
        selectRegion.addEventListener('change', () => {
            this.resetCountriesCities();
            this.displayCountries(selectRegion.value, '')
        });

        selectCountries.addEventListener('change', () => {
            this.displayCities(selectCountries.value, '')
        });
    }

    addCompany() {
        addCompanyBtn.addEventListener('click', () => {
            this.resetPopUp();
            popUpTitle.textContent = 'Compañía a agregar';
            submitPopUp.textContent = 'Agregar';
            popUpCompanyWindow.children[0].children[1].style.display = 'inline-grid';
            popUpCompanyWindow.children[0].children[2].style.display = 'inline-grid';
            popUpCompanyWindow.style.display = 'block';

            this.displayRegions(allRegions, '');
            this.resetCountriesCities();
            this.regionChangesListener();

        });
    }

    editCompany() {
        const editBtns = [...document.querySelectorAll(".edit-cpny")];
        editBtns.forEach(button => {
            button.addEventListener('click', () => {
                let compEdt = companiesArr.find(company => company.id == button.dataset.id);
                this.resetPopUp();
                
                this.displayRegions(allRegions, compEdt.city.country.region.id);
                this.displayCountries(compEdt.city.country.region.id, compEdt.city.country.id);
                this.displayCities(compEdt.city.country.id, compEdt.city.id);

                this.regionChangesListener();

                document.getElementById('input-name').value = compEdt.name;
                document.getElementById('input-address').value = compEdt.address;
                document.getElementById('input-email').value = compEdt.email;
                document.getElementById('input-telephone').value = compEdt.telephone;

                popUpTitle.textContent = 'Compañía a editar';
                submitPopUp.textContent = 'Editar';
                submitPopUp.dataset.id = button.dataset.id;
                popUpCompanyWindow.children[0].children[1].style.display = 'inline-grid';
                popUpCompanyWindow.children[0].children[2].style.display = 'inline-grid';
                popUpCompanyWindow.style.display = 'block';
            })
        })
    }

    delCompany() {
        const tableRows = [...document.querySelectorAll("tr")];
        tableRows.forEach(row => {
            row.addEventListener('click', (event) => {
                if (event.target.classList.contains('remove-cpny')) {
                    let compDel = companiesArr.find(company => company.id == event.target.dataset.id);
                    popUpTitle.textContent = `¿Seguro que quieres eliminar la compañia ${compDel.name}?`;
                    popUpCompanyWindow.children[0].children[1].style.display = 'none';
                    popUpCompanyWindow.children[0].children[2].style.display = 'none';
                    submitPopUp.dataset.id = event.target.dataset.id;
                    submitPopUp.textContent = 'Eliminar';
                    popUpCompanyWindow.style.display = 'block';
                }
            })
        })
    }

    async submitCompany() {
        submitPopUp.addEventListener('click', async () => {

            /*info for fetch*/
            let url = ``;
            let fetchMethod = '';
            let fetchBody = '';

            /*info for body*/
            let name = submitPopUp.parentElement.parentElement.children[1].children[0].children[1].value;
            let address = submitPopUp.parentElement.parentElement.children[1].children[1].children[1].value;
            let email = submitPopUp.parentElement.parentElement.children[1].children[2].children[1].value;
            let telephone = submitPopUp.parentElement.parentElement.children[1].children[3].children[1].value;
            let cities_id = submitPopUp.parentElement.parentElement.children[2].children[2].children[1].value;

            if (submitPopUp.textContent == 'Agregar') {
                url = 'http://localhost:3000/companies';
                fetchMethod = 'POST';
                fetchBody = JSON.stringify({ name, address, email, telephone, cities_id });
            } else if (submitPopUp.textContent == 'Editar') {
                let idParam = submitPopUp.dataset.id;
                url = `http://localhost:3000/companies/${idParam}`;
                fetchMethod = 'PUT';
                fetchBody = JSON.stringify({ name, address, email, telephone, cities_id });
            } else if (submitPopUp.textContent == 'Eliminar') {
                let idParam = submitPopUp.dataset.id;
                url = `http://localhost:3000/companies/${idParam}`;
                fetchMethod = 'DELETE';
            }

            try {
                const responseLogin = await fetch(url, {
                    method: fetchMethod,
                    body: fetchBody,
                    headers
                });
            
                const responseObject = await responseLogin.json();
                if (responseLogin.status == 201 || responseLogin.status == 200) {
                    location.reload(); 
                } else {
                    alert(responseObject.error);
                }
            } catch (error) {
                alert("algo salio mal intente mas tarde");
                console.error(error);
            }
        })
    }

    cancelPopUp() {
        cancelPopUp.addEventListener('click', () => {
            this.resetPopUp();
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
    popUpCompanyWindow.style.display = 'none';
    const ui = new UI();
    const companies = new Companies();
    const allRegionCities = new AllRegionsCities();
    ui.checkAdmin();
    companies.getCompanies().then(companies => {
        allRegionCities.getAllRegionsCities();
        ui.displayCompanies(companies);
    }).then(() => {
        ui.titlesOrder(companiesArr);
        /* ui.actionsLogic(); */
        ui.editCompany();
        ui.addCompany();
        ui.delCompany();
        ui.cancelPopUp();
        ui.submitCompany();
    })
})