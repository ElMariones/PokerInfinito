# All In: La Ultima Mano

## Haz click para ver el gameplay o el trailer

[![Ver el gameplay](https://img.youtube.com/vi/y1gCe0Y9Iik/0.jpg)](https://youtu.be/y1gCe0Y9Iik)

[![Ver el trailer](https://img.youtube.com/vi/WXuYIYHAj-8/0.jpg)](https://youtu.be/WXuYIYHAj-8)


## Historia

En el pueblo de Hightable, los bares y restaurantes no solo sirven comida y bebida: son arenas de batalla donde los mejores jugadores de cartas defienden su territorio con orgullo como representantes del casino.  
Dante Holloway, marcado por la misteriosa desaparición de su padre tras recibir una carta con el símbolo del legendario Casino Ébano, encuentra la misma invitación en su casa años más tarde.  
Para descubrir la verdad, deberá derrotar a los campeones de cada local, desde el letal "Monarca", la enigmática "Bruja", hasta los hermanos "Blackwood".

Cada victoria lo acerca más al enigmático Casino Ébano, donde la última prueba lo enfrentará a su propio padre, ahora convertido en el Gran Crupier.  
En este juego, el riesgo es absoluto: si gana, logrará librar a su padre de su eterna esclavitud como crupier. Si pierde… se convertirá en el nuevo Crupier perpetuo del casino.

---

## Caracteríasticas principales

- Se maneja a Dante por el mapa para combatir con los jefes de cada restaurante para poder acceder al casino y ver lo que conlleva en él.
- Los duelos son batallas de cartas las cuales se superan obteniendo una ciega mayor a la impuesta por el jefe
- Derrotar a los campeones de los bares para conseguir un objeto único de cada uno (llave, pase, ficha personalizada, etc.).  
- Entrar al Casino Final, enfrentarse al Jefe y resolver el misterio familiar o personal de Dante.
- Tiene un estilo pixelart.

---

## Core Loops

---

## Flujo de Juego General

1. **Inicio**: El jugador conoce la historia de Dante Holloway y su búsqueda.  
2. **Exploración**: Se mueve por la calle, puede entrar a uno de los 4 bares en cualquier orden.  
3. **Batalla de Póker**:  
   - Se muestran las reglas, rondas y objetivo de puntos.  
   - Rondas sucesivas de selección de 5 cartas de la mano de 10.  
   - Posible uso de **Ayuda** o **Shuffle** durante el enfrentamiento (dependiendo de si se permite).  
4. **Resultado**:  
   - Si alcanza o supera la meta, consigue objeto clave y monedas.  
   - Si no, pierde monedas.  
5. **Progreso**:  
   - Repite en los 4 bares hasta tener todos los objetos necesarios.  
6. **Acceso al Casino**:  
   - Enfrenta la **Batalla Final** con el Jefe.  
   - Descubre la **resolución de la historia**.

  ---

## Mecánicas

### Mapa

- Mapa 2D, up-view (estilo Pokémon).  
- El jugador puede moverse arriba, abajo, izquierda y derecha.  
- Solo tiene una tecla para interactuar con gente, puertas o la tienda.  
- El mapa funciona como medio a las batallas de cartas que presentan gran parte de las mecánicas del juego.

### Mapa de grafos

![image](https://github.com/user-attachments/assets/9427553e-be47-4c39-aeb0-b5b5b9bfb0ae)


### Batallas de Cartas

- Al retar a un campeón en un bar, aparece la interfaz de juego.  
- Se reparten **10 cartas** al jugador. Este debe elegir **5** para formar su mano.  
- El contrincante establece el **Objetivo de Puntos** (ej.: 300 puntos en 3 rondas).  
- El jugador juega **X rondas** (definidas por el retador).
- En cada ronda puede (opcionalmente) barajar toda su mano (*shuffle*), pagando monedas. El precio del shuffle aumenta por cada uso.
- Botón de ayuda para conocer las reglas y puntuaciones.  
- Ordenar cartas por color o número.  
- La dificultad de las batallas irá aumentando conforme el jugador vaya avanzando en las batallas. No solo con el aumento del **objetivo de puntos**, si no con diferentes desafíos planteados por los campeones de cada bar.

### Tienda

- El jugador podrá comprar todo tipo de bonus, cartas, etc.
- Estará disponible en el mapa para el jugador.
- Cambiarán las opciones de compra cada vez que se derrote a un enemigo de un bar,

### Eventos

- Se encontrarán repartidos por todo el mapa.
- No siempre serán bonus. Alguno podrá ser una batalla de cartas, un regalo o el robo de una carta.

### Puntuación de manos

A continuación, se presenta una lógica de puntuación para cada tipo de mano, con su nombre y valor base.  
Se asume que el jugador escoge 5 cartas de las 10 repartidas y que las combina para formar la mejor jugada.

- **Escalera de Color**: 100 puntos  
- **Póker (4 iguales)**: 90 puntos  
- **Full House (3+2)**: 80 puntos  
- **Color (Flush)**: 70 puntos  
- **Escalera**: 60 puntos  
- **Trío (3 iguales)**: 50 puntos  
- **Doble Pareja**: 40 puntos  
- **Pareja**: 30 puntos  
- **Carta Alta**: 10 puntos  

---

### Diálogos

- Al interactuar con un personaje entraremos en el modo diálogo.
- Se verá un dibujo del personaje con el que hablemos junto a un bocadillo con el texto.
- Cuando presionemos la E avanzará el dialogo hasta que llegue al final
- Cuando finalice el diálogo dará comienzo la batalla de cartas
  
---

## Sistema de Monedas

- **Ganas monedas** según la diferencia de puntos por encima del objetivo.  
- Ejemplo: El enemigo pide 300 puntos en 3 rondas, y terminas con 450 → Ganas 150 monedas.

### Gasto de Monedas

- **Shuffle**: Cada vez que barajas (cambias por completo las 10 cartas) pagas un coste definido (ej. 30 monedas). Este coste se va incrementando.  
- **Tienda**:
  - Compra de **modificadores** (ej. +10 puntos en la siguiente mano, +1 ronda extra, +1 tamaño de mano, etc.).  
  - Compra de **cartas especiales** (posibles comodines o restricciones únicas).

---

## Playtest
- ¿Cuánto tardan en entrar al Asador del Rey?
- ¿Hablan con la barrera?
- ¿Ha entendido el jugador las barreras?
- ¿Han entendido la logística de las cartas?
- ¿Ha sido confuso el tener que elegir 5 cartas?
- ¿Si se usan lo botones de barajar y ordenar? ¿Son útiles?
- ¿Antes de entrar al Olvido han visto las vacas?
- Después del Olvido, ¿ha visto el jugador las barreras y cuánto tarda en ir para la zona del pescador?
- Botones de UIOverlay, ¿se usan los botones de la tienda, las misiones, volumen e inventario?
- Después del pescador, ¿van a hablar con "Snorlax" o se sienten confunsos?
- ¿Se nota la barrera del bar de los bandidos?
- Se encuentra bien el camino hacia el casino final?
- ¿Qué te parecieron los diálogos? ¿Han estado bien en cuanto a longitud? ¿Te has entereado de la historia?
- Comentario general de que le ha parecido y que mejoraría
