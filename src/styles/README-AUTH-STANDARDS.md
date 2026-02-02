# Auth Pages Standardization Guide

Este documento establece los estilos estandarizados para todas las páginas de autenticación (Login y Registro).

## Variables Globales

Todas definidas en `src/styles/variables.scss`:

- `$auth-welcome-font-size`: 1.8rem (desktop)
- `$auth-welcome-font-size-mobile`: 1.6rem
- `$auth-welcome-color`: #666
- `$auth-brand-color`: $color-primary-bold (#3362D9)
- `$auth-title-font-size`: 2rem (desktop)
- `$auth-title-font-size-mobile`: 1.5rem
- `$auth-title-color`: $color-primary-bold
- `$auth-subtitle-font-size`: 1.1rem (desktop)
- `$auth-subtitle-font-size-mobile`: 1rem
- `$auth-subtitle-color`: #666
- `$auth-card-bg`: rgba(255, 255, 255, 0.98)
- `$auth-card-blur`: blur(10px)
- `$auth-card-radius`: 20px
- `$auth-card-shadow`: 0 8px 32px rgba(0, 0, 0, 0.1)
- `$auth-background-image`: url('/assets/img-background-login.jpg')
- `$auth-background-overlay`: linear-gradient(135deg, rgba(163, 201, 249, 0.85) 0%, rgba(51, 98, 217, 0.85) 100%)

## Mixins Disponibles

Todos en `src/styles/auth-mixins.scss`:

### @mixin auth-mobile-background
Aplica el fondo de imagen con overlay para mobile.

### @mixin auth-glassmorphism-card
Aplica el efecto glassmorphism al card.

### @mixin auth-welcome-title
Estilos para "Bienvenido a MiWeb!".

### @mixin auth-main-title
Estilos para título principal (Registro, Iniciar sesión, etc).

### @mixin auth-subtitle
Estilos para subtítulos (Elegí cómo..., Ingresa tus credenciales, etc).

## Estructura HTML Estandarizada

```html
<div class="[page-name]">
  <div class="[page-name]__left">
    <app-register-left></app-register-left>
  </div>
  <div class="[page-name]__right">
    <div class="[page-name]__form">
      <!-- Breadcrumb (opcional, solo en formularios con pasos) -->
      <app-breadcrumb [items]="breadcrumbItems"></app-breadcrumb>
      
      <!-- Título mobile -->
      <div class="[page-name]__title-mobile">
        <span class="welcome">Bienvenido a <span class="mappa">MiWeb!</span></span>
      </div>
      
      <!-- Header del formulario -->
      <div class="[page-name]__form-header">
        <h2 class="[page-name]__form-title">Título</h2>
        <p class="[page-name]__form-subtitle">Subtítulo descriptivo</p>
      </div>
      
      <!-- Contenido del formulario -->
      <!-- ... -->
      
      <!-- Link de login -->
      <div class="[page-name]__login-link">
        ¿Ya tienes cuenta? <a routerLink="/login">Iniciar sesión</a>
      </div>
    </div>
  </div>
</div>
```

## SCSS Estandarizado

```scss
@use '../../../styles/variables' as *;
@use '../../../styles/auth-mixins' as *;

.page-name {
  // Desktop layout
  display: flex;
  min-height: 100vh;
  width: 100%;
  
  &__left {
    width: 50%;
    // ...
  }
  
  &__right {
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $background-primary;
  }
  
  &__title-mobile {
    display: none; // Oculto en desktop
  }
  
  &__form-title {
    @include auth-main-title;
  }
  
  &__form-subtitle {
    @include auth-subtitle;
  }
  
  // Mobile
  @media (max-width: $mobile-max) {
    @include auth-mobile-background;
    
    &__left {
      display: none;
    }
    
    &__right {
      width: 100%;
      padding: 16px;
      background: transparent;
      position: relative;
      z-index: 2;
    }
    
    &__form {
      @include auth-glassmorphism-card;
      padding: 24px 20px;
    }
    
    &__title-mobile {
      @include auth-welcome-title;
      display: block;
      margin-top: 0;
    }
  }
}
```

## Breadcrumb Component

Para formularios con múltiples pasos, usar el componente breadcrumb:

```typescript
// En el componente .ts
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';

breadcrumbItems = [
  { label: 'Registro', active: false },
  { label: 'Necesito ayuda', active: false },
  { label: 'Datos personales', active: true }
];
```

```html
<!-- En el template -->
<app-breadcrumb [items]="breadcrumbItems"></app-breadcrumb>
```

## Checklist de Estandarización

- [ ] Importar auth-mixins.scss
- [ ] Usar @include auth-mobile-background para mobile
- [ ] Usar @include auth-glassmorphism-card para el card
- [ ] Usar @include auth-welcome-title para "Bienvenido a MiWeb!"
- [ ] Usar @include auth-main-title para título principal
- [ ] Usar @include auth-subtitle para subtítulo
- [ ] Mismo padding mobile: 16px en __right, 24px 20px en __form
- [ ] Mismo background image y overlay
- [ ] Agregar breadcrumb si tiene múltiples pasos
