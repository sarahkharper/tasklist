import { submitForm } from "./todo";

export function addSubmitValidation(formElem, inputElem){
    formElem.addEventListener("submit", (event) => {
        if(!inputElem.validity.valid) {
            //display error message
            showError(inputElem);
            //prevent form submission
            event.preventDefault();
        } 
    });
}

export function addTypingValidation(formElem, inputElem){
    formElem.addEventListener("input", () => {
        if(inputElem.validity.valid){
            const errorElem = inputElem.nextElementSibling;
            errorElem.textContent = "";
            errorElem.classList.remove('active');
        }
        if(!inputElem.validity.valid) {
            showError(inputElem);
        }
    })
}

function showError(inputElem) {
    const errorElem = inputElem.nextElementSibling;
    //add error message text depending on error type
    if (inputElem.validity.valueMissing) {
        errorElem.textContent = "Task Name can't be empty"
    } else if (inputElem.validity.tooShort){
        errorElem.textContent = "Notes must be at least 5 characters long"
    }

    //Add the 'active' class to the error message
    errorElem.className = "error active";
}