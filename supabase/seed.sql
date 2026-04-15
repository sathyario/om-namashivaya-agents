-- Real products for Om Namashivaya Agents
-- Run after 001_initial_schema.sql

insert into products (category_id, name, description, price_retail, price_wholesale, stock_quantity, unit, image_url) values

  -- ── Panasonic Batteries ────────────────────────────────────────────────────
  (1,
   'Panasonic Evolta AA Alkaline Battery (Pack of 8)',
   'Panasonic EVOLTA 1.5V AA alkaline batteries. 20x longer lasting than standard zinc-carbon. Anti-leak seal, 10-year power protection.',
   360, 305, 50, 'pack',
   'https://m.media-amazon.com/images/I/71Q7bPQFYDL._SX679_.jpg'),

  (1,
   'Panasonic Evolta AAA Alkaline Battery (Pack of 6)',
   'Panasonic EVOLTA 1.5V AAA alkaline batteries. Long-lasting performance for remote controls, clocks and small devices.',
   180, 153, 50, 'pack',
   'https://m.media-amazon.com/images/I/71Qm+aNQwbL._SX679_.jpg'),

  (1,
   'Panasonic 9V Alkaline Battery',
   'Panasonic 9V alkaline battery (6LR61). Reliable power for smoke detectors, guitar pedals and test equipment.',
   280, 238, 30, 'piece',
   'https://m.media-amazon.com/images/I/61bIPONaFcL._SX679_.jpg'),

  (1,
   'Panasonic Carbon Zinc AAA Battery (Pack of 10)',
   'Panasonic multipurpose 1.5V AAA carbon zinc batteries. Good for low-drain devices like clocks and remotes.',
   140, 119, 80, 'pack',
   'https://m.media-amazon.com/images/I/71pYz9KPGZL._SX679_.jpg'),

  -- ── Eveready Batteries ────────────────────────────────────────────────────
  (1,
   'Eveready Ultima AA Alkaline Battery (Pack of 10)',
   'Eveready Ultima 1.5V AA alkaline batteries. Turbolock technology, 400% longer lasting than regular batteries. Anti-leak.',
   220, 187, 80, 'pack',
   'https://m.media-amazon.com/images/I/71YGxQG0y6L._SX679_.jpg'),

  (1,
   'Eveready Ultima AAA Alkaline Battery (Pack of 10)',
   'Eveready Ultima 1.5V AAA alkaline batteries. Turbolock technology, anti-leak, 400% longer lasting.',
   220, 187, 80, 'pack',
   'https://m.media-amazon.com/images/I/71Cr3AZufsL._SX679_.jpg'),

  (1,
   'Eveready Gold AA Carbon Zinc Battery (Pack of 10)',
   'Eveready 1005 Gold 1.5V AA carbon zinc batteries. Reliable everyday power for torches, clocks and remotes.',
   150, 127, 100, 'pack',
   'https://m.media-amazon.com/images/I/61pbtaC7TgL._SX679_.jpg'),

  (1,
   'Eveready C Size Battery (Single)',
   'Eveready 1.5V C size zinc carbon multipurpose battery (Model 1035). Ideal for torches and lanterns.',
   40, 34, 60, 'piece',
   'https://m.media-amazon.com/images/I/51GJnZCCIFL._SX679_.jpg'),

  (1,
   'Eveready D Size Battery (Single)',
   'Eveready 1.5V D size zinc carbon multipurpose battery. For large torches, radios and emergency lights.',
   45, 38, 60, 'piece',
   'https://m.media-amazon.com/images/I/51HU0BKFTHL._SX679_.jpg'),

  (1,
   'Eveready 9V Battery (Pack of 2)',
   'Eveready 9V zinc carbon batteries — pack of 2. For smoke detectors, clocks, and electronic toys.',
   82, 70, 40, 'pack',
   'https://m.media-amazon.com/images/I/61j0NvPaYKL._SX679_.jpg'),

  (1,
   'Eveready Searchlite DL95 LED Rechargeable Torch',
   'Eveready 4W LED rechargeable torch with 4 lighting modes and emergency sidelight. 6+ hours battery life.',
   999, 490, 15, 'piece',
   'https://m.media-amazon.com/images/I/61wv5wTiOBL._SX679_.jpg'),

  -- ── Healthy Grocer — Perungayam (Hing / Asafoetida) ──────────────────────
  (2,
   'Healthy Grocer Premium Hing Powder 50g',
   'Healthy Grocer premium compounded asafoetida (perungayam) powder. Strong aroma, sourced from trusted farmers. Packed in Tamil Nadu.',
   210, 178, 40, 'pouch',
   'https://m.media-amazon.com/images/I/61G-e8RQTFL._SX679_.jpg'),

  (2,
   'Healthy Grocer Classic Hing Powder 100g',
   'Healthy Grocer compounded hing powder 100g. Classic strong flavour, ideal for daily cooking. Authentic Tamil Nadu sourcing.',
   390, 248, 25, 'pack',
   'https://m.media-amazon.com/images/I/61V9gCpDTGL._SX679_.jpg'),

  (2,
   'Healthy Grocer Hing 25g (Pack of 2)',
   'Healthy Grocer compounded asafoetida 25g x 2 pouches. Convenient small packs for retail customers.',
   120, 100, 30, 'pack',
   null);
