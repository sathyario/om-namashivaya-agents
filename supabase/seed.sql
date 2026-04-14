-- Sample products for testing
-- Run after 001_initial_schema.sql

insert into products (category_id, name, description, price_retail, price_wholesale, stock_quantity, unit) values
  -- Electronics
  (1, 'AA Battery (Single)',     'Standard AA alkaline battery',          10,   8,    200, 'piece'),
  (1, 'AA Battery (Pack of 4)',  '4-pack AA alkaline batteries',          35,   28,   80,  'pack'),
  (1, 'AAA Battery (Single)',    'Standard AAA alkaline battery',         10,   8,    150, 'piece'),
  (1, 'Inverter Battery 150Ah',  'Tall tubular inverter battery 150Ah',   8500, 7800, 5,   'piece'),
  (1, 'Inverter Battery 100Ah',  'Flat plate inverter battery 100Ah',     5500, 5000, 8,   'piece'),
  (1, 'Electrical Tape',         'Insulation tape 10m roll',              25,   20,   100, 'piece'),
  (1, 'Tester (Screwdriver)',    'Neon indicator tester screwdriver',     30,   25,   60,  'piece'),
  (1, 'Wire (1.5mm, 10m)',       '1.5mm copper wire 10 metre roll',       120,  100,  30,  'roll'),
  -- Food (Pirangoon)
  (2, 'Pure Cow Ghee 500ml',     'Pure desi cow ghee in glass jar',       350,  320,  40,  'jar'),
  (2, 'Pure Cow Ghee 1 Litre',   'Pure desi cow ghee 1 litre jar',        680,  620,  25,  'jar'),
  (2, 'Groundnut Oil 1L',        'Cold pressed groundnut oil',            180,  160,  35,  'litre'),
  (2, 'Coconut Oil 500ml',       'Pure coconut oil 500ml',                150,  130,  30,  'bottle');
