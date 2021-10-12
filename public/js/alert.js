const hideAlert =(class_name)=>{
    const alert = document.querySelector('.alert');
    alert.style.display ='none';
}


export const showAlert = (type, msg) => {
       
    const class_name  = (type == 'error') ? 'alert-danger' : 'alert-success';
   
    const alert = document.querySelector('.alert');
    alert.classList.add(class_name);
    alert.innerHTML = msg;
    alert.style.display = 'block';
    setTimeout(() => {
        hideAlert(class_name);
    }, 5000);
}