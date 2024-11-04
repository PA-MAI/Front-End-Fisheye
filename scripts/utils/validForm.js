/** 
* Validation Functions
* @param {HTMLElement} input 
* @param {string} first
* @param {string} last
* @param {string} email
* @param {string} message
*/
/**
* Form Validation*
*/

function validFirst(first) {
  const firstRegExp = new RegExp("[a-zA-Z\-\.]+");
  if (first.value === "") {
     throw new Error("Le champ prénom est vide.");
  } else if (!firstRegExp.test(first.value)) {
     throw new Error("Caractères invalides.");
  } else if (first.value.length < 2) {
     throw new Error("Le prénom est trop court.");
  }
}

function validLast(last) {
  const lastRegExp = new RegExp("[a-zA-Z\-\.]+");
  if (last.value === "") {
     throw new Error("Le champ nom est vide.");
  } else if (!lastRegExp.test(last.value)) {
     throw new Error("Caractères invalides.");
  } else if (last.value.length < 2) {
     throw new Error("Le nom est trop court.");
  }
}
function validEmail(email) {
  const emailRegExp = new RegExp("[a-z0-9._-]+@[a-z0-9._-]+\\.[a-z0-9._-]+");
  if (email.value === "") {
     throw new Error("Le champ email est vide.");
  } else if (!emailRegExp.test(email.value)) {
     throw new Error("L'email n'est pas valide.");
  }
}

function validMessage(email) {
  const messageRegExp = new RegExp("[a-zA-Z]+");
  if (message.value === "") {
     throw new Error("Le champ message est vide.");
  } 
}

//Validate event `blur` for first,last,email, and message
function validForm(event) {
  const input = event.target;
  try {
     if (input.name === "first") {
        validFirst(input);
     } else if (input.name === "last") {
        validLast(input);
     } else if (input.name === "email") {
        validEmail(input);
 } else if (input.name === "message") {
        validMessage(input);
     }

 deleteError(input);
     console.log(`${input.name} champs validé avec succès.`);

  } catch (error) {
     displayError(input, error.message);
     console.log(`Erreur détectée pour ${input.name} : ${error.message}`);
  }
}

// set global var 

let form; 

// Fonction init form
function setForm(f) {
  form = f;
}
//Validate full form 
function runForm(event) {
  if (!form) {
     console.error("Form n'est pas défini.");
     return;
  }
 event.preventDefault();

// Reset form validity for each submit 
  let isValid = true;

  // reset errors messages before validation
  form.querySelectorAll(".errorMessage").forEach(error => error.remove());
  form.querySelectorAll(".errorStyle").forEach(input => input.classList.remove("errorStyle"));
 try {
     validFirst(form.first);
     deleteError(form.first);
  } catch (error) {
     displayError(form.first, error.message);
     console.log(`Erreur champ prénom : ${error.message}`);
     isValid = false;
  }

  try {
     validLast(form.last);
     deleteError(form.last);
  } catch (error) {
     displayError(form.last, error.message);
     console.log(`Erreur champ nom : ${error.message}`);
     isValid = false;
  }

  try {
     validEmail(form.email);
     deleteError(form.email);
  } catch (error) {
     displayError(form.email, error.message);
     console.log(`Erreur champ Email : ${error.message}`);
     isValid = false;
  }

  try {
     validMessage(form.quantity);
     deleteError(form.quantity);
  } catch (error) {
     displayError(form.quantity, error.message);
     isValid = false;
  }

 // Save data form field regardless of the validation result
   keepFormData(form);

 // if form is valid, display popup result
  if (isValid) {
     showResult(); // display modal result
     closeFormModal(); // close modal form if form valid
     console.log("Formulaire validé avec succès !");
  } else {
     console.log("Formulaire invalide, veuillez corriger les erreurs.");
  }
}
