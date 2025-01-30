# All In: La Ultima Mano

![macaco_macaco_generate_a_pixel_art_title_for_a_card_game_with_0810ca01-5e59-4d3d-8e44-e5ff481cf843_3 (1)](https://github.com/user-attachments/assets/390034cc-580a-4b57-9b9e-5aa8255eb484)

## Historia

En el pueblo de Hightable, los bares y restaurantes no solo sirven comida y bebida: son arenas de batalla donde los mejores jugadores de cartas defienden su territorio con orgullo.  
Dante Holloway, marcado por la misteriosa desaparición de su padre tras recibir una carta con el símbolo del legendario Casino Ébano, recibe la misma invitación.  
Para descubrir la verdad, deberá derrotar a los campeones de cada local, desde el letal "Monarca" hasta la enigmática "Bruja".

Cada victoria lo acerca más al enigmático Casino Ébano, donde la última prueba lo enfrentará a su propio padre, ahora convertido en el Gran Crupier.  
En este juego, el riesgo es absoluto: si gana, conocerá el secreto del casino. Si pierde… quedará atrapado en sus sombras para siempre.

---

## Mecánicas

**Dos secciones**: El mapa y las Batallas de Póker

### Mapa

- Mapa 2D, up-view (estilo Pokémon).  
- El jugador puede moverse arriba, abajo, izquierda y derecha.  
- Solo tiene una tecla para interactuar con gente, puertas o la tienda.  
- El mapa funciona como medio a las batallas de cartas que presentan gran parte de las mecánicas del juego.

### Batallas de Póker

- Al retar a un campeón en un bar, aparece la interfaz de juego.  
- Se reparten **10 cartas** al jugador. Este debe elegir **5** para formar su mano.  
- El contrincante establece el **Objetivo de Puntos** (ej.: 300 puntos en 3 rondas).  
- El jugador juega **X rondas** (definidas por el retador).
- En cada ronda puede (opcionalmente) barajar toda su mano (*shuffle*), pagando monedas. El precio del shuffle aumenta por cada uso.
- Botón de ayuda para conocer las reglas y puntuaciones.  
- Ordenar cartas por color o número.  
- Etc...

---

## Objetivo Narrativo

- Derrotar a los campeones de los bares para conseguir un objeto único de cada uno (llave, pase, ficha personalizada, etc.).  
- Entrar al Casino Final, enfrentarse al Jefe y resolver el misterio familiar o personal de Dante.

---

# Sistema de Monedas

- **Ganas monedas** según la diferencia de puntos por encima del objetivo.  
- Ejemplo: El enemigo pide 300 puntos en 3 rondas, y terminas con 450 → Ganas 150 monedas.

## Gasto de Monedas

- **Shuffle**: Cada vez que barajas (cambias por completo las 10 cartas) pagas un coste definido (ej. 30 monedas). Este coste se va incrementando.  
- **Tienda**:
  - Compra de **modificadores** (ej. +10 puntos en la siguiente mano, +1 ronda extra, +1 tamaño de mano, etc.).  
  - Compra de **cartas especiales** (posibles comodines o restricciones únicas).

---

# Mecánica de Puntuación de Manos

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
