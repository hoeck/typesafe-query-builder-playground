import { PGlite } from "@electric-sql/pglite";

const db = new PGlite();

// expose db via global var to playground-database module
(window as any).db = db;

const script = `
--
-- Classic Console Games Inventory:
-- Manufacturers 1-* Systems *-* Games *-1 Franchises
--

CREATE SCHEMA classicgames;

CREATE TABLE classicgames.manufacturers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT NOT NULL
);

INSERT INTO classicgames.manufacturers
  (id, name, country)
VALUES
  (1, 'Sega', 'Japan'),
  (2, 'Nintendo', 'Japan'),
  (3, 'Atari', 'USA');

SELECT pg_catalog.setval('classicgames.manufacturers_id_seq', 4, false);

CREATE TABLE classicgames.systems (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  year INT,
  manufacturer_id INT NOT NULL,
  FOREIGN KEY (manufacturer_id) REFERENCES classicgames.manufacturers(id)
);

INSERT INTO classicgames.systems
  (id, name, year, manufacturer_id)
VALUES
  (1, 'Master System', 1985, 1),
  (2, 'Genesis', 1988, 1),
  (3, 'Game Gear', 1990, 1),
  (4, 'NES', 1983, 2),
  (5, 'SNES', 1990, 2),
  (6, 'Game Boy', 1989, 2),
  (7, 'Atari 2600', 1977, 3);

SELECT pg_catalog.setval('classicgames.systems_id_seq', 8, false);

CREATE TABLE classicgames.franchises (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  manufacturer_id INT,
  FOREIGN KEY (manufacturer_id) REFERENCES classicgames.manufacturers(id)
);

INSERT INTO classicgames.franchises
  (id, name, manufacturer_id)
VALUES
  (1, 'Ultima', NULL),
  (2, 'Sonic', 1),
  (3, 'Mario', 2);

SELECT pg_catalog.setval('classicgames.franchises_id_seq', 4, false);

CREATE TABLE classicgames.games (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  urls JSON,
  franchise_id INT,
  FOREIGN KEY (franchise_id) REFERENCES classicgames.franchises(id)
);

INSERT INTO classicgames.games
  (id, title, franchise_id, urls)
VALUES
  (1, 'Sonic the Hedgehog', 2, '{"wiki": "https://de.wikipedia.org/wiki/Sonic_the_Hedgehog_(1991)", "misc": "https://www.sega.com/games/sonic-hedgehog"}'),
  (2, 'Super Mario Land', 3, NULL),
  (3, 'Super Mario Bros', 3, NULL),
  (4, 'Ultima IV', 1, '{"wiki": "https://en.wikipedia.org/wiki/Ultima_IV:_Quest_of_the_Avatar"}'),
  (5, 'Virtua Racing', NULL, '{"wiki":"https://en.wikipedia.org/wiki/Virtua_Racing","ign":"https://www.ign.com/games/virtua-racing"}'),
  (6, 'Laser Blast', NULL, '{"wiki": "https://en.wikipedia.org/wiki/Laser_Blast"}');

SELECT pg_catalog.setval('classicgames.games_id_seq', 7, false);

CREATE TABLE classicgames.games_systems (
  game_id INT NOT NULL,
  system_id INT NOT NULL,
  release_date TIMESTAMPTZ,
  played BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (game_id, system_id),
  FOREIGN KEY (game_id) REFERENCES classicgames.games(id),
  FOREIGN KEY (system_id) REFERENCES classicgames.systems(id)
);

INSERT INTO classicgames.games_systems
  (game_id, system_id, release_date, played)
VALUES
  -- sonic
  (1, 1, '1991-10-25', true), -- sms
  (1, 2, '1991-07-26', true), -- genesis
  (1, 3, null        , true), -- gg
  -- mario land
  (2, 6, '1989-04-21', true), -- gb
  -- mario bros
  (3, 4, '1983-07-14', false), -- nes
  -- ultima iv
  (4, 1, '1990-01-01', true), -- sms
  (4, 4, '1990-01-01', false), -- nes
  -- virtua racing
  (5, 2, '1994-08-18', true), -- genesis
  -- laser blast
  (6, 7, '1981-03-01', true); -- 2600

-- a table for a discriminated union type
CREATE TABLE classicgames.devices (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  system_id INT, -- console, dedicatedConsole
  revision INT, -- console
  games_count INT, -- dedicatedConsole
  url TEXT -- emulator
);

INSERT INTO classicgames.devices
  (id, name, type, system_id, revision, games_count, url)
VALUES
  (1, 'Master System',       'console',             1,    1, null, null),
  (2, 'Master System II',    'console',             1,    2, null, null),
  (3, 'Sega Genesis Mini',   'dedicatedConsole',    2, null,   42, null),
  (4, 'NES Classic Edition', 'dedicatedConsole',    4, null,   30, null),
  (5, 'Fusion',              'emulator',         null, null, null, 'https://www.carpeludum.com/kega-fusion/'),
  (6, 'Gens',                'emulator',         null, null, null, 'http://gens.me/');

SELECT pg_catalog.setval('classicgames.devices_id_seq', 7, false);
`;

async function loadExampleDatabase() {
  const statements = script.split(";");

  try {
    console.log("loading example database");

    for (let i = 0; i < statements.length; i++) {
      console.log("statement", i + 1, "of", statements.length);

      await db.query(statements[i]);
    }

    console.log("done");
  } catch (e) {
    console.error("error");
  }
}

loadExampleDatabase();
