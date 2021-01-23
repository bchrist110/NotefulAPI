BEGIN;

INSERT INTO notes (name, content, folderId)
VALUES
    ('Dogs', 'i like content', 2),
    ('Cats', 'so much content', 1),
    ('Pigs', 'give me all the content', 1),
    ('Birds', 'birds are fun i guess', 2),
    ('Bears', 'Bears are too', 2),
    ('Horses', 'What a horse', 1),
    ('Tigers', 'Look at dem stripes', 3),
    ('Wolves', 'woof woof', 3),
    ('Elephants', 'what a trunk goddayum', 1),
    ('Lions', 'manes on manes', 2),
    ('Monkeys', 'ooh ooh ahh ahh', 3),
    ('Bats', 'watch for covid', 2),
    ('Turtles', 'slowly now', 1),
    ('Zebras', 'wow more stripes huh', 1);

COMMIT;