let currentStep = 1;
let isSubmitting = false;

function goToStep(stepNumber) {
  currentStep = stepNumber;

  for (let i = 1; i <= 4; i++) {
    const stepEl = document.getElementById(`step-${i}`);

    if (stepEl) {
      if (i === stepNumber) {
        stepEl.classList.remove('hidden-step');
        stepEl.classList.add('active-step');
      } else {
        stepEl.classList.remove('active-step');
        stepEl.classList.add('hidden-step');
      }
    }
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function validateField(inputEl, errorEl, regex, errorMsg) {
  const value = inputEl.value.trim();
  if (!value) {
    errorEl.innerText = "Este campo es obligatorio.";
    errorEl.classList.remove('hidden');
    inputEl.classList.add('border-red-500');
    return false;
  } else if (!regex.test(value)) {
    errorEl.innerText = errorMsg;
    errorEl.classList.remove('hidden');
    inputEl.classList.add('border-red-500');
    return false;
  } else {
    errorEl.classList.add('hidden');
    inputEl.classList.remove('border-red-500');
    return true;
  }
}

function sendToGoogleForms(nombre, cedula, telefono, email) {
  const googleFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLScwbCtcG7Q2rmvRAaEMkimxKildQi3n_CQEYhyWDRbVoMAx_A/formResponse";
  
  // Registro único y exclusivo de los datos del formulario (Sección 3)
  const params = new URLSearchParams();
  params.append('entry.909119026', nombre);
  params.append('entry.1103888847', cedula);
  params.append('entry.1622098092', telefono);
  params.append('entry.1514035788', email);

  try {
    fetch(googleFormUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });
  } catch (e) {
    console.warn("Error en envío:", e);
  }
}

async function handleFormSubmit(e) {
  e.preventDefault();

  if (isSubmitting) {
    return;
  }

  const nombreInput = document.getElementById('nombre');
  const cedulaInput = document.getElementById('cedula');
  const telefonoInput = document.getElementById('telefono');
  const emailInput = document.getElementById('email');

  const errorNombre = document.getElementById('error-nombre');
  const errorCedula = document.getElementById('error-cedula');
  const errorTelefono = document.getElementById('error-telefono');
  const errorEmail = document.getElementById('error-email');

  // Auto-eliminar 0 inicial o +58
  let rawTelefono = telefonoInput.value.trim();
  if (rawTelefono.startsWith('+58')) {
    rawTelefono = rawTelefono.substring(3).trim();
  }
  if (rawTelefono.startsWith('0')) {
    rawTelefono = rawTelefono.substring(1).trim();
  }
  telefonoInput.value = rawTelefono;

  const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,60}$/;
  const regexCedula = /^\d{1,8}$/;
  const regexTelefono = /^(416|426|414|424|412|422)\d{7}$/;
  const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const isValidNombre = validateField(nombreInput, errorNombre, regexNombre, "Ingresa un nombre y apellido válido (solo letras).");
  const isValidCedula = validateField(cedulaInput, errorCedula, regexCedula, "Ingresa una cédula válida (solo números, máximo 8 dígitos).");
  const isValidTelefono = validateField(telefonoInput, errorTelefono, regexTelefono, "Ingresa un número celular de contacto válido con prefijo 416, 426, 414, 424, 412 o 422 (Ej. 4141234567).");
  const isValidEmail = validateField(emailInput, errorEmail, regexEmail, "Ingresa un correo electrónico válido (Ej. usuario@correo.com).");

  if (!isValidNombre || !isValidCedula || !isValidTelefono || !isValidEmail) {
    return;
  }

  isSubmitting = true;

  const nombre = nombreInput.value.trim();
  const cedula = cedulaInput.value.trim();
  const telefono = rawTelefono;
  const email = emailInput.value.trim();

  // Indicador de carga
  const submitBtn = document.getElementById('submit-btn');
  const btnText = document.getElementById('btn-text');
  const btnSpinner = document.getElementById('btn-spinner');

  if (btnText && btnSpinner) {
    btnText.innerText = "Enviando...";
    btnSpinner.classList.remove('hidden');
    submitBtn.disabled = true;
  }

  // Envío ÚNICO de los datos del formulario de la Sección 3
  sendToGoogleForms(nombre, cedula, telefono, email);

  // Poblar Resumen Paso 4 (exclusivamente para visualización del usuario, sin reenvío)
  document.getElementById('summary-name').innerText = nombre;
  document.getElementById('summary-cedula').innerText = cedula;
  document.getElementById('summary-telefono').innerText = telefono;
  document.getElementById('summary-email').innerText = email;

  // Limpiar campos del formulario para prevenir reenvíos duplicados
  const formEl = document.getElementById('hbo-form');
  if (formEl) {
    formEl.reset();
  }

  if (btnText && btnSpinner) {
    btnText.innerText = "Enviar";
    btnSpinner.classList.add('hidden');
    submitBtn.disabled = false;
  }

  isSubmitting = false;
  goToStep(4);
}
