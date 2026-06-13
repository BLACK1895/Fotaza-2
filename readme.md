//# Fotaza 2 📸 - Red Social de Fotografía

¡Bienvenido a **Fotaza 2**! Este proyecto es un Trabajo Práctico Integrador (TPI) de desarrollo web dos. Se trata de una red social de fotografía diseñada e implementada utilizando **Node.js**, **Express**, **MySQL** y el motor de plantillas **Pug**. 

La aplicación permite a los usuarios registrarse, iniciar sesión, compartir imágenes con diferentes tipos de licencias, dar "Me gusta", comentar publicaciones y seguir a otros usuarios para ver sus perfiles y estadísticas en tiempo real.

Actualmente, el proyecto se encuentra completamente productivo y desplegado en la nube utilizando **Render** para el servicio web y **Aiven** para la persistencia de datos.

---

## 🛠️ Tecnologías Utilizadas

* **Backend:** Node.js, Express.js.
* **Base de Datos:** MySQL (XAMPP en entorno local / Aiven en producción).
* **Motor de Vistas:** Pug (ex-Jade).
* **Estilos:** CSS3 nativo con diseño responsivo y temática personalizada.
* **Autenticación:** Express-session para la gestión de sesiones de usuario.
* **Subida de Archivos:** Multer para el procesamiento de imágenes en el servidor.
* **Despliegue y DevOps:** Git, GitHub, Render y Aiven Cloud.
* **inteligncia artificial**Gemini para la busqueda y correccion de errores
---

## 🚀 Acciones Realizadas en el Proyecto

A lo largo del desarrollo y optimización del proyecto, ejecuté las siguientes tareas estructuradas por capas:

### 1. Capa de Base de Datos y Modelos (`Models`)
* **Normalización y Alias en SQL:** Corregí un conflicto de nombres entre los atributos nativos de las tablas. Implementé el uso de aliases en SQL (`p.usuario_id AS autor_id`) dentro del modelo de publicaciones para garantizar que las plantillas Pug capturen de forma nativa el ID correcto del creador de cada post.
* **Optimización de Consultas Complejas:** Refactoricé la función `PostModel.getAll` (tanto para el muro general como para el motor de búsqueda). Incorporé `LEFT JOIN` hacia la tabla `imagenes` para extraer el tipo de licencia dinámicamente y utilicé funciones de agregación como `COUNT(DISTINCT l.id)` para lograr un conteo exacto y aislado de los Likes por publicación.
* **Migración a la Nube (Aiven):** Realicé la exportación del esquema y los datos mediante herramientas de respaldo (`mysqldump`) para migrar la base de datos local de XAMPP hacia un clúster administrado en **Aiven MySQL**, configurando la obligatoriedad de conexiones cifradas mediante SSL.

### 2. Capa de Backend y Lógica de Control (`Controllers`)
* **Resolución de Errores Críticos de Enrutamiento:** Depuré y solucioné errores de tipo `404 (Not Found)` y `Usuario no encontrado`. Reestructure las cláusulas `WHERE` de las consultas en `userController.js` para que utilicen `p.usuario_id`, logrando que los parámetros dinámicos de las rutas (`/usuario/:userId`) coincidan estrictamente con los registros de la base de datos.
* **Seguridad y Modularización del Entorno:** Implementé la librería `dotenv` para desacoplar las credenciales del código fuente. Centralicé los datos sensibles de producción en un archivo `.env` local y protegí el proyecto contra filtraciones configurando el archivo `.gitignore`.
* **Estrategia de Conexión Híbrida (`db.js`):** Modificé el pool de conexiones de `mysql2` para actuar de forma inteligente: detecta de manera automática si existen variables de entorno de producción para activar los requerimientos SSL de Aiven, manteniendo la compatibilidad por defecto con XAMPP local.

### 3. Capa de Frontend e Interfaz de Usuario (`Views` / Pug)
* **Depuración de Sintaxis:** Solucioné errores de indentación inconsistente (*Inconsistent indentation*) en las vistas `.pug`, logrando una estructura limpia y estandarizada utilizando espacios para una correcta compilación en el servidor.
* **Sistema Dinámico de Seguidores (Follow/Unfollow):** Diseñé e integré un módulo interactivo en la vista del perfil. Añadí lógica condicional para evaluar si el perfil pertenece al usuario logueado (ocultando el botón para respetar las restricciones `CHECK` de la base de datos). El botón muta dinámicamente su estado estético y su acción por método `POST` (Rojo "Dejar de seguir" / Azul-Amarillo "Seguir") basándose en el estado real de la tabla `seguidores`.
* **Accesibilidad y Correcciones Estéticas:** Solucioné un problema de paths duplicados en el renderizado de imágenes (`/uploads//uploads/`), optimizando la lectura directa desde la base de datos. Además, corregí el contraste visual en la tarjeta del perfil, modificando los estilos de los contadores a color oscuro para garantizar una lectura legible sobre el nuevo fondo claro de la tarjeta.

### 4. Despliegue y Producción (DevOps)
* **Integración con GitHub:** Sincronicé las últimas versiones estables del código fuente utilizando el flujo de trabajo de Git estándar (`add`, `commit`, `push`).
* **Configuración en Render:** Creé y vinculé un *Web Service* en Render configurando los comandos de construcción (`npm install`) y arranque (`npm start`), enlazando de forma exitosa las variables de entorno globales con el clúster remoto de Aiven.
