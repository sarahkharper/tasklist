export function addValidation(formElem, inputElem){
    formElem.addEventListener("submit", (event) => {
        if(!inputElem.validity.valid) {
            //display error message
            showError(inputElem);
            //prevent form submission
            event.preventDefault();
        } else {
            submitForm
        }
    });
}

function showError(inputElem) {
    const errorElem = inputElem.nextElementSibling;
    //add error message text depending on error type
    if (inputElem.validity.valueMissing) {
        errorElem.textContent = "Task Name can't be empty"
    } else if (inputElem.validity.tooLong){
        errorElem.textContent = "Notes must be under 300 characters"
    }

    //Add the 'active' class to the error message
    errorElem.className = "error active";
}