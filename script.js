let currentStep = 1;

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

function sendToGoogleForms(nombre, cedula, telefono) {
  const googleFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLScwbCtcG7Q2rmvRAaEMkimxKildQi3n_CQEYhyWDRbVoMAx_A/formResponse";
  
  // 1. Envío vía fetch no-cors
  const params = new URLSearchParams();
  params.append('entry.909119026', nombre);
  params.append('entry.1103888847', cedula);
  params.append('entry.1622098092', telefono);

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
    console.warn("Intento de envío fetch:", e);
  }

  // 2. Envío respaldo vía iframe oculto para garantizar registro en Google Sheets
  try {
    let hiddenIframe = document.getElementById('hidden-gform-iframe');
    if (!hiddenIframe) {
      hiddenIframe = document.createElement('iframe');
      hiddenIframe.id = 'hidden-gform-iframe';
      hiddenIframe.name = 'hidden-gform-iframe';
      hiddenIframe.style.display = 'none';
      document.body.appendChild(hiddenIframe);
    }

    const tempForm = document.createElement('form');
    tempForm.action = googleFormUrl;
    tempForm.method = 'POST';
    tempForm.target = 'hidden-gform-iframe';

    const inputNombre = document.createElement('input');
    inputNombre.type = 'hidden';
    inputNombre.name = 'entry.909119026';
    inputNombre.value = nombre;
    tempForm.appendChild(inputNombre);

    const inputCedula = document.createElement('input');
    inputCedula.type = 'hidden';
    inputCedula.name = 'entry.1103888847';
    inputCedula.value = cedula;
    tempForm.appendChild(inputCedula);

    const inputTelefono = document.createElement('input');
    inputTelefono.type = 'hidden';
    inputTelefono.name = 'entry.1622098092';
    inputTelefono.value = telefono;
    tempForm.appendChild(inputTelefono);

    document.body.appendChild(tempForm);
    tempForm.submit();
    setTimeout(() => {
      if (document.body.contains(tempForm)) {
        document.body.removeChild(tempForm);
      }
    }, 1000);
  } catch (err) {
    console.warn("Envío iframe respaldo:", err);
  }
}

async function handleFormSubmit(e) {
  e.preventDefault();

  const nombreInput = document.getElementById('nombre');
  const cedulaInput = document.getElementById('cedula');
  const telefonoInput = document.getElementById('telefono');

  const errorNombre = document.getElementById('error-nombre');
  const errorCedula = document.getElementById('error-cedula');
  const errorTelefono = document.getElementById('error-telefono');

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

  const isValidNombre = validateField(nombreInput, errorNombre, regexNombre, "Ingresa un nombre y apellido válido (solo letras).");
  const isValidCedula = validateField(cedulaInput, errorCedula, regexCedula, "Ingresa una cédula válida (solo números, máximo 8 dígitos).");
  const isValidTelefono = validateField(telefonoInput, errorTelefono, regexTelefono, "Ingresa un número válido con prefijo 416, 426, 414, 424, 412 o 422 (Ej. 4141234567).");

  if (!isValidNombre || !isValidCedula || !isValidTelefono) {
    return;
  }

  const nombre = nombreInput.value.trim();
  const cedula = cedulaInput.value.trim();
  const telefono = rawTelefono;

  // Indicador de carga
  const submitBtn = document.getElementById('submit-btn');
  const btnText = document.getElementById('btn-text');
  const btnSpinner = document.getElementById('btn-spinner');

  if (btnText && btnSpinner) {
    btnText.innerText = "Enviando...";
    btnSpinner.classList.remove('hidden');
    submitBtn.disabled = true;
  }

  // Garantizar el registro en Google Forms / Google Sheets
  sendToGoogleForms(nombre, cedula, telefono);

  // Poblar Resumen Paso 4
  document.getElementById('summary-name').innerText = nombre;
  document.getElementById('summary-cedula').innerText = cedula;

  if (btnText && btnSpinner) {
    btnText.innerText = "Enviar";
    btnSpinner.classList.add('hidden');
    submitBtn.disabled = false;
  }

  goToStep(4);
}
