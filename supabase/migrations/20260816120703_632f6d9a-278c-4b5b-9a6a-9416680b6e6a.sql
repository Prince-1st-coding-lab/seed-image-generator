INSERT INTO public.products (name, slug, category_id, description, price, currency, availability, status, sort_order) VALUES
  ('Mahogany Table Vase','mahogany-table-vase',(SELECT id FROM public.categories WHERE slug='wooden-vases'),'A hand-turned mahogany vase with a smooth oiled finish, sized for dining tables and shelves.',45000,'RWF','available','published',1),
  ('Ash Corner Vase','ash-corner-vase',(SELECT id FROM public.categories WHERE slug='corner-wooden-vases'),'A tall floor vase turned from ash, shaped to stand well in a room corner.',85000,'RWF','made_to_order','published',2),
  ('Walnut TV Stand','walnut-tv-stand',(SELECT id FROM public.categories WHERE slug='tv-stands'),'A low walnut TV stand with open shelving for consoles, boxes and books.',320000,'RWF','available','published',3),
  ('Oak Dining Table','oak-dining-table',(SELECT id FROM public.categories WHERE slug='dining-tables'),'A solid oak dining table for six, built with a thick top and tapered legs.',520000,'RWF','made_to_order','published',4),
  ('Woven Seat Bench','woven-seat-bench',(SELECT id FROM public.categories WHERE slug='living-room'),'A two-seater bench with a mahogany frame and hand-woven seat and back.',280000,'RWF','available','published',5),
  ('Teak Side Table','teak-side-table',(SELECT id FROM public.categories WHERE slug='side-tables'),'A compact teak side table that fits beside a sofa or armchair.',95000,'RWF','available','published',6),
  ('Oak Bedside Table','oak-bedside-table',(SELECT id FROM public.categories WHERE slug='bedside-tables'),'An oak bedside table with a single drawer and an open lower shelf.',130000,'RWF','available','published',7),
  ('Walnut Console Table','walnut-console-table',(SELECT id FROM public.categories WHERE slug='console-tables'),'A slim walnut console table for hallways and entrances.',210000,'RWF','made_to_order','published',8);

INSERT INTO public.product_images (product_id, storage_path, alt_text, sort_order) VALUES
  ((SELECT id FROM public.products WHERE slug='mahogany-table-vase'),'seed/vase-mahogany.jpg','Hand-turned mahogany table vase',1),
  ((SELECT id FROM public.products WHERE slug='ash-corner-vase'),'seed/corner-vase-ash.jpg','Tall ash corner floor vase',1),
  ((SELECT id FROM public.products WHERE slug='walnut-tv-stand'),'seed/tv-stand-walnut.jpg','Walnut TV stand with open shelving',1),
  ((SELECT id FROM public.products WHERE slug='oak-dining-table'),'seed/dining-table-oak.jpg','Solid oak dining table',1),
  ((SELECT id FROM public.products WHERE slug='woven-seat-bench'),'seed/living-room-bench.jpg','Wooden bench with woven seat',1),
  ((SELECT id FROM public.products WHERE slug='teak-side-table'),'seed/side-table-teak.jpg','Small teak side table',1),
  ((SELECT id FROM public.products WHERE slug='oak-bedside-table'),'seed/bedside-table-oak.jpg','Oak bedside table with drawer',1),
  ((SELECT id FROM public.products WHERE slug='walnut-console-table'),'seed/console-table-walnut.jpg','Walnut console table',1);

INSERT INTO public.gallery_images (storage_path, caption, alt_text, category_id, status, sort_order) VALUES
  ('seed/gallery-lathe.jpg','Turning a vase on the lathe','Craftsman shaping a wooden vase on a lathe',(SELECT id FROM public.categories WHERE slug='wooden-vases'),'published',1),
  ('seed/gallery-vase-lineup.jpg','A batch of vases ready for finishing','Row of finished wooden vases on a workshop bench',(SELECT id FROM public.categories WHERE slug='wooden-vases'),'published',2),
  ('seed/gallery-finishing.jpg','Oiling a table top by hand','Hands applying oil finish to a wooden table top',(SELECT id FROM public.categories WHERE slug='dining-tables'),'published',3),
  ('seed/living-room-bench.jpg','Bench in a finished living room','Wooden bench with woven seat in a living room',(SELECT id FROM public.categories WHERE slug='living-room'),'published',4);