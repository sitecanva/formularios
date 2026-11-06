# Landing Page: Aba TV GO - Paquete Premium One Baseball Network (Cantv)

Landing page interactiva para la activación de **Aba TV GO** y la suscripción al **Paquete Premium One Baseball Network** para usuarios con servicio **Aba Ultra** de CANTV.

---

## 📋 Flujo de la Aplicación

1. **Paso 1 - Oferta Principal:**
   - **Caja Neón 1:** Logotipo de Aba TV GO (+120 canales incluidos) y botón directo **«Activar Aba TV GO (sin costo)»**.
   - **Caja Neón 2:** Logotipo de One Baseball Network (La LVBP en vivo, Ref. 5 / mes), etiqueta llamativa *«Incluye Aba TV GO (+120 canales) sin costo adicional»* y botón directo **«Suscribirme a One Baseball (Ref 5 /mes)»**.
   - Pregunta destacada: *«¿Listo para vivir toda la pasión del béisbol?»*.

2. **Paso 2.1 - Términos y Condiciones (Aba TV GO sin costo):**
   - 1) El Plan Ultra de Aba TV GO (+120 canales) está incluido sin costo adicional para usuarios Aba Ultra.
   - 2) Notificación: Recibirás un SMS cuando el servicio esté activo. Si estás activando Aba TV GO por primera vez, tus credenciales de acceso llegarán a tu correo electrónico registrado.
   - Botón de acción: **Continuar**.

3. **Paso 2.2 - Términos y Condiciones (One Baseball Network):**
   - 1) Servicio base incluido.
   - 2) Paquete premium (Ref. 5 al mes).
   - 3) Facturación en factura de Aba Ultra.
   - 4) Notificación vía SMS / correo registrado.
   - Botón de acción: **Continuar**.

4. **Paso 3 - Formulario de Registro:**
   - Captura de datos del titular con validaciones en cliente en tiempo real.
   - Feedback visual interactivo (`:valid` en verde e `:invalid` en rojo al escribir).
   - Bloqueo del botón de envío con spinner mientras se procesa la solicitud.
   - Envío asíncrono en segundo plano mediante `<iframe>` oculto hacia Google Forms para prevenir redirecciones.

5. **Paso 4 - Confirmación de Solicitud:**
   - Mensaje de confirmación de recepción con tiempo estimado de activación (24 a 48 horas).
   - Resumen detallado con el plan seleccionado, titular, cédula, teléfono, correo y costo.
   - Reseteo automático del formulario y botón para volver al inicio.

---

## 🔍 Validaciones del Formulario

| Campo | Validación / Formato | Regla / Expresión Regular |
| :--- | :--- | :--- |
| **Nombre y apellido del titular** | Requerido, texto alfabético y espacios. | `/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,60}$/` |
| **Cédula de Identidad** | Numérico, de 1 a 8 dígitos. | `^[0-9]{1,8}$` |
| **Número celular de contacto** | Operadoras venezolanas con prefijos 0412, 0414, 0416, 0424, 0422, 0426 (10 u 11 dígitos). | `^0?4(12\|14\|16\|24\|22\|26)[0-9]{7}$` |
| **Correo electrónico** | Formato estándar de email. | `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$` |

---

## 🔗 Integración con Google Forms

El formulario redirige los datos a Google Forms utilizando el atributo `name` correspondiente a cada entrada:

| Campo del Formulario | ID de Entrada (Google Forms) | Validación / Formato |
| :--- | :--- | :--- |
| **Nombre y apellido del titular** | `entry.1896440067` | Requerido |
| **Cédula de Identidad** | `entry.1283632275` | Numérico, 1 a 8 dígitos |
| **Número celular de contacto** | `entry.619721954` | Prefijos: 0412, 0414, 0416, 0424, 0422, 0426 |
| **Correo electrónico** | `entry.555911472` | Email estándar (`example@domain.com`) |

---

## 🛠️ Tecnologías Utilizadas

- **HTML5:** Marcado semántico y componentes por sección.
- **Tailwind CSS:** Diseño responsivo y adaptable a móviles y escritorio.
- **CSS3 Personalizado (`styles.css`):** Paleta oscura (#08091a), efectos neón (#ff00a8 y #00d2ff), transiciones de pasos y pseudo-clases dinámicas `:valid`/`:invalid`.
- **JavaScript Vanilla (`script.js`):** Enrutamiento por pasos, control de planes seleccionados, validación de regex, feedback interactivo y sincronización de envío en segundo plano.
