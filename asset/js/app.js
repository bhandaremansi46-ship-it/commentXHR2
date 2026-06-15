const c1=console.log
const commentform = document.getElementById('commentform')
const addcomment = document.getElementById('addcomment')
const updatecomment = document.getElementById('updatecomment')
const spinner = document.getElementById('spinner')
const namecontrol = document.getElementById('name')
const emailcontrol = document.getElementById('email')
const bodycontrol = document.getElementById('body')
const userIdcontrol = document.getElementById('userId')
const cardcontainer = document.getElementById('cardcontainer')

let base_url = 'https://jsonplaceholder.typicode.com'

let commentArr=[]

function snackbar(msg,icon){
    Swal.fire({
        title :msg,
        icon:icon,
        timer : 3000
    })
}

function fetchcom(){
    let post_url = `${base_url}/comments`

    let xhr = new XMLHttpRequest()

    xhr.open('GET',post_url)

    xhr.send(null)

    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status <= 299){
            commentArr = JSON.parse(xhr.response)

            createcard(commentArr.reverse())
        }
    }
}
fetchcom()

function createcard(arr){
    spinner.classList.remove('d-none')

    let result =''
    arr.forEach(ele =>{
        result += `
        <div class="col-md-4 my-4" id="${ele.id}">
            <div class="card h-100">
                <div class="card-header">
                    <h3>${ele.email}</h3>
                </div>

                <div class="card-body">
                    <h3>${ele.name}</h3>
                    <p>${ele.body}</p>
                </div>

                <div class="card-footer d-flex justify-content-between">
                    <button class="btn btn-danger btn-sm" onclick="OnEdit(this)">Edit</button>
                    <button class="btn btn-primary btn-sm" onclick="OnRemove(this)">Delete</button>
                </div>
            </div>
        </div>
        `
    });
    cardcontainer.innerHTML= result;
    spinner.classList.add('d-none')
}

function onsubmit(ele){
    ele.preventDefault()

     let NEW_OBJ = {
        userId:userIdcontrol.value,
        name:namecontrol.value,
        email:emailcontrol.value,
        body:bodycontrol.value
    }

    let post_url =`${base_url}/comments`

    let xhr = new XMLHttpRequest()

    xhr.open('POST',post_url)

    xhr.send(JSON.stringify(NEW_OBJ))

   xhr.onload = function(){
    if(xhr.status >= 200 && xhr.status <= 299){
        let res = JSON.parse(xhr.response)

            createNewCards(NEW_OBJ,res)
    }
   }
}

function createNewCards(NEW_OBJ,res){
    NEW_OBJ.id = res.id;
    commentArr.unshift(NEW_OBJ);

    let div = document.createElement('div')
    div.classList = 'col-md-4 my-4';
    div.id = res.id;

    div.innerHTML = `
    <div class="card h-100">
        <div class="card-header">
            <h3>${NEW_OBJ.email}</h3>
        </div>
        <div class="card-body">
            <h3>${NEW_OBJ.name}</h3>
            <p>${NEW_OBJ.body}</p>
        </div>
        <div class="card-footer d-flex justify-content-between">
            <button class="btn btn-danger btn-sm" onclick="OnEdit(this)">Edit</button>
            <button class="btn btn-primary btn-sm" onclick="OnRemove(this)">Delete</button>
        </div>
    </div>
    `

    cardcontainer.prepend(div)
    commentform.reset()
    snackbar(`The New Comment ID ${res.id} is Added Successfully!!`, 'success');

}

function OnEdit(ele){
    let EDIT_ID = ele.closest('.col-md-4').id

    localStorage.setItem('EDIT_ID',EDIT_ID);

    let EDIT_OBJ = commentArr.find(ele => String(ele.id)=== String(EDIT_ID))
 if(EDIT_OBJ){

        namecontrol.value = EDIT_OBJ.name;
        emailcontrol.value = EDIT_OBJ.email;
        bodycontrol.value = EDIT_OBJ.body;
        userIdcontrol.value = EDIT_OBJ.userId || 1;

        addcomment.classList.add('d-none');
        updatecomment.classList.remove('d-none');
    }
}

function onupdate(){
     spinner.classList.remove('d-none');

    let UPDATE_ID = localStorage.getItem('EDIT_ID');

    let UPDATE_OBJ = {
        userId: userIdcontrol.value,
        name: namecontrol.value,
        email: emailcontrol.value,
        body: bodycontrol.value,
        id: UPDATE_ID
    };

   if(Number(UPDATE_ID)>500){
    let index = commentArr.findIndex(ele => String(ele.id) === String(UPDATE_ID))
      
    if(index !== -1){
        commentArr[index] =UPDATE_OBJ;
    }
    let div = document.getElementById(UPDATE_ID);

    div.querySelector('.card-header h3').innerText = UPDATE_OBJ.email;

    div.querySelector('.card-body h3').innerText = UPDATE_OBJ.name;

        div.querySelector('.card-body p').innerText = UPDATE_OBJ.body;


        commentform.reset();

        addcomment.classList.remove('d-none');
        updatecomment.classList.add('d-none');

        spinner.classList.add('d-none');

        snackbar(
            `Comment ID ${UPDATE_ID} updated successfully`,
            'success'
        );

        return;
   }
    let put_url = `${base_url}/comments/${UPDATE_ID}`;

    let xhr = new XMLHttpRequest();

    xhr.open('PUT', put_url);

    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send(JSON.stringify(UPDATE_OBJ));

    xhr.onload = function(){

        if(xhr.status >= 200 && xhr.status <= 299){

            let index = commentArr.findIndex(
                ele => String(ele.id) === String(UPDATE_ID)
            );

            if(index !== -1){
                commentArr[index] = UPDATE_OBJ;
            }

            let div = document.getElementById(UPDATE_ID);

            div.querySelector('.card-header h3').innerText =
                UPDATE_OBJ.email;

            div.querySelector('.card-body h3').innerText =
                UPDATE_OBJ.name;

            div.querySelector('.card-body p').innerText =
                UPDATE_OBJ.body;

            commentform.reset();

            addcomment.classList.remove('d-none');
            updatecomment.classList.add('d-none');
        
            snackbar(
                `Comment ID ${UPDATE_ID} updated successfully`,
                'success'
            );
           

        }else{

            snackbar('Something went wrong', 'error');
            
                  }
  spinner.classList.add('d-none'); 
        
    };
   
     
}
function OnRemove(ele) {

    let REMOVE_ID = ele.closest('.col-md-4').id;

    Swal.fire({
        title: `Are you sure you want to delete comment ${REMOVE_ID}?`,
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {

        if (result.isConfirmed) {

            spinner.classList.remove('d-none');

            let delete_url = `${base_url}/comments/${REMOVE_ID}`;

            let xhr = new XMLHttpRequest();

            xhr.open('DELETE', delete_url);

            xhr.send(null);

            xhr.onload = function () {

                if (xhr.status >= 200 && xhr.status <= 299) {

                    ele.closest('.col-md-4').remove();

                    snackbar(
                        `Comment ID ${REMOVE_ID} removed successfully`,
                        'success'
                    );

                } else {
                    snackbar('Something went wrong', 'error');
                }

                spinner.classList.add('d-none');
            };
        }
    });
}
commentform.addEventListener('submit',onsubmit)
updatecomment.addEventListener('click',onupdate)