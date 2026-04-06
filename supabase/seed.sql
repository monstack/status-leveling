-- Seed stat categories
insert into public.stat_categories (slug, label, description, icon, color, sort_order)
values
  ('physical',  'Physical Status',  'Fitness, exercise, and health activities', 'physical',  'emerald', 1),
  ('reading',   'Reading Status',   'Books, literature, and study sessions',    'reading',   'amber',   2),
  ('technical', 'Technical Status', 'Coding, cloud, DevOps, and engineering',   'technical', 'blue',    3)
on conflict (slug) do nothing;
