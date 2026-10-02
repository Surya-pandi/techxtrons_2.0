-- Replace only the original draft values; preserve content edited by the team.
update public.about set title = 'Great minds. Greater possibilities.'
where title = 'ASSOCIATION TITLE';
update public.about set vision = 'To build a community where curiosity becomes confidence, and students feel empowered to shape what comes next in technology.'
where vision = '[VISION]';
update public.about set mission = 'Bring students together to learn by doing, exchange perspectives, and explore technology through creativity and collaboration.'
where mission = '[MISSION]';
update public.about set objectives = 'Encourage problem-solving, give ideas a platform, celebrate talent, and create connections that continue beyond the event.'
where objectives = '[OBJECTIVES]';
alter table public.settings alter column venue set default 'Venue to be announced';
update public.settings set venue = 'Venue to be announced' where venue = 'EVENT VENUE';
update public.contact set college_name = 'College details to be announced' where college_name = 'COLLEGE NAME';
update public.contact set address = 'Venue and address to be announced' where address = 'EVENT VENUE';
