let currentStep = '1';
let selectedPlan = 'abatvgo';
let isSubmitting = false;
let enviado = false;

const allSteps = ['step-1', 'step-2-1', 'step-2-2', 'step-3', 'step-4'];

function goToStep(stepId) {
  const targetId = typeof stepId === 'string' && stepId.startsWith('step-') ? stepId : `step-${stepId}`;
  currentStep = targetId;

  allSteps.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      if (id === targetId) {
        el.classList.remove('hidden-step');
        el.classList.add('active-step');
      } else {
        el.classList.remove('active-step');
        el.classList.add('hidden-step');
      }
    }
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goBack() {
  if (currentStep === 'step-2-1' || currentStep === 'step-2-2') {
    goToStep('1');
  } else if (currentStep === 'step-3') {
    if (selectedPlan === 'abatvgo') {
      goToStep('2-1');
    } else {
      goToStep('2-2');
    }
  } else if (currentStep === 'step-4') {
    goToStep('1');
  }
}

function selectPlan(plan) {
  selectedPlan = plan;

  const formTitle = document.getElementById('form-step-title');
  const formSubtitle = document.getElementById('form-step-subtitle');
  const disclaimerText = document.getElementById('disclaimer-text');
  const btnText = document.getElementById('btn-text');

  if (plan === 'abatvgo') {
    if (formTitle) formTitle.innerHTML = 'Aba TV GO<br><span class="text-[#00d2ff]">Plan Ultra (+120 canales)</span>';
    if (formSubtitle) formSubtitle.innerText = 'Ingresa tus datos para activar tu servicio sin costo adicional.';
    if (disclaimerText) disclaimerText.innerText = 'Al hacer clic en «Enviar datos» se activará tu servicio Aba TV GO sin costo adicional.';
    if (btnText) btnText.innerText = 'Activar Aba TV GO';
    goToStep('2-1');
  } else {
    if (formTitle) formTitle.innerHTML = 'Paquete Premium<br><span class="text-[#ff00a8]">One Baseball Network</span>';
    if (formSubtitle) formSubtitle.innerText = 'Ingresa tus datos para confirmar tu suscripción (Ref. 5 / mes).';
    if (disclaimerText) disclaimerText.innerText = 'Al hacer clic en «Enviar datos» se confirmará tu suscripción al Paquete Premium One Baseball Network.';
    if (btnText) btnText.innerText = 'Suscribirme';
    goToStep('2-2');
  }
}

function validateField(inputEl, errorEl, regex, errorMsg) {
  const value = inputEl.value.trim();
  if (!value) {
    errorEl.innerText = "Este campo es obligatorio.";
    errorEl.classList.remove('hidden');
    inputEl.classList.add('border-red-500');
    return false;
  } else if (regex && !regex.test(value)) {
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

function handleFormSubmit(e) {
  if (isSubmitting) {
    e.preventDefault();
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

  // Expresiones regulares especificadas
  const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,60}$/;
  const regexCedula = /^[0-9]{1,8}$/;
  const regexTelefono = /^0?4(12|14|16|24|22|26)[0-9]{7}$/;
  const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const isValidNombre = validateField(nombreInput, errorNombre, regexNombre, "Ingresa un nombre y apellido válido.");
  const isValidCedula = validateField(cedulaInput, errorCedula, regexCedula, "Ingresa una cédula válida (solo números, máximo 8 dígitos).");
  const isValidTelefono = validateField(telefonoInput, errorTelefono, regexTelefono, "Ingresa un número celular válido (formatos: 0412, 0414, 0416, 0424, 0422, 0426).");
  const isValidEmail = validateField(emailInput, errorEmail, regexEmail, "Ingresa un correo electrónico válido (Ej. usuario@correo.com).");

  if (!isValidNombre || !isValidCedula || !isValidTelefono || !isValidEmail) {
    e.preventDefault();
    return;
  }

  // Prevenir envíos múltiples
  isSubmitting = true;
  enviado = true;

  const nombre = nombreInput.value.trim();
  const cedula = cedulaInput.value.trim();
  const telefono = telefonoInput.value.trim();
  const email = emailInput.value.trim();

  // Actualizar resumen en Paso 4
  const summaryPlan = document.getElementById('summary-plan');
  const summaryCost = document.getElementById('summary-cost');
  const successMsg = document.getElementById('success-plan-message');

  if (selectedPlan === 'abatvgo') {
    if (summaryPlan) summaryPlan.innerText = 'Aba TV GO (Plan Ultra +120 canales)';
    if (summaryCost) summaryCost.innerText = 'Sin costo adicional';
    if (successMsg) successMsg.innerText = 'En las próximas 24 a 48 horas activaremos tu servicio para que comiences a disfrutar del mejor entretenimiento con Aba TV GO.';
  } else {
    if (summaryPlan) summaryPlan.innerText = 'Paquete Premium One Baseball Network';
    if (summaryCost) summaryCost.innerText = 'Ref. 5 / mes';
    if (successMsg) successMsg.innerText = 'En las próximas 24 a 48 horas activaremos tu suscripción al Paquete Premium One Baseball Network en tu factura Aba Ultra.';
  }

  document.getElementById('summary-name').innerText = nombre;
  document.getElementById('summary-cedula').innerText = cedula;
  document.getElementById('summary-telefono').innerText = telefono;
  document.getElementById('summary-email').innerText = email;

  // Estado visual de carga del botón
  const submitBtn = document.getElementById('submit-btn');
  const btnText = document.getElementById('btn-text');
  const btnSpinner = document.getElementById('btn-spinner');

  if (submitBtn) submitBtn.disabled = true;
  if (btnText) btnText.innerText = 'Enviando datos...';
  if (btnSpinner) btnSpinner.classList.remove('hidden');

  // Temporizador de respaldo por si el evento load del iframe es restringido por la política del navegador
  setTimeout(() => {
    if (enviado) {
      finalizarEnvio();
    }
  }, 2200);
}

function finalizarEnvio() {
  const form = document.getElementById('registro-form');
  const submitBtn = document.getElementById('submit-btn');
  const btnText = document.getElementById('btn-text');
  const btnSpinner = document.getElementById('btn-spinner');

  if (form) form.reset();
  if (submitBtn) submitBtn.disabled = false;
  if (btnText) btnText.innerText = selectedPlan === 'abatvgo' ? 'Activar Aba TV GO' : 'Suscribirme';
  if (btnSpinner) btnSpinner.classList.add('hidden');

  isSubmitting = false;
  enviado = false;
  goToStep('4');
}

// Inicialización de eventos al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  const iframe = document.getElementById('hidden_iframe');
  if (iframe) {
    iframe.addEventListener('load', () => {
      if (enviado) {
        finalizarEnvio();
      }
    });
  }

  // Validación y limpieza de errores en tiempo real al escribir
  ['nombre', 'cedula', 'telefono', 'email'].forEach(fieldId => {
    const input = document.getElementById(fieldId);
    const error = document.getElementById(`error-${fieldId}`);
    if (input && error) {
      input.addEventListener('input', () => {
        if (input.classList.contains('border-red-500')) {
          error.classList.add('hidden');
          input.classList.remove('border-red-500');
        }
      });
    }
  });
});
