enum ScryfallObject {
  CARD = 'card',
  // CARD_FACE = 'card_face',
  // LIST = 'list',
}

interface ScryfallCard {
  artist: string;
  name: string;
  object: ScryfallObject.CARD;
  set: string;
  set_name: string;
}
