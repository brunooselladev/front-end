import { AbstractControl, ValidatorFn } from '@angular/forms';

/**
 * Validadores personalizados centralizados para todos los formularios de registro
 */

/**
 * Validador para que las contraseñas coincidan
 * @param passKey nombre del campo de contraseña
 * @param repKey nombre del campo de repetir contraseña
 */
export function passwordsMatch(passKey: string, repKey: string): ValidatorFn {
  return (group: AbstractControl) => {
    const pass = group.get(passKey)?.value ?? '';
    const rep = group.get(repKey)?.value ?? '';
    return pass && rep && pass !== rep ? { passwordsMismatch: true } : null;
  };
}

/**
 * Validador de email con dominio específico
 * @param domain dominio requerido (ej: 'gmail.com')
 */
export function emailDomain(domain: string): ValidatorFn {
  return (control: AbstractControl) => {
    if (!control.value) return null;
    const email = control.value.toLowerCase();
    return !email.endsWith(`@${domain}`) ? { emailDomain: { requiredDomain: domain } } : null;
  };
}

/**
 * Validador para plataformas de correo electrónico comunes
 * Acepta Gmail, Outlook, Yahoo, iCloud, ProtonMail, Yandex, Zoho, AOL y otros dominios populares
 */
export function commonEmailValidator(control: AbstractControl) {
  if (!control.value) return null;
  const email = control.value.toLowerCase();

  // Lista de dominios de correo electrónico comunes aceptados
  const acceptedDomains = [
    'gmail.com',
    'outlook.com',
    'hotmail.com',
    'live.com',
    'yahoo.com',
    'yahoo.es',
    'yahoo.com.ar',
    'yahoo.com.mx',
    'icloud.com',
    'me.com',
    'mac.com',
    'protonmail.com',
    'proton.me',
    'yandex.com',
    'yandex.ru',
    'zoho.com',
    'aol.com',
    'mail.com'
  ];

  // Verificar si el email termina con alguno de los dominios aceptados
  const isValidDomain = acceptedDomains.some(domain => email.endsWith(`@${domain}`));

  if (!isValidDomain) {
    return { unsupportedEmailDomain: true };
  }

  return null;
}

/**
 * Validador para teléfonos argentinos
 * Acepta formatos: +5493513456789, 5493513456789, 03513456789, 3513456789
 */
export function telefonoArgentinoValidator(control: AbstractControl) {
  if (!control.value) return null;
  
  // Formato argentino: puede empezar con +54, 54, 0 o directamente el código de área
  const telefono = control.value.toString().replace(/\s+/g, ''); // Remover espacios
  
  // Patrones válidos para Argentina
  const patronesValidos = [
    /^\+54\d{10}$/, // +54 + 10 dígitos
    /^54\d{10}$/, // 54 + 10 dígitos
    /^0\d{10,11}$/, // 0 + 10-11 dígitos
    /^\d{10}$/ // 10 dígitos directos
  ];

  const esValido = patronesValidos.some(patron => patron.test(telefono));
  
  if (!esValido) {
    return { telefonoArgentino: true };
  }
  
  return null;
}

/**
 * Validador de contraseña fuerte
 * Requiere al menos una mayúscula, una minúscula y un número
 */
export function passwordValidator(control: AbstractControl) {
  if (!control.value) return null;
  const password = control.value;
  const errors: any = {};

  // Entre 8 y 16 caracteres
  if (password.length < 8 || password.length > 16) {
    errors.longitud = true;
  }

  // Al menos una mayúscula
  if (!/[A-Z]/.test(password)) {
    errors.mayuscula = true;
  }

  // Al menos una minúscula
  if (!/[a-z]/.test(password)) {
    errors.minuscula = true;
  }

  // Al menos un carácter especial (no letra ni número)
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.caracterEspecial = true;
  }

  return Object.keys(errors).length > 0 ? errors : null;
}

/**
 * Validador para que las contraseñas coincidan (versión alternativa)
 */
export function passwordMatchValidator(group: AbstractControl) {
  const password = group.get('password')?.value;
  const repeatPassword = group.get('repeatPassword')?.value;
  
  if (password && repeatPassword && password !== repeatPassword) {
    return { passwordsMismatch: true };
  }
  
  return null;
}

/**
 * Validador de fecha de nacimiento
 * Requiere mayor de edad (18 años) y fecha válida
 */
export function fechaNacimientoValidator(control: AbstractControl) {
  if (!control.value) return null;
  
  const fechaNacimiento = new Date(control.value);
  const hoy = new Date();
  const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
  
  // Debe ser mayor de edad (18 años) y menor de 120 años
  if (edad < 18) {
    return { menorDeEdad: true };
  }
  
  if (edad > 120) {
    return { fechaInvalida: true };
  }
  
  // No puede ser fecha futura
  if (fechaNacimiento > hoy) {
    return { fechaFutura: true };
  }
  
  return null;
}

/**
 * Validador para solo números
 */
export function soloNumerosValidator(control: AbstractControl) {
  if (!control.value) return null;
  return /^\d+$/.test(control.value) ? null : { soloNumeros: true };
}

/**
 * Validador de patrón de contraseña con regex
 * Al menos una mayúscula, una minúscula y un número
 */
export const passwordPatternValidator = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

/**
 * Validador de DNI argentino
 * Solo números, entre 7 y 8 dígitos
 */
export function dniArgentinoValidator(control: AbstractControl) {
  if (!control.value) return null;
  
  const dni = control.value.toString();
  
  // Solo números y entre 7-8 dígitos
  if (!/^\d{7,8}$/.test(dni)) {
    return { dniInvalido: true };
  }
  
  return null;
}

/**
 * Validador personalizado para campos requeridos que considera 'null' como inválido
 * Útil para selects que usan 'null' como placeholder
 */
export function requiredWithNullValidator(control: AbstractControl) {
  const value = control.value;
  if (value === null || value === 'null' || value === '') {
    return { required: true };
  }
  return null;
}