let currentStep = 1;

function goToStep(stepNumber) {
  currentStep = stepNumber;

  for (let i = 1; i <= 4; i++) {
    const stepEl = document.getElementById(`step-${i}`);
    const navBtn = document.getElementById(`nav-btn-${i}`);

    if (stepEl) {
      if (i === stepNumber) {
        stepEl.classList.remove('hidden-step');
        stepEl.classList.add('active-step');
      } else {
        stepEl.classList.remove('active-step');
        stepEl.classList.add('hidden-step');
      }
    }

    if (navBtn) {
      if (i === stepNumber) {
        navBtn.className = "px-3 py-1 rounded-md transition font-medium text-white bg-pink-600 shadow";
      } else {
        navBtn.className = "px-3 py-1 rounded-md transition font-medium hover:text-white text-slate-400";
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

async function handleFormSubmit(e) {
  e.preventDefault();

  const nombreInput = document.getElementById('nombre');
  const cedulaInput = document.getElementById('cedula');
  const telefonoInput = document.getElementById('telefono');

  const errorNombre = document.getElementById('error-nombre');
  const errorCedula = document.getElementById('error-cedula');
  const errorTelefono = document.getElementById('error-telefono');

  // Auto-eliminar el 0 inicial o prefijo +58 si el usuario lo ingresa
  let rawTelefono = telefonoInput.value.trim();
  if (rawTelefono.startsWith('+58')) {
    rawTelefono = rawTelefono.substring(3).trim();
  }
  if (rawTelefono.startsWith('0')) {
    rawTelefono = rawTelefono.substring(1).trim();
  }
  telefonoInput.value = rawTelefono;

  // Cédula: Solo dígitos numéricos (máximo 8 números)
  const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,60}$/;
  const regexCedula = /^\d{1,8}$/;
  // Teléfono: Prefijos 416, 426, 414, 424, 412, 422 + 7 dígitos (10 dígitos en total)
  const regexTelefono = /^(416|426|414|424|412|422)\d{7}$/;

  const isValidNombre = validateField(nombreInput, errorNombre, regexNombre, "Ingresa un nombre y apellido válido (solo letras).");
  const isValidCedula = validateField(cedulaInput, errorCedula, regexCedula, "Ingresa una cédula válida (solo números, máximo 8 dígitos).");
  const isValidTelefono = validateField(telefonoInput, errorTelefono, regexTelefono, "Ingresa un número válido con prefijo 416, 426, 414, 424, 412 ó 422 (Ej. 4141234567).");

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

  // Enviar a Google Forms
  const googleFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLScwbCtcG7Q2rmvRAaEMkimxKildQi3n_CQEYhyWDRbVoMAx_A/formResponse";
  
  const formData = new URLSearchParams();
  formData.append('entry.909119026', nombre);
  formData.append('entry.1103888847', cedula);
  formData.append('entry.1622098092', telefono);

  try {
    await fetch(googleFormUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    });
  } catch (err) {
    console.warn("Envío a Google Form completado:", err);
  }

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
