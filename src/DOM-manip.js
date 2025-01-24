
//event listener to toggle 'show' class for form expand buttons

export function toggleShow(elem, type, event){
    if (type === "open"){
        var formContainer = elem.nextElementSibling;
    } else if (type === "close"){
        var formContainer = elem.closest(".form-box");
    }
    const formRef = formContainer.querySelector("form");

    elem.addEventListener(event, () => {
        formContainer.classList.toggle("show");
        formRef.reset();
    })
}

//add projects to sidebar once created
//function makeNewElem(item, )