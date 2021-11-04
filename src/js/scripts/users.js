const token = localStorage.getItem('token');
const headers = new Headers();
headers.append('Accept','application/json');
headers.append('Content-Type','application/json');
headers.append('Authorization', `Bearer ${token}`);
headers.append('Access-Control-Allow-Origin', '*');


const tableBody = document.getElementById('tableData');
const popUpUserWindow = document.getElementById('pop-up-user');
const addUserBtn = document.getElementById('add-user');
const popUpTitle = document.getElementById('pop-up-title');
const submitPopUp = document.getElementById('submit-pop-up');
const cancelPopUp = document.getElementById('cancel-pop-up');

const inputFirstName = document.getElementById('input-first-name');
const inputLastName = document.getElementById('input-last-name');
const inputEmail = document.getElementById('input-email');
const inputProfile = document.getElementById('input-profile');
const inputUsername = document.getElementById('input-username');
const inputPassword = document.getElementById('input-password');
const inputConfPassword = document.getElementById('input-confirm-password');

let usersArr = [];

class Users {
    async getUsers() {
        try {

            /* let result = await fetch('users.json');  */
            let result = await fetch('http://localhost:3000/users', {
                headers,
            });
            let data = await result.json();
            let users = data.map(user => user);
            usersArr = users;
            return users;
        } catch (err) {
            console.error(err);
        }
    }
}

class UI {
    displayUsers(users) {
        let dataHtml = '';
        for (let user of users) {
            let profile = '';
            if (user.isAdmin) {
                profile = 'Administrador';
            } else {
                profile = 'Básico'
            }
            dataHtml += `
            <tr>
                <td><span>${user.first_name}</span></td>
                <td><span>${user.last_name}</span></td>
                <td><span>${user.email}</span></td>
                <td><span>${profile}<span></td>
                <td>
                    <div class='tableDiv'>
                        <span>${user.username}</span>
                    </div>
                </td>
                <td>
                    <div>
                        <span data-id=${user.id} class='edit-user'><i class="fas fa-edit"></i></span>
                        <span data-id=${user.id} class='remove-user'><i class="fas fa-trash remove-user" data-id=${user.id}></i></span>
                    </div>
                </td>
            </tr>
            `;
        }
        tableBody.innerHTML = dataHtml;
    }

    passwordConfirm(){
        inputConfPassword.addEventListener('keyup', () =>{
            this.check();
        });
    }

    check() {
        if (inputPassword.value == inputConfPassword.value) {
            document.getElementById('message').style.color = 'green';
            document.getElementById('message').innerHTML = 'contraseñas coinciden';
        } else {
            document.getElementById('message').style.color = 'red';
            document.getElementById('message').innerHTML = 'contraseñas no coinciden';
        }
    }

    resetPopUp() {
        
        inputFirstName.value = '';
        inputLastName.value = '';
        inputEmail.value = '';
        inputProfile.value = 0;
        inputUsername.value = '';
        inputPassword.value = '';
        inputConfPassword.value = '';
        popUpUserWindow.style.display = 'none';
    }

    addUser() {
        addUserBtn.addEventListener('click', () => {
            this.resetPopUp();
            popUpTitle.textContent = 'Crear nuevo usuario';
            submitPopUp.textContent = 'Agregar';
            popUpUserWindow.children[0].children[1].style.display = 'inline-grid';
            popUpUserWindow.children[0].children[2].style.display = 'inline-grid';
            popUpUserWindow.style.display = 'block';
            this.passwordConfirm();
        });
    }

    editUser() {
        const editBtns = [...document.querySelectorAll(".edit-user")];
        editBtns.forEach(button => {
            button.addEventListener('click', () => {
                let userEdt = usersArr.find(user => user.id == button.dataset.id);
                let profile = 0;
                if (userEdt.isAdmin) {
                    profile = 1;
                }

                this.resetPopUp();

                inputFirstName.value = userEdt.first_name;
                inputLastName.value = userEdt.last_name;
                inputEmail.value = userEdt.email;
                inputProfile.value = profile;
                inputUsername.value = userEdt.username;
                inputPassword.value = userEdt.inputPassword;
                inputConfPassword.value = userEdt.inputPassword;
                popUpTitle.textContent = 'Usuario a editar';
                submitPopUp.textContent = 'Editar';
                popUpUserWindow.children[0].children[1].style.display = 'inline-grid';
                popUpUserWindow.children[0].children[2].style.display = 'inline-grid';
                submitPopUp.dataset.id = button.dataset.id;
                popUpUserWindow.style.display = 'block';
                this.passwordConfirm();
            })
        })
    }

    delUser() {
        const tableRows = [...document.querySelectorAll("tr")];
        tableRows.forEach(row => {
            row.addEventListener('click', (event) => {
                if (event.target.classList.contains('remove-user')) {
                    let userDel = usersArr.find(user => user.id == event.target.dataset.id);
                    popUpTitle.textContent = `¿Seguro que quieres eliminar al usuario ${userDel.first_name} ${userDel.last_name}?`;
                    popUpUserWindow.children[0].children[1].style.display = 'none';
                    popUpUserWindow.children[0].children[2].style.display = 'none';
                    submitPopUp.dataset.id = event.target.dataset.id;
                    submitPopUp.textContent = 'Eliminar';
                    popUpUserWindow.style.display = 'block';
                    this.passwordConfirm();
                }
            })
        })
    }

    cancelPopUp() {
        cancelPopUp.addEventListener('click', () =>{
            this.resetPopUp();
        })
        
    }

    async submitUser() {
        submitPopUp.addEventListener('click', async () => {

            /*info for fetch*/
            let url = ``;
            let fetchMethod = '';
            let fetchBody = '';

            /*info for body*/
            

            let first_name = submitPopUp.parentElement.parentElement.children[1].children[0].children[1].value;
            let last_name = submitPopUp.parentElement.parentElement.children[1].children[1].children[1].value;
            let email = submitPopUp.parentElement.parentElement.children[1].children[2].children[1].value;
            let isAdmin = false;
            if (submitPopUp.parentElement.parentElement.children[2].children[0].children[1].value == 1) {
                isAdmin = true;
            }
            let username = submitPopUp.parentElement.parentElement.children[2].children[1].children[1].value;
            let password = submitPopUp.parentElement.parentElement.children[2].children[2].children[1].value;
            let confirm_password = submitPopUp.parentElement.parentElement.children[2].children[3].children[1].value;


            if (submitPopUp.textContent == 'Agregar') {
                url = 'http://localhost:3000/users';
                fetchMethod = 'POST';
                fetchBody = JSON.stringify({ first_name, last_name, email, isAdmin, password, username });
            } else if (submitPopUp.textContent == 'Editar') {
                let idParam = submitPopUp.dataset.id;
                url = `http://localhost:3000/users/${idParam}`;
                fetchMethod = 'PUT';
                fetchBody = JSON.stringify({ first_name, last_name, email, isAdmin, password, username });
            } else if (submitPopUp.textContent == 'Eliminar') {
                let idParam = submitPopUp.dataset.id;
                url = `http://localhost:3000/users/${idParam}`;
                fetchMethod = 'DELETE';
            }

            try {
                const responseLogin = await fetch(url, {
                    method: fetchMethod,
                    body: fetchBody,
                    headers
                });
            
                const responseObject = await responseLogin.json();
                console.log(responseObject);
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
}


document.addEventListener("DOMContentLoaded", () => {
    popUpUserWindow.style.display = 'none';
    const ui = new UI();
    const users = new Users();
    users.getUsers().then(users => {
        ui.displayUsers(users);
    }).then(() => {
        ui.addUser();
        ui.cancelPopUp();
        ui.editUser();
        ui.delUser();
        ui.submitUser();
    })
})