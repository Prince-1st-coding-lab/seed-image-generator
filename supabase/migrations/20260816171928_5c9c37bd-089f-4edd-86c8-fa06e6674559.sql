insert into public.categories (name, slug, description, sort_order)
values ('Decoration Vases', 'decoration-vases', 'Handcrafted wooden vases made purely for decoration — shelves, tables and corners.', 15)
on conflict (slug) do nothing;

with cat as (select id from public.categories where slug = 'decoration-vases'),
ins as (
  insert into public.products (name, slug, category_id, description, price, currency, availability, status, sort_order)
  select v.name, v.slug, cat.id, v.descr, v.price, 'RWF', v.avail, 'published', v.ord
  from cat, (values
    ('Tall Grain Decoration Vase', 'tall-grain-decoration-vase', 'A tall turned vase with a polished walnut grain and a brushed gold rim. Perfect beside a sofa or on a console table.', 45000, 'available', 1),
    ('Trio Decoration Vase Set', 'trio-decoration-vase-set', 'Three carved vases in oak, light beech and mahogany finishes. Sold as a set of three.', 85000, 'available', 2),
    ('Ribbed Round Decoration Vase', 'ribbed-round-decoration-vase', 'A round-bellied vase with hand-carved ribbing in a deep brown finish. A warm centrepiece for a side table.', 60000, 'made_to_order', 3),
    ('Slim Twin Decoration Vases', 'slim-twin-decoration-vases', 'A pair of slim acacia vases on a live-edge wooden base. Beautiful with dried or fresh stems.', 55000, 'available', 4)
  ) as v(name, slug, descr, price, avail, ord)
  on conflict (slug) do nothing
  returning id, slug
)
insert into public.product_images (product_id, storage_path, alt_text, sort_order)
select ins.id, m.path, m.alt, 0
from ins join (values
  ('tall-grain-decoration-vase', 'seed/deco-vase-1.jpg', 'Tall wooden decoration vase with gold rim'),
  ('trio-decoration-vase-set', 'seed/deco-vase-2.jpg', 'Set of three carved wooden decoration vases'),
  ('ribbed-round-decoration-vase', 'seed/deco-vase-3.jpg', 'Round ribbed wooden decoration vase on a side table'),
  ('slim-twin-decoration-vases', 'seed/deco-vase-4.jpg', 'Pair of slim wooden decoration vases with green stems')
) as m(slug, path, alt) on m.slug = ins.slug;

insert into public.gallery_images (storage_path, caption, alt_text, category_id, status)
select m.path, m.cap, m.cap, (select id from public.categories where slug='decoration-vases'), 'published'
from (values
  ('seed/deco-vase-1.jpg', 'Tall grain decoration vase'),
  ('seed/deco-vase-2.jpg', 'Trio decoration vase set'),
  ('seed/deco-vase-3.jpg', 'Ribbed round decoration vase'),
  ('seed/deco-vase-4.jpg', 'Slim twin decoration vases')
) as m(path, cap)
where not exists (select 1 from public.gallery_images g where g.storage_path = m.path);