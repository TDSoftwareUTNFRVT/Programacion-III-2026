# 🎮 Trivia Game  
### Programación III – Tecnicatura Universitaria en Programación (TUP)  
**Universidad Tecnológica Nacional – Facultad Regional Venado Tuerto (UTN FRVT)**

---

## 📖 Descripción General

**Trivia Game** es una aplicación web interactiva que permite a los usuarios responder preguntas de cultura general obtenidas dinámicamente desde la API pública **Open Trivia Database**.

El proyecto fue desarrollado como trabajo práctico integrador de la materia **Programación III**, con foco no solo en la funcionalidad, sino también en la **calidad del código**, la **arquitectura del sistema** y la **experiencia de usuario**.

---

## 🎯 Objetivos

- Desarrollar una aplicación web utilizando **HTML5, CSS3 y JavaScript (ES6+)**.
- Implementar consumo de APIs externas mediante **Fetch API**.
- Aplicar **Programación Orientada a Objetos (POO)** para estructurar el código.
- Diseñar una arquitectura modular, escalable y mantenible.
- Implementar un **manejo robusto de errores**.
- Crear una interfaz clara, intuitiva y responsiva.

---

## 🚀 Funcionalidades

- Configuración de partida:
  - Selección de categoría
  - Selección de dificultad
  - Cantidad de preguntas
- Obtención dinámica de preguntas desde la API.
- Presentación de preguntas con múltiples opciones.
- Validación de respuestas en tiempo real.
- Sistema de puntaje acumulativo.
- Feedback visual inmediato:
  - Respuestas correctas
  - Respuestas incorrectas
- Navegación entre preguntas.
- Pantalla de resultados finales.
- Reinicio de partida.

---

## 🏗️ Arquitectura del Proyecto

El sistema se diseñó bajo un enfoque modular, separando responsabilidades en distintas capas:

- **Capa de Datos (API)** → Encargada de la comunicación con el servicio externo.  
- **Capa de Lógica (Game)** → Administra el estado del juego y las reglas.  
- **Capa de Presentación (UI)** → Gestiona la interacción con el usuario y el DOM.

Esta separación permite:
- Mayor mantenibilidad
- Reutilización de código
- Facilidad para escalar funcionalidades

---

## 📁 Estructura del proyecto

```
project-root/
├── index.html
├── /css
│   └── styles.css
├── /js
│   ├── app.js        # Punto de entrada de la aplicación
│   ├── TriviaAPI.js  # Comunicación con la API (fetch, cache, parsing)
│   ├── Game.js       # Lógica del juego y estado
│   ├── UI.js         # Manipulación del DOM e interacción visual
│   └── utils.js      # Funciones auxiliares reutilizables
└── README.md
```

---

## 🧠 Diseño y Organización del Código

El proyecto utiliza **clases ES6** para encapsular responsabilidades:

- `TriviaAPI`  
  - Maneja las solicitudes HTTP.
  - Implementa cacheo de respuestas.
  - Procesa y normaliza los datos recibidos.

- `Game`  
  - Controla el flujo del juego.
  - Administra puntaje, preguntas y estado actual.

- `UI`  
  - Renderiza la interfaz.
  - Maneja eventos del usuario.
  - Actualiza dinámicamente el contenido en pantalla.

- `Utils`  
  - Funciones auxiliares (formateo, validaciones, etc.).

---

## ⚠️ Manejo de Errores

Se implementa una estrategia de manejo de errores en múltiples niveles:

### 🔌 Errores de red
- Fallos en la conexión con la API.
- Timeout o respuestas inválidas.

### 📦 Errores de datos
- Respuestas vacías o mal formateadas.
- Validación de estructura de datos recibidos.

### 👤 Errores de usuario
- Acciones inválidas (ej: no seleccionar respuesta).

### 🛠️ Técnicas utilizadas
- `try / catch`
- Validaciones explícitas
- Mensajes de error en UI
- Estados controlados de la aplicación

---

## 🎨 Interfaz de Usuario

La interfaz fue diseñada con foco en la **claridad y usabilidad**:

- Diseño limpio e intuitivo.
- Feedback visual inmediato.
- Jerarquía visual clara.
- Adaptabilidad básica (responsive).
- Transiciones y estados visuales para mejorar la experiencia.

---

## 🔌 API Utilizada

- **Open Trivia Database**  
- URL base: https://opentdb.com/api.php  

Características:
- Preguntas categorizadas.
- Diferentes niveles de dificultad.
- Formato estándar JSON.

---

## 🛠️ Tecnologías Utilizadas

- **HTML5**
- **CSS3**
- **JavaScript (ES6+)**
- **Fetch API**

---

## ▶️ Ejecución del Proyecto

1. Clonar o descargar el repositorio.
2. Abrir el archivo `index.html` en un navegador web.

---

## 📌 Buenas Prácticas Aplicadas

- Separación de responsabilidades (SRP).
- Código modular y reutilizable.
- Uso de clases y encapsulamiento.
- Manejo consistente de errores.
- Nomenclatura clara y descriptiva.
- Estructura escalable.

---

## 👥 Integrantes

- *Fantasía, Victoria* (<fantavilo@gmail.com>)
- *Villalba, Tamara* (<tamaravillalba071@gmail.com>)

---

## 📄 Licencia

Este proyecto fue desarrollado con fines académicos.

---

## 📝 Observaciones Finales

El enfoque principal de este trabajo no se limita a la implementación funcional, sino que prioriza:

- La calidad del diseño del software  
- La mantenibilidad del código  
- La claridad en la interacción con el usuario  

Esto lo convierte en una base sólida para futuras extensiones o mejoras del sistema.