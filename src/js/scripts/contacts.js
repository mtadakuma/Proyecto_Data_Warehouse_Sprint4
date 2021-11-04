const token = localStorage.getItem('token');
const headers = new Headers();
headers.append('Accept','application/json');
headers.append('Content-Type','application/json');
headers.append('Authorization', `Bearer ${token}`);
headers.append('Access-Control-Allow-Origin', '*');


const tableBody = document.getElementById('tableData');

const contactTitle = document.getElementById('contact');
const countryTitle = document.getElementById('country');
const companyTitle = document.getElementById('company');
const positionTitle = document.getElementById('position');
const interestTitle = document.getElementById('interest');

const selectRegion = document.getElementById('regions');
const selectCountries = document.getElementById('countries');
const selectCities = document.getElementById('cities');
const selectInterest = document.getElementById('input-interest');

const popUpContactWindow = document.getElementById('pop-up-contact');
const addContactBtn = document.getElementById('add-contact');

const submitPopUp = document.getElementById('submit-pop-up');
const cancelPopUp = document.getElementById('cancel-pop-up');
const popUpTitle = document.getElementById('pop-up-title');

const btnAddChannel = document.getElementById('btn-add-channel');
const tertiaryInfoDiv = document.getElementById('tertiary-info');
const selectChannelInput = [...document.getElementsByClassName('input-channel')][0];
const accountInput =  [...document.getElementsByClassName('input-account')][0];
const selectPreferencesInput = [...document.getElementsByClassName('input-preferences')][0];
const channelRows = document.getElementsByClassName('channel-info-row');
const btnCargarCanales = document.getElementById('btn-load-channel');

const selectCompany = document.getElementById('select-company');
const checkboxAllDel = document.getElementById('check-all-boxes');
const btnDelAllContacts = document.getElementById('del-all-contacts');
const searchBar = document.getElementById('search-bar');

const userTab = document.getElementById('users-tab');
const userIsAdmin = localStorage.getItem('isAdmin');

let sortDirection = false;
let contactsArr = [];

let allRegions = [];
let allCountries = [];
let allCities = [];

let channelsArr = [];
let companiesArr = [];

let contactsDel = [];
let contactsToDisplay = [];

class Contacts{
    async getContacts() {
        try {

            /* let result = await fetch('contact.json'); */
            let result = await fetch('http://localhost:3000/contacts', {
                headers,
            });
            let data = await result.json();
            
            let contacts = data.map(company => company);
            contactsArr = contacts;
            return contacts;
        } catch (err) {
            console.log(err);
        }
    }
}

class AllRegionsCities {
    async getAllRegionsCities() {
        try {

            /* let result = await fetch('regions.json'); */ 
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

class Channels {
    async getChannels() {
        try {

            /* let result = await fetch('channels.json');  */
            let result = await fetch('http://localhost:3000/channels', {
                headers,
            });
            let data = await result.json();
            let channels = data.map(channel => channel);
            channelsArr = channels;
            return channels;
        } catch (err) {
            console.error(err);
        }
    }
}

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

class UI {
    displayContacts(contacts) {
        let dataHtml = '';
        for (let contact of contacts) {
            
            /*-------------meters-------------*/
            let meterClass = '';
        
            switch (contact.interest) {
                case 0:
                    meterClass = 'm-1';
                    break;
                case 25:
                    meterClass = 'm-2';
                    break;
                case 50:
                    meterClass = 'm-3';
                break;
                case 75:
                    meterClass = 'm-4';
                break;
                case 100:
                    meterClass = 'm-5';
                    break;
            }
            let meterHTML = `
                <div class='meter-container'>
                    <div><p>${contact.interest}%</p></div>
                    <div class="meter">
                        <span class=${meterClass}></span>
                    </div>
                </div>
            `
            /*-------------end of meters-------------*/
            /*-------------channels-------------*/
            let channelsHTML = '';
            contact.channels.forEach(channel => {
                channelsHTML += `<span class='channel-box'>${channel.name}</span>`
            })
            /*-------------end of channels-------------*/

            dataHtml += `
            <tr>
                <td>
                    <div class='tableDiv'>
                        <input type="checkbox" name="delete" data-id="${contact.id}" class="checkbox-del">
                    </div>
                </td>
                <td>
                    <div class='tableDiv'>
                        <span>${contact.firstName} ${contact.lastName}</span>
                        <span class='subtext'>${contact.email}</span>
                    </div>
                </td>
                <td>
                    <div class='tableDiv'>
                        <span>${contact.city.country.name}</span>
                        <span class='subtext'>${contact.city.country.region.name}</span>
                    </div>
                </td>
                <td>${contact.company.name}</td>
                <td>${contact.position}</td>
                <td>
                    <div class='tableDiv channels-box'>${channelsHTML}</div>
                </td>
                <td><div class='section-meter'>${meterHTML}</div></td>
                <td>
                    <div class='actions'>
                        <span data-id=${contact.id} class='edit-contact'><i class="fas fa-edit"></i></span>
                        <span data-id=${contact.id} class='remove-contact'><i class="fas fa-trash remove-contact" data-id=${contact.id}></i></span>
                    </div>
                </td>
            </tr>
            `;
        }
        tableBody.innerHTML = dataHtml;
    }

    checkboxButtonsListener() {
        let checkboxBtns = [...document.querySelectorAll(".checkbox-del")];
        checkboxBtns.forEach(button => {
            button.addEventListener('click', () => {
                if (!button.checked) {
                    checkboxAllDel.children[0].checked = false;
                    this.checkIfExistsArr(button.dataset.id, 'rmv');
                } else {
                    this.checkIfExistsArr(button.dataset.id, 'add');
                }
                this.displayButtonDelete();
            })
        })

        checkboxAllDel.addEventListener('click', () => {
            if (checkboxAllDel.children[0].checked) {
                checkboxBtns.forEach(button => {
                    button.checked = true;
                    this.checkIfExistsArr(button.dataset.id, 'add');
                })
            } else {
                checkboxBtns.forEach(button => {
                    button.checked = false;
                    this.checkIfExistsArr(button.dataset.id, 'rmv');
                })
            }
            this.displayButtonDelete();
        })

        
    }

    checkIfExistsArr(id, checkType) {
        if (checkType == 'add') {
            if (contactsDel.indexOf(id) === -1) {
                contactsDel.push(id);
            }
        } else if (checkType == 'rmv') {
            if (contactsDel.indexOf(id) !== -1) {
                contactsDel.splice(contactsDel.indexOf(id), 1);
            }
        }
    }

    displayButtonDelete() {
        if (contactsDel.length > 0) {
            btnDelAllContacts.style.display = 'block';
        } else {
            btnDelAllContacts.style.display = 'none';
        }
    }

    sortNumberColumn(contacts, sort, columnName) {
        let contactsSorted = contacts.sort((p1, p2) => {
            return sort ? p1[columnName] - p2[columnName] : p2[columnName] - p1[columnName];
        })
        this.displayContacts(contactsSorted);
        this.editContact();
        this.delContact();
    }

    sortColumn(contacts, sort, columnName) {
        let contactsSorted = contacts.sort((p1, p2) => {
            return sort ? p1[columnName].toUpperCase() < p2[columnName].toUpperCase() : p2[columnName].toUpperCase() < p1[columnName].toUpperCase();
        })
        this.displayContacts(contactsSorted);
        this.editContact();
        this.delContact();
    }

    sortColumnContact(contacts, sort) {
        let contactsSorted = contacts.sort((p1, p2) => {
            return sort ? p1.firstName.toUpperCase() < p2.firstName.toUpperCase() : p2.firstName.toUpperCase() < p1.firstName.toUpperCase();
        })
        this.displayContacts(contactsSorted);
        this.editContact();
        this.delContact();
    }

    sortColumnCompany(contacts, sort) {
        let contactsSorted = contacts.sort((p1, p2) => {
            return sort ? p1.company.name.toUpperCase() < p2.company.name.toUpperCase() : p2.company.name.toUpperCase() < p1.company.name.toUpperCase();
        })
        this.displayContacts(contactsSorted);
        this.editContact();
        this.delContact();
    }

    sortColumnCountry(contacts, sort) {
        let contactsSorted = contacts.sort((p1, p2) => {
            return sort ? p1.city.country.name.toUpperCase() < p2.city.country.name.toUpperCase() : p2.city.country.name.toUpperCase() < p1.city.country.name.toUpperCase();
        })
        this.displayContacts(contactsSorted);
        this.editContact();
        this.delContact();
    }

    titlesOrder(contacts) {
        contactTitle.addEventListener('click', () => {
            sortDirection = !sortDirection;
            this.sortColumnContact(contacts, sortDirection);
        });
        countryTitle.addEventListener('click', () => {
            sortDirection = !sortDirection;
            this.sortColumnCountry(contacts, sortDirection);
        });
        companyTitle.addEventListener('click', () => {
            sortDirection = !sortDirection;
            this.sortColumnCompany(contacts, sortDirection);
        });
        positionTitle.addEventListener('click', () => {
            sortDirection = !sortDirection;
            this.sortColumn(contacts, sortDirection,'position');
        });
        interestTitle.addEventListener('click', () => {
            sortDirection = !sortDirection;
            this.sortNumberColumn(contacts, sortDirection,'interest');
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

    displayCompanies(companies, id) {
        
        selectCompany.innerHTML = '';
        let selectHTML = '';
        if (id == '') {
            selectHTML += '<option value="" disabled selected>Seleccionar compañía</option>';
        } else {
            selectHTML += '<option value="" disabled>Seleccionar compañía</option>';
        }

        companies.forEach(company => {

            if (id == company.id) {
                selectHTML += `<option value="${company.id}" selected>${company.name}</option>`
            } else {
                selectHTML += `<option value="${company.id}">${company.name}</option>`
            }
        })
        
        selectCompany.innerHTML += selectHTML;
    }

    resetCompany() {
        selectCompany.innerHTML = '<option value="" disabled selected>Seleccionar compañía</option>';
    }

    /*Deja en estado inicial la selección de país y ciudad*/
    resetCountriesCities() {
        selectCountries.innerHTML = '<option value="" disabled selected>Seleccionar País</option>';
        selectCities.innerHTML = '<option value="" disabled selected>Seleccionar Ciudad</option>';
    }

    resetAccountPreferences() {
        accountInput.value = '';
        accountInput.disabled = true;
        selectPreferencesInput.value = 'Sin preferencia';
        selectPreferencesInput.disabled = true;
        btnAddChannel.disabled = true;
    }

    /*Deja en estado inicial la selección de canales*/
    resetChannels() {
        for (let i = 1; i < tertiaryInfoDiv.children.length; i++) {
            tertiaryInfoDiv.children[i].remove();
        };
        selectChannelInput.innerHTML = '';
        accountInput.value = '';
        selectPreferencesInput.value = 'Sin preferencia';
    }
    
    /*Deja en estado inicial el pop up*/
    resetPopUp() {
        document.getElementById('input-first-name').value = '';
        document.getElementById('input-last-name').value = '';
        document.getElementById('input-position').value = '';
        document.getElementById('input-email').value = '';
        document.getElementById('input-address').value = '';
        selectInterest.getElementsByTagName('option')[0].selected = 'selected';
        selectRegion.getElementsByTagName('option')[0].selected = 'selected';
        selectCountries.disabled = 'disabled';
        selectCities.disabled = 'disabled';
        this.resetCompany();
        this.resetCountriesCities();
        this.resetChannels();
        this.resetAccountPreferences();
        popUpContactWindow.style.display = 'none';
    }

    /*Carga las opciones en la selección de canal de contacto*/
    loadSelectChannels() {
        
        let selectHTML = `<option value="" disabled selected>Seleccione Canal</option>`;
        channelsArr.forEach(channel => {
            selectHTML += `
            <option value=${channel.id}>${channel.name}</option>
            `
        })
        selectChannelInput.innerHTML += selectHTML;
    }
    

    /*Crea  las opciones en la selección de canal de contacto*/
    createSelectChannels() {
        let newSelect = document.createElement('select');
        newSelect.name = 'channel';
        newSelect.class = 'input-channel';
        channelsArr.forEach(channel => {
            let option = document.createElement('option');
            option.value = channel.id;
            option.textContent = channel.name;
            newSelect.appendChild(option);
        })
        return newSelect;
    }

    /*Crea  las opciones en la selección de preferencias de contacto*/
    createSelectPreferences() {
        let newSelect = document.createElement('select');
        newSelect.name = 'preferences';
        newSelect.class = 'input-preferences';
    
        let option1 = document.createElement('option');
        option1.value = 'Sin preferencia';
        option1.textContent = 'Sin preferencia';
        newSelect.appendChild(option1);
    
        let option2 = document.createElement('option');
        option2.value = 'Canal favorito';
        option2.textContent = 'Canal favorito';
        newSelect.appendChild(option2);
    
        let option3 = document.createElement('option');
        option3.value = 'No molestar';
        option3.textContent = 'No molestar';
        newSelect.appendChild(option3);
        
        return newSelect;
    }

    /*Crea  una nueva fila de canales de contacto*/
    createNewChannelRow(selection) {
        let newDiv = document.createElement('div');
        newDiv.className = 'channel-info-row';
    
        let newDivChannel = document.createElement('div');
        newDivChannel.className = 'tableDiv';
        newDiv.appendChild(newDivChannel);
    
        let channelLabel = document.createElement('label');
        channelLabel.textContent = 'Canal de contacto';
        newDivChannel.appendChild(channelLabel);
    
        let selectChannels = this.createSelectChannels();
        newDivChannel.appendChild(selectChannels);
    
        let newDivAccount = document.createElement('div');
        newDivAccount.className = 'tableDiv';
        newDiv.appendChild(newDivAccount);
    
        let accountLabel = document.createElement('label');
        accountLabel.textContent = 'Cuenta de usuario';
        newDivAccount.appendChild(accountLabel);
    
        let accountInput = document.createElement('input');
        accountInput.type = 'text';
        accountInput.name = 'account';
        newDivAccount.appendChild(accountInput);
    
        let newDivPreferences = document.createElement('div');
        newDivPreferences.className = 'tableDiv';
        newDiv.appendChild(newDivPreferences);
    
        let preferencesLabel = document.createElement('label');
        preferencesLabel.textContent = 'Preferencias';
        newDivPreferences.appendChild(preferencesLabel);
    
        let selectPreferences = this.createSelectPreferences();
        newDivPreferences.appendChild(selectPreferences);
    
        let btnEditChannel = document.createElement('button');
        btnEditChannel.className = 'btn-edt-channel';
        btnEditChannel.textContent = 'Editar canal';
        newDiv.appendChild(btnEditChannel);
    
        let btnDelChannel = document.createElement('button');
        btnDelChannel.className = 'btn-del-channel';
        btnDelChannel.textContent = 'Eliminar canal';
        newDiv.appendChild(btnDelChannel);
    
        /*todas mis selecciones dependiendo si vienen de la base de datos o de la base*/
        if (selection.nodeName != 'DIV') {
            selectChannels.value = selection.contacts_has_channels.channel_id;
            selectChannels.disabled = true;
            accountInput.value = selection.contacts_has_channels.account;
            accountInput.disabled = true;
            selectPreferences.value = selection.contacts_has_channels.preferences;
            selectPreferences.disabled = true;
            btnEditChannel.dataset.id = selection.id;
            btnDelChannel.dataset.id = selection.id;
        } else {
            selectChannels.value = selection.children[0].children[1].value;
            selectChannels.disabled = true;
            accountInput.value = selection.children[1].children[1].value;
            accountInput.disabled = true;
            selectPreferences.value = selection.children[2].children[1].value;
            selectPreferences.disabled = true;
        }
        return newDiv;
    }

    checkButtons() {

        let btnsEditChannel = [...document.getElementsByClassName('btn-edt-channel')];
        let btnsDelChannel = [...document.getElementsByClassName('btn-del-channel')];
    
        btnsEditChannel.forEach(button => {
            button.addEventListener('click', (event) => {
                event.target.parentElement.children[0].children[1].disabled = false;
                event.target.parentElement.children[1].children[1].disabled = false;
                event.target.parentElement.children[2].children[1].disabled = false;
            })
        })
        
        btnsDelChannel.forEach(button => {
            button.addEventListener('click', (event) => {
                event.target.parentElement.style.display = 'none';
            })
        })
    }

    addContact() {
        addContactBtn.addEventListener('click', () => {
            this.resetPopUp();
            
            popUpTitle.textContent = 'Nuevo Contacto';
            submitPopUp.textContent = 'Agregar contacto';
            popUpContactWindow.children[0].children[1].style.display = 'inline-grid';
            popUpContactWindow.children[0].children[2].style.display = 'inline-grid';
            popUpContactWindow.style.display = 'block';
            this.displayCompanies(companiesArr, '');
            this.displayRegions(allRegions, '');
            this.resetCountriesCities();
            this.regionChangesListener();
            this.loadSelectChannels();
            this.channelChangesListener();
            this.addChannelRow();
        });
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

    channelChangesListener() {
        selectChannelInput.addEventListener('change', () => {
            this.resetAccountPreferences();
            accountInput.disabled = false;
        });
        accountInput.addEventListener('keyup', () => {
            if (accountInput.value.length > 0) {
                selectPreferencesInput.disabled = false;
                btnAddChannel.disabled = false;
            } else {
                selectPreferencesInput.disabled = true;
                btnAddChannel.disabled = true;
            }
            
        });
    }

    addChannelRow() {
        btnAddChannel.addEventListener('click', (event) => {
            let previousSelection = event.target.parentElement;
            let newRow = this.createNewChannelRow(previousSelection);
            tertiaryInfoDiv.appendChild(newRow);
            selectChannelInput.value = '';
            this.resetAccountPreferences();
            this.checkButtons();
        })
    }

    editContact() {
        const editBtns = [...document.querySelectorAll(".edit-contact")];
        editBtns.forEach(button => {
            button.addEventListener('click', () => {
                this.resetPopUp();

                let contactEdt = contactsArr.find(contact => contact.id == button.dataset.id);
                contactEdt.channels.forEach(channel => {
                    let newRow = this.createNewChannelRow(channel);
                    tertiaryInfoDiv.appendChild(newRow);
                })
                this.checkButtons();
                this.loadSelectChannels();
                this.displayCompanies(companiesArr, contactEdt.company.id);

                this.displayRegions(allRegions, contactEdt.city.country.region.id);
                this.displayCountries(contactEdt.city.country.region.id, contactEdt.city.country.id);
                this.displayCities(contactEdt.city.country.id, contactEdt.city.id);

                this.regionChangesListener();
                this.channelChangesListener();
                this.addChannelRow();

                let optionValue = 0;
                switch (contactEdt.interest) {
                    case 0:
                        optionValue = 0;
                        break;
                    case 25:
                        optionValue = 1;
                        break;
                    case 50:
                        optionValue = 2;
                        break;
                    case 75:
                        optionValue = 3;
                        break;
                    case 100:
                        optionValue = 4;
                        break;
                }

                selectInterest.getElementsByTagName('option')[optionValue].selected = 'selected';

                document.getElementById('input-first-name').value = contactEdt.firstName;
                document.getElementById('input-last-name').value = contactEdt.lastName;
                document.getElementById('input-position').value = contactEdt.position;
                document.getElementById('input-email').value = contactEdt.email;
                document.getElementById('input-address').value = contactEdt.address;

                popUpTitle.textContent = 'Editando Contacto';
                submitPopUp.textContent = 'Editar contacto';
                submitPopUp.dataset.id = button.dataset.id;
                popUpContactWindow.children[0].children[1].style.display = 'inline-grid';
                popUpContactWindow.children[0].children[2].style.display = 'inline-grid';
                popUpContactWindow.style.display = 'block';
            })
        })
    }

    delContact() {
        const tableRows = [...document.querySelectorAll("tr")];
        tableRows.forEach(row => {
            row.addEventListener('click', (event) => {
                if (event.target.classList.contains('remove-contact')) {
                    let contactDel = contactsArr.find(contact => contact.id == event.target.dataset.id);
                    popUpTitle.textContent = `¿Seguro que quieres eliminar a ${contactDel.firstName} ${contactDel.lastName} de la base?`;
                    popUpContactWindow.children[0].children[1].style.display = 'none';
                    popUpContactWindow.children[0].children[2].style.display = 'none';
                    popUpContactWindow.children[0].children[3].style.display = 'none';
                    submitPopUp.dataset.id = event.target.dataset.id;
                    submitPopUp.textContent = 'Eliminar';
                    popUpContactWindow.style.display = 'block';
                }
            })
        })
    }
    
    async submitContact() {
        submitPopUp.addEventListener('click', async () => {

            /*info for fetch*/
            let url = ``;
            let fetchMethod = '';
            let fetchBody = '';

            /*info for body*/
            /*primary-data*/
            let firstName = submitPopUp.parentElement.parentElement.children[1].children[0].children[1].value;
            let lastName = submitPopUp.parentElement.parentElement.children[1].children[1].children[1].value;
            let position = submitPopUp.parentElement.parentElement.children[1].children[2].children[1].value;
            let email = submitPopUp.parentElement.parentElement.children[1].children[3].children[1].value;
            let companies_id = submitPopUp.parentElement.parentElement.children[1].children[4].children[1].value;

            /*secondary-data*/
            let region_id = submitPopUp.parentElement.parentElement.children[2].children[0].children[1].value;
            let countries_id = submitPopUp.parentElement.parentElement.children[2].children[1].children[1].value;
            let cities_id = submitPopUp.parentElement.parentElement.children[2].children[2].children[1].value;
            let address = submitPopUp.parentElement.parentElement.children[2].children[3].children[1].value;
            let interest = submitPopUp.parentElement.parentElement.children[2].children[4].children[1].value;

            /*tertiary-data*/
            let channels = [];
            let cantCanales = tertiaryInfoDiv.children.length;
            if (cantCanales > 1) {
                for (let i = 1; i < cantCanales; i++) {
                    let id = '';
                    let channel_id = tertiaryInfoDiv.children[i].children[0].children[1].value;
                    /* let contact_id = submitPopUp.dataset.id; */
                    let account = tertiaryInfoDiv.children[i].children[1].children[1].value;
                    let preferences = tertiaryInfoDiv.children[i].children[2].children[1].value;
                    let isActive = true;
                    if (tertiaryInfoDiv.children[i].children[3].dataset.id != undefined) {
                        id = tertiaryInfoDiv.children[i].children[3].dataset.id;
                        if (tertiaryInfoDiv.children[i].style.display == 'none') {
                            isActive = false;
                        }
                    } else {
                        id = null;
                    }
                    channels.push({ id, channel_id, account, preferences, isActive });
                }
            }
            
            if (submitPopUp.textContent.includes('Agregar')) {
                url = 'http://localhost:3000/contacts';
                fetchMethod = 'POST';
                fetchBody = JSON.stringify({ firstName, lastName, position, email, address, cities_id, companies_id, interest, channels });
            }  else if (submitPopUp.textContent.includes('Editar')) {
                let idParam = submitPopUp.dataset.id;
                url = `http://localhost:3000/contacts/${idParam}`;
                fetchMethod = 'PUT';
                fetchBody = JSON.stringify({ firstName, lastName, position, email, address, cities_id, companies_id,interest,channels});
            } else if (submitPopUp.textContent.includes('Eliminar')) {
                let idParam = submitPopUp.dataset.id;
                url = `http://localhost:3000/contacts/${idParam}`;
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

    async deleteContacts() {
        btnDelAllContacts.addEventListener('click', async () => {

            /*info for fetch*/
            let url = `http://localhost:3000/contacts`;
            let fetchMethod = 'DELETE';
            let fetchBody = JSON.stringify({ contactsDel });
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

    searchBarListener() {
        searchBar.addEventListener('keydown', (event)=> {
            if (event.key == 'Enter') {
                contactsToDisplay = [];
                let input = searchBar.value.toUpperCase();
                contactsArr.forEach(contact => {
                    Object.keys(contact).forEach(key => {
                        if (
                            key == 'firstName'
                            || key == 'lastName'
                            || key == 'position'
                            || key == 'email'
                            || key == 'address'
                            || key == 'interest'
                        ) {
                            let value = contact[key].toString().toUpperCase();
                            if (value.includes(input)) {
                                if (!contactsToDisplay.includes(contact)) {
                                    contactsToDisplay.push(contact);
                                }
                            }
                        } else if (key == 'city') {
                            let valueCity = contact.city.name.toString().toUpperCase();
                            let valueCountry = contact.city.country.name.toString().toUpperCase();
                            let valueRegion = contact.city.country.region.name.toString().toUpperCase();
                            if (valueCity.includes(input) || valueCountry.includes(input) || valueRegion.includes(input)) {
                                if (!contactsToDisplay.includes(contact)) {
                                    contactsToDisplay.push(contact);
                                }
                            }
                        } else if (key == 'company') {
                            let valueCompany = contact.company.name.toString().toUpperCase();
                            if (valueCompany.includes(input)) {
                                if (!contactsToDisplay.includes(contact)) {
                                    contactsToDisplay.push(contact);
                                }
                            }
                        } else if (key == 'channels') {
                            contact.channels.forEach(channel => {
                                let valueChannel = channel.name.toString().toUpperCase();
                                let valueAccount = channel.contacts_has_channels.account.toString().toUpperCase();
                                let valuePreferences = channel.contacts_has_channels.preferences.toString().toUpperCase();
                                if (valueChannel.includes(input) || valueAccount.includes(input) || valuePreferences.includes(input)) {
                                    if (!contactsToDisplay.includes(contact)) {
                                        contactsToDisplay.push(contact);
                                    }
                                }
                            })
                            
                        }
                        
                    })
                })
                this.displayContacts(contactsToDisplay);
                this.titlesOrder(contactsToDisplay);
                this.checkboxButtonsListener();
                this.editContact();
                this.delContact();
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
    popUpContactWindow.style.display = 'none';
    const ui = new UI();
    const contacts = new Contacts();
    const allRegionCities = new AllRegionsCities();
    const channels = new Channels();
    const companies = new Companies();
    ui.checkAdmin();
    contacts.getContacts().then(contacts => {
        channels.getChannels(); /*Cargo mis canales*/
        allRegionCities.getAllRegionsCities(); /*Cargo mis regiones y ciudades*/
        companies.getCompanies();
        ui.displayContacts(contacts);
        ui.searchBarListener();
        ui.checkboxButtonsListener();
    }).then(() => {
        ui.titlesOrder(contactsArr);
        ui.addContact();
        ui.editContact();
        ui.delContact();
        ui.cancelPopUp();
        ui.submitContact();
        ui.deleteContacts();
        
    })
})