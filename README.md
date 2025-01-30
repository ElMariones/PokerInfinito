# All In: La Ultima Mano

## Overview

## Details

## Story

En el corazón de un pequeño pueblo conocido como Hightable, donde los restaurantes y bares son el alma de la comunidad, existe una tradición no escrita: el dominio del juego de cartas lo es todo. Aquí, cada establecimiento tiene su propio "campeón", alguien que ha perfeccionado su estilo de juego y defiende su territorio con honor.

El protagonista, Dante Holloway, creció viendo a su padre apostar en las mesas clandestinas del pueblo, con el sueño de algún día llegar al Casino Ébano, el lugar más exclusivo y misterioso de la región. Sin embargo, su padre desapareció una noche después de recibir una carta con un símbolo dorado: la marca del casino.

Años después, Dante recibe la misma carta. Es una invitación, pero con una condición: sólo aquellos que han derrotado a los grandes jugadores del pueblo pueden entrar. Si quiere descubrir qué le pasó a su padre y desvelar los secretos del Casino Ébano, deberá convertirse en el mejor jugador del pueblo.

El Desafío de los Bares y Restaurantes
Cada local tiene su propio campeón con un estilo de juego único, lo que obliga a Dante a adaptarse y aprender nuevas estrategias. Algunos rivales incluyen:

"El Asador del Rey" - Samuel "El Monarca"

Un exjugador profesional que se retiró para abrir una parrilla. Juega con un estilo conservador pero letal. Su lema: "La paciencia cocina la mejor jugada".
"La Taberna del Olvido" - Helena "La Bruja"

Una barman excéntrica con un estilo de juego impredecible. Usa faroles y trucos psicológicos para hacer que sus oponentes duden de sí mismos.
"El Puerto Azul" - Marco "El Náufrago"

Un marinero retirado que apuesta todo o nada. Su estrategia es el riesgo absoluto, confiando en que la suerte favorece a los audaces.
"Rincón del Bandido" - Los Hermanos Blackwood

Dos gemelos que juegan en equipo, usando códigos secretos y tácticas para manipular el juego a su favor.
"El Último Trago" - Donovan "El Sepulturero"

Un jugador que nunca sonríe, experto en el juego mental. Nadie ha visto su mano temblar ni una sola vez.
El Gran Desafío: Casino Ébano
Cuando Dante vence a todos los campeones del pueblo, finalmente recibe la llave de entrada al Casino Ébano. Allí, descubre que su padre no desapareció… sino que se convirtió en el Gran Crupier, la última prueba antes de conocer la verdad detrás del Casino.

Ahora, Dante debe enfrentarse a su propio padre en un duelo de cartas definitivo. Si gana, descubrirá qué secreto esconde el casino. Si pierde… podría quedar atrapado en sus redes para siempre.

## Instalación

El repositorio está publicado como plantilla, de forma que se puede crear un nuevo proyecto propio en GitHub simplemente pulsando el botón `Use this template` (arriba a la derecha). Después, solo hay que clonar el repositorio propio y trabajar sobre él.

## Clonar

También se puede clonar el repositorio:

```
git clone https://github.com/cleongh/plantillaphaser
```

Podemos modificar el archivo `package.json` para configurar nuestro proyecto (nombre, autor...)

Para iniciar el proyecto (sólo 1 vez) instalamos las dependencias automáticamente (`vite`, `phaser`):

```
npm install
```

## Uso

Cada vez que queramos usarlo, tenemos que arrancar el servidor de desarrollo que monitorizará los cambios, procesará el contenido y cambiará la página. Usa [Vite](https://es.vitejs.dev/).

Para arrancar el servidor de desarrollo:

```
npm start
```

Con esto, solo tenemos que programar y guardar los archivos, Vite se encargará del resto.

## Distribución

El repositorio tiene una acción de GitHub (*GitHub Action*) que genera una versión de *release* y la publica en GitHub Pages. De este modo, cada vez que se hace `push`, se construye y publica en la página pública.

Se publica el contenido de la rama *main*.

Si no se está usando GitHub, o se quiere publicar a mano, podemos crear una *build* de *release*. Vite optimizará los archivos y, con la configuración que hay en `package.json`, generará en la carpeta `docs/` una versión "pública" de nuestro proyecto.

```sh
npm run build
```

<!-- ### En GitHub -->

<!-- Está todo configurado para que se active "GitHub Pages", y se use, en la rama principal (se suele llamar `main`), la carpeta `docs/`. Simplemente hay que activarlo en "Settings" → "Pages" → "Build and deployment". -->

## VSCode

En la carpeta `.vscode/` hay una configuración para usar Visual Studio Code, tanto para construir el *release* (`npm run build`) como para ejecutar y depurar. Simplemente hay que ejecutar "Run" → "Start debugging..." (or presionar `F5`).

## TypeScript

TypeScript está automáticamente habilitado (gracias a Vite). Para usarlo, simplemente hay que crear archivos con extensión `.ts`.
