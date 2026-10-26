# Mantenimiento del profile README

## Regenerar

Desde esta carpeta:

```bash
npm run generate
```

El script no tiene dependencias. Reescribe `assets/hero-*.svg`, `assets/about-*.svg`, `assets/pillars-*.svg`, `assets/stack-*.svg` y `assets/contact-*.svg`. La actividad pública sale de `https://api.github.com/users/Lautarolecube` y de la lista de repositorios. Si esa API no responde y ya existen `assets/activity-dark.svg` y `assets/activity-light.svg`, los deja como están. No completa cifras a mano.

## Qué se puede publicar

Una tarjeta de proyecto entra en `README.md` solo después de leer el repositorio y poder decir, con el código o el README público, qué es. No se agregan métricas, clientes, cargos ni una URL de portfolio hasta que exista un dato verificable.

`artista` y `Gestor-de-tickets` son la plantilla pública de Dev Containers de Microsoft. `contact-widget-demo` no tiene archivos. No van en Featured work.

## Dónde se ve el perfil

GitHub muestra este archivo en el perfil solo si está en un repositorio público llamado `Lautarolecube`, con el nombre `README.md` en la raíz. Este proyecto es `Portfolio-public`. El repositorio `Lautarolecube/Lautarolecube` no existe todavía. Copiar estos archivos ahí es un paso aparte, y no se hace desde este script.

## Actualizar la actividad sin un cron

`.github/workflows/update-readme.yml` corre solo con `workflow_dispatch`. No tiene horario. Al dispararlo a mano, regenera los SVG y, si cambió la actividad, hace commit y push de `assets/activity-*.svg`.
