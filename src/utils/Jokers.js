const Jokers = [
  { id: 1, name: "Guasón de Barrio", image: "joker1", effect: "context.multiplier += 4", price: 100, description: "Aumenta el multiplicador en 4." },
  { id: 2, name: "Tío Gilito", image: "gilitoJoker", effect: "cards.forEach(card => { if (card.suit === 'oros') context.multiplier += 1; })", price: 320, description: "Multiplicador +1 cada carta de oros." },
  { id: 3, name: "Don Juan de la Baraja", image: "juanJoker", effect: "cards.forEach(card => { if (card.suit === 'copas') context.multiplier += 1; })", price: 320, description: "Multiplicador +1 cada carta de copas." },
  { id: 4, name: "Espadachín Colérico", image: "espadachinJoker", effect: "cards.forEach(card => { if (card.suit === 'espadas') context.multiplier += 1; })", price: 320, description: "Multiplicador +1 cada carta de de espadas." },
  { id: 5, name: "Tragaldabas de Bastos", image: "tragaldabasJoker", effect: "cards.forEach(card => { if (card.suit === 'bastos') context.multiplier += 1; })", price: 320, description: "Multiplicador +1 cada carta de bastos." },
  { id: 6, name: "Loco de Atar", image: "locoJoker", effect: "if (handType === 'Trío') context.multiplier += 3", price: 280, description: "Multiplicador +3 si juegas un trío." },
  { id: 7, name: "Chiflado de Pares", image: "chifladoJoker", effect: "if (handType === 'Doble Pareja') context.multiplier += 4", price: 300, description: "Multiplicador +4 si juegas doble pareja." },
  { id: 8, name: "Pirado de Escaleras", image: "piradoJoker", effect: "if (handType === 'Escalera') context.multiplier += 5", price: 275, description: "Multiplicador +5 si juegas una escalera." },
  { id: 9, name: "Bufón de Colores", image: "bufonJoker", effect: "if (handType === 'Color') context.multiplier += 6", price: 260, description: "Multiplicador +6 si juegas un color." },
  { id: 10, name: "Zorro de la Pareja", image: "zorroJoker", effect: "if (handType === 'Pareja') context.chips += 77", price: 150, description: "Añade 77 chips si juegas una pareja." },
  { id: 11, name: "Astuto del Trío", image: "astutoJoker", effect: "if (handType === 'Trío') context.chips += 100", price: 150, description: "Añade 100 chips si juegas un trío." },
  { id: 12, name: "Listo de la Doble", image: "listoJoker", effect: "if (handType === 'Doble Pareja') context.chips += 80", price: 160, description: "Añade 80 chips si juegas doble pareja." },
  { id: 13, name: "Tramposo de la Escalera", image: "tramposoJoker", effect: "if (handType === 'Escalera') context.chips += 90", price: 180, description: "Añade 90 chips si juegas una escalera." },
  { id: 14, name: "Marañoso del Color", image: "maranosoJoker", effect: "if (handType === 'Color') context.chips += 95", price: 180, description: "Añade 95 chips si tienes un color." },
  { id: 15, name: "Guasón Abstracto", image: "abstractoJoker", effect: "context.multiplier += 3 * ownedJokers.length", price: 550, description: "Multiplicador +3 por cada joker en posesión." },
  { id: 16, name: "Erudito", image: "eruditoJoker", effect: "if (cards.some(card => card.rank === 'ace')) {context.chips += 20; context.multiplier += 4; }", price: 350, description: "Añade 20 chips y +4 al multiplicador si juegas un as." },
  { id: 17, name: "Caminante", image: "caminanteJoker", effect: "context.chips += 50", price: 200, description: "Añade un bono permanente de 50 chips." },
  { id: 18, name: "El Noble Cavendish", image: "nobleJoker", effect: "context.multiplier *= 3; if (Math.random() < 0.1) inventory.removeJoker(18)", price: 480, description: "Multiplicador x3 con riesgo de destruir el joker." },
  { id: 19, name: "El Barón", image: "baronJoker", effect: "if (cards.some(card => card.rank === 'rey')) {context.multiplier *= 2}", price: 450, description: "Multiplicador x2 si juegas reyes." },
  { id: 20, name: "La Fotografía", image: "fotografiaJoker", effect: "if (cards.some(card => card.rank === 'rey' || card.rank === 'sota' || card.rank === 'caballo')) { context.multiplier *= 2 }", price: 700, description: "Multiplicador x2 si juegas una figura." },
  { id: 21, name: "El Juglar", image: "juglarJoker", effect: "if (cards.some(card => card.rank === 'rey' || card.rank === 'caballo')) context.multiplier *= 2", price: 900, description: "Multiplicador x2 si juegas un rey o un caballo." },
  { id: 22, name: "El Ahorrador", image: "ahorradorJoker", effect: "context.multiplier += 1 * Math.floor(context.chips / 5)", price: 1000, description: "Multiplicador +1 por cada 5 chips acumulados." },
  { id: 23, name: "El Caballista", image: "caballistaJoker", effect: "if (cards.some(card => card.rank === 'rey' || card.rank === 'caballo')) context.multiplier += 3", price: 250, description: "Multiplicador +3 si juegas un caballo." },
  { id: 24, name: "El Acróbata", image: "acrobataJoker", effect: "context.chips += 250", price: 200, description: "Añade 250 chips." },
  { id: 25, name: "El Dúo", image: "duoJoker", effect: "if (handType === 'Pareja') context.multiplier *= 2", price: 500, description: "Multiplicador x2 si juegas una pareja." },
  { id: 26, name: "El Trío", image: "trioJoker", effect: "if (handType === 'Trío') context.multiplier *= 3", price: 600, description: "Multiplicador x3 si juegas un trío." },
  { id: 27, name: "La Familia", image: "familiaJoker", effect: "if (handType === 'Póker') context.multiplier *= 4", price: 460, description: "Multiplicador x4 si juegas póker." },
  { id: 28, name: "La Orden", image: "ordenJoker", effect: "if (handType === 'Escalera') context.multiplier *= 3", price: 450, description: "Multiplicador x3 si juegas una escalera." },
  { id: 29, name: "La Tribu", image: "tribuJoker", effect: "if (handType === 'Color') context.multiplier *= 2", price: 300, description: "Multiplicador x2 si juegas color." },
  { id: 30, name: "Punta de Flecha", image: "flechaJoker", effect: "cards.forEach(card => { if (card.suit === 'espadas') context.chips += 50; })", price: 100, description: "Añade 50 chips por cada carta de espadas." },
  { id: 31, name: "Gema en Bruto", image: "gemaJoker", effect: "cards.forEach(card => { if (card.suit === 'oros') context.chips += 50; })", price: 120, description: "Añade 50 chip por cada carta de oros." },
  { id: 32, name: "El Billete Dorado", image: "billeteJoker", effect: "cards.forEach(card => { if (card.suit === 'oros') context.chips += 40 })", price: 180, description: "Añade 40 chips por cada carta de oros." },
  { id: 33, name: "La Cromos", image: "cromosJoker", effect: "context.multiplier += 2 * ownedJokers.length", price: 500, description: "Multiplicador +2 por cada joker en tu mano." },
  { id: 34, name: "El Guasón Dorado", image: "doradoJoker", effect: "context.chips += 250", price: 400, description: "Añade 250 chips a tu total." }
];

export default Jokers;