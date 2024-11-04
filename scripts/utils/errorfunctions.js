
/**
 * Error Handling Functions
 * @param {HTMLElement} input 
 * @param {string} message 
 */

//Display errors messages
function displayError(input, message) {
    let spanErrorMessage = input.parentElement.querySelector(".errorMessage");
  
    if (!spanErrorMessage) {
      spanErrorMessage = document.createElement("span");
      spanErrorMessage.className = "errorMessage";
      input.parentElement.appendChild(spanErrorMessage);
    }
    spanErrorMessage.innerText = message;
    input.classList.add("errorStyle");
  }
  
  //Delete errors messages
function deleteError(input) {
    let spanErrorMessage = input.parentElement.querySelector(".errorMessage");
    if (spanErrorMessage) {
      spanErrorMessage.remove();
    }
    input.classList.remove("errorStyle");
  }
