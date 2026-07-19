-- Ruleaza dupa galerie.sql, direct in Supabase Dashboard -> SQL Editor.
-- Presupune ca fisierele din C:\Users\alxcl\Proiecte\Claude\Poze au fost urcate
-- in bucket-ul `galerie` pastrand EXACT numele lor originale (inclusiv spatii,
-- paranteze si extensia) — altfel poza_path nu se va potrivi si poza nu se va incarca.

insert into public.galerie_poze (nume, categorie, poza_path, ordine)
values
  -- Biserica
  ('Biserica Anglicană', 'Biserica', 'Biserica Anglicana.jpeg', 1),
  ('Biserica Anglicană', 'Biserica', 'Biserica Anglicana (2).jpeg', 2),
  ('Biserica Icoanei', 'Biserica', 'Biserica Icoanei.jpeg', 3),
  ('Catedrala Sf. Iosif', 'Biserica', 'Catedrala Sf Iosif.jpg', 4),
  ('Schitul Darvari', 'Biserica', 'Schitul Darvari.jpeg', 5),
  ('Schitul Darvari', 'Biserica', 'IMG_3845.jpeg', 6),

  -- Cladire
  ('Casa de Modă', 'Cladire', 'Casa de moda.jpeg', 1),

  -- Muzeu
  ('Casa Melik (Muzeul Theodor Pallady)', 'Muzeu', 'Casa theodor pallady.jpg', 1),

  -- Palat
  ('Palatul Maurice Blank', 'Palat', 'Palatul Maurice Blank.jpeg', 1),
  ('Palatul Ghica Victoria', 'Palat', 'IMG_3986.jpeg', 2),

  -- Parc
  ('Parcul Ioanid', 'Parc', 'Parcul Ioanid.jpg', 1),

  -- Strada
  ('Strada Dumbrava Roșie', 'Strada', 'Str. Dumbrava Rosie.jpg', 1),

  -- Loc insolit
  ('Toboganul din beton', 'Loc insolit', 'Toboganul de beton.jpg', 1);
