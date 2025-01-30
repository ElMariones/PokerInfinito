# All In: La Ultima Mano

## Overview

## Details

## Historia

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

## Mecánicas

Dos secciones: El mapa y las batallas de cartas

### Mapa

Mapa 2D, up-view (estilo Pokemon). El jugador puede moverse arriba, abajo, izquierda y derecha. Solo tiene una tecla para interactuar con gente, puertas o la tienda. El mapa funciona como medio a las batallas de cartas que presentan gran parte de las mecánicas del juego.

### Partida de Cartas

Seleccionar una o más cartas (máximo 5 para una mano). Barajar cartas. Pedir ayuda. Ordenar cartas por color o numero. Etc...

## Objetivo Narrativo

Derrotar a los 4 campeones de los bares para conseguir un objeto único de cada uno (llave, pase, ficha personalizada, etc.).
Entrar al Casino Final, enfrentarse al Jefe y resolver el misterio familiar o personal de Dante.


## Exploración:

Vista 2D (o top-down) por la calle principal donde están los 4 bares.
El jugador puede entrar a cada bar en el orden que prefiera (o en un orden guiado si lo deseas).
Una vez consiga los 4 objetos, se desbloqueará el Casino VIP.

## Batallas de Póker:

Al retar a un campeón en un bar, aparece la interfaz de juego.
Se reparten 10 cartas al jugador. Este debe elegir 5 para formar su mano.
El contrincante establece el Objetivo de Puntos (ej.: 300 puntos en 3 rondas).
El jugador juega X rondas (definidas por el retador). En cada ronda puede (opcionalmente) barajar toda su mano (shuffle), pagando monedas.

# Sistema de Monedas:

Ganas monedas según la diferencia de puntos por encima del objetivo.
Ejemplo: El enemigo pide 300 puntos en 3 rondas, y terminas con 450 → Ganas 150 monedas.

## Gasto de Monedas:
Shuffle: Cada vez que barajas (cambias por completo las 10 cartas) pagas un coste definido (ej. 30 monedas).
Tienda:
Compra de modificadores (ej. +10 puntos en la siguiente mano, +1 ronda extra, etc.).
Compra de cartas especiales (posibles comodines o restricciones únicas).

# Mecánica de Puntuación de Manos
A continuación, se presenta una lógica de puntuación para cada tipo de mano, con su nombre y valor base. Se asume que el jugador escoge 5 cartas de las 10 repartidas y que las combina para formar la mejor jugada. Para explicar la lógica, incluimos un pseudocódigo adaptado de lo que podrías usar en tu sistema:

Escalera de Color: 100 puntos
Póker (4 iguales): 90 puntos
Full House (3+2): 80 puntos
Color (Flush): 70 puntos
Escalera (Straight): 60 puntos
Trío (3 iguales): 50 puntos
Doble Pareja: 40 puntos
Pareja: 30 puntos
Carta Alta: 10 puntos

## Flujo de Juego General
Inicio: El jugador conoce la historia de Dante Holloway y su búsqueda.
Exploración: Se mueve por la calle, puede entrar a uno de los 4 bares en cualquier orden.
Batalla de Póker:
Se muestran las reglas, rondas y objetivo de puntos.
Rondas sucesivas de selección de 5 cartas de la mano de 10.
Posible uso de Tienda o Shuffle durante el enfrentamiento (dependiendo de si se permite).
Resultado:
Si alcanza o supera la meta, consigue objeto clave y monedas.
Si no, puede volver a intentarlo pagando una pequeña tarifa o buscando más monedas en otros bares (si no has derrotado a los demás).
Progreso:
Repite en los 4 bares hasta tener todos los objetos necesarios.
Acceso al Casino:
Enfrenta la Batalla Final con el Jefe.
Descubre la resolución de la historia.
