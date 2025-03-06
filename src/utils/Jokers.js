export const jokers = {
    'Guasón de Barrio': {
      apply: (hand, context) => {
        context.multiplier += 4;
      }
    },
    'Tío Gilito': {
      apply: (hand, context) => {
        hand.forEach(card => {
          if (card.suit === 'oros') {
            context.multiplier += 3;
          }
        });
      }
    },
    'Don Juan de la Baraja': {
      apply: (hand, context) => {
        hand.forEach(card => {
          if (card.suit === 'copas') {
            context.multiplier += 3;
          }
        });
      }
    },
    'Espadachín Colérico': {
      apply: (hand, context) => {
        hand.forEach(card => {
          if (card.suit === 'espadas') {
            context.multiplier += 3;
          }
        });
      }
    },
    'Tragaldabas de Bastos': {
      apply: (hand, context) => {
        hand.forEach(card => {
          if (card.suit === 'bastos') {
            context.multiplier += 3;
          }
        });
      }
    },
    'Loco de Atar': {
      apply: (hand, context) => {
        if (context.handType === 'Trío') {
          context.multiplier += 12;
        }
      }
    },
    'Chiflado de Pares': {
      apply: (hand, context) => {
        if (context.handType === 'Doble Pareja') {
          context.multiplier += 10;
        }
      }
    },
    'Pirado de Escaleras': {
      apply: (hand, context) => {
        if (context.handType === 'Escalera') {
          context.multiplier += 12;
        }
      }
    },
    'Bufón de Colores': {
      apply: (hand, context) => {
        if (context.handType === 'Color') {
          context.multiplier += 10;
        }
      }
    },
    'Zorro de la Pareja': {
      apply: (hand, context) => {
        if (context.handType === 'Pareja') {
          context.chips += 50;
        }
      }
    },
    'Astuto del Trío': {
      apply: (hand, context) => {
        if (context.handType === 'Trío') {
          context.chips += 100;
        }
      }
    },
    'Listo de la Doble': {
      apply: (hand, context) => {
        if (context.handType === 'Doble Pareja') {
          context.chips += 80;
        }
      }
    },
    'Tramposo de la Escalera': {
      apply: (hand, context) => {
        if (context.handType === 'Escalera') {
          context.chips += 100;
        }
      }
    },
    'Marañoso del Color': {
      apply: (hand, context) => {
        if (context.handType === 'Color') {
          context.chips += 80;
        }
      }
    },
    'Sombra del Guasón': {
      apply: (hand, context) => {
        context.multiplier += context.emptyJokerSlots;
      }
    },
    'El Banderín': {
      apply: (hand, context) => {
        context.chips += 30 * context.remainingDiscards;
      }
    },
    'Cima Mística': {
      apply: (hand, context) => {
        if (context.remainingDiscards === 0) {
          context.multiplier += 15;
        }
      }
    },
    'Guasón Abstracto': {
      apply: (hand, context) => {
        context.multiplier += 3 * context.jokerCount;
      }
    },
    'Erudito': {
      apply: (hand, context) => {
        hand.forEach(card => {
          if (card.rank === 'ace') {
            context.chips += 20;
            context.multiplier += 4;
          }
        });
      }
    },
    'Caminante': {
      apply: (hand, context) => {
        hand.forEach(card => {
          card.permanentChipBonus = (card.permanentChipBonus || 0) + 5;
        });
      }
    },
    'El Noble Cavendish': {
      apply: (hand, context) => {
        context.multiplier *= 3;
        if (Math.random() < 0.001) {
          context.jokerDestroyed = true;
        }
      }
    },
    'El Barón': {
      apply: (hand, context) => {
        hand.forEach(card => {
          if (card.rank === 'king') {
            context.multiplier *= 1.5;
          }
        });
      }
    },
    'La Fotografía': {
      apply: (hand, context) => {
        if (!context.firstFigurePlayed) {
          context.multiplier *= 2;
          context.firstFigurePlayed = true;
        }
      }
    },
    'El Juglar': {
      apply: (hand, context) => {
        hand.forEach(card => {
          if (card.rank === 'king' || card.rank === 'knight') {
            context.multiplier *= 2;
          }
        });
      }
    },
    'El Ahorrador': {
      apply: (hand, context) => {
        context.multiplier += 2 * Math.floor(context.chips / 5);
      }
    },
    'El Caballista': {
      apply: (hand, context) => {
        hand.forEach(card => {
          if (card.rank === 'knight') {
            context.multiplier += 13;
          }
        });
      }
    },
    'El Acróbata': {
      apply: (hand, context) => {
        context.chips += 250;
        context.handSize -= 2;
      }
    },
    'El Dúo': {
      apply: (hand, context) => {
        if (context.handType === 'Pareja') {
          context.multiplier *= 2;
        }
      }
    },
    'El Trío': {
      apply: (hand, context) => {
        if (context.handType === 'Trío') {
          context.multiplier *= 3;
        }
      }
    },
    'La Familia': {
      apply: (hand, context) => {
        if (context.handType === 'Póker') {
          context.multiplier *= 4;
        }
      }
    },
    'La Orden': {
      apply: (hand, context) => {
        if (context.handType === 'Escalera') {
          context.multiplier *= 3;
        }
      }
    },
    'La Tribu': {
      apply: (hand, context) => {
        if (context.handType === 'Color') {
          context.multiplier *= 2;
        }
      }
    },
    'Punta de Flecha': {
      apply: (hand, context) => {
        hand.forEach(card => {
          if (card.suit === 'espadas') {
            context.chips += 50;
          }
        });
      }
    },
    'Gema en Bruto': {
      apply: (hand, context) => {
        hand.forEach(card => {
          if (card.suit === 'oros') {
            context.chips += 1;
          }
        });
      }
    },
    'Guasón Manchado': {
      apply: (hand, context) => {
        hand.forEach(card => {
          if (card.suit === 'copas') {
            card.suit = 'oros';
          } else if (card.suit === 'bastos') {
            card.suit = 'espadas';
          }
        });
      }
    },
    'El Trapecista': {
      apply: (hand, context) => {
        if (context.isFinalHand) {
          context.multiplier *= 3;
        }
      }
    },
    'El Billete Dorado': {
      apply: (hand, context) => {
        hand.forEach(card => {
          if (card.suit === 'oros') {
            context.chips += 4;
          }
        });
      }
    },
    'La Cromos': {
      apply: (hand, context) => {
        context.multiplier += 1.5 * context.jokerCount;
      }
    },
    'El Guasón Dorado': {
      apply: (hand, context) => {
        context.chips += 4;
      }
    }
  };