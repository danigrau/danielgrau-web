# Daniel Grau — versión HTML modular de pruebas

**No publicar aún en la rama main.** Paquete con la home y las cuatro páginas secundarias actuales. Mantiene las rutas públicas de HTML y las imágenes originales extraídas del index.html.

## Prueba local

Descomprimir y abrir una terminal dentro de la carpeta. Ejecutar `python -m http.server 8000`; acceder a `http://localhost:8000/`. Los enlaces externos a Substack necesitan conexión a Internet.

## Próximos pasos

- Validar visualmente home y páginas secundarias en desktop y móvil.
- Comprobar enlaces, navegación de zonas clicables, scroll y formulario de suscripción.
- Comparar con la web publicada y preparar un despliegue de ensayo separado.
- Solo tras aprobar las pruebas, valorar su publicación en el dominio definitivo.

## Diferencias técnicas intencionales

- Home: imagen, CSS y JS extraídos sin cambios funcionales.
- Páginas secundarias: CSS de cada página trasladado a assets/css/.
- Página libro: portada referida directamente desde assets/images/portada-bufalo.png, eliminando la lectura de index.html.
- Se conservan los nombres de las páginas, la redirección histórica y el enlace de Substack.
- El botón Amazon permanece inactivo hasta publicarse el libro.

## Cambiar ilustración principal

Reemplazar assets/images/ilustracion-home.png con un archivo del mismo nombre. Si la composición cambia, ajustar data-x/data-y en index.html y verificar el resultado móvil.

## Importante

Esta versión es para validación; el resultado visual no está aprobado y no se ha modificado el repositorio.

## Revisión posterior (08/11/2026)

- Eliminado el párrafo de texto provisional en cursiva de Reflexiones.
- Usuario confirmó diseño en simulación móvil (390 × 844), navegación y zonas clicables en escritorio y móvil.
- Pendiente la prueba completa en HTTP, incluida la integración de Substack, antes del despliegue.
