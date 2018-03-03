DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id SERIAL primary key,
  first VARCHAR(300),
  last VARCHAR(300),
  email VARCHAR(300) not null unique,
  hashedpassword VARCHAR(300) not null,
  pic TEXT,
  bio TEXT,
  created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE friend_request (
    id SERIAL primary key,
    sender_id INTEGER not null,
    recipient_id INTEGER not null,
    status INTEGER,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
0 = none
1 = pending
2 = friend


SELECT users.first AS user_first, users.last AS user_last, 
        profiles.age AS profiles_age, profiles.city AS profiles_city
        FROM signature
        LEFT JOIN users
        ON users.id = signature.user_id 
        LEFT JOIN profiles
        ON users.id = profiles.user_id;

SELECT users.first AS user_first, users.last AS user_last, 
        profiles.age AS profile_age, profiles.city AS profile_city, profiles.homepage AS profile_homepage
        FROM signature
        LEFT JOIN users
        ON users.id = signature.user_id 
        LEFT JOIN profiles
        ON users.id = profiles.user_id

INSERT INTO friend_request (sender_id, recipient_id, status) VALUES (4, 9, 2);

DELETE FROM riend_request WHERE condition;

const PENDING = 1, ACCEPTED = 2;

const q = `
    SELECT users.id, first, last, image, status
    FROM friend_requests
    JOIN users
    ON (status = ${PENDING} AND recipient_id = $1 AND requester_id = users.id)
    OR (status = ${ACCEPTED} AND recipient_id = $1 AND requester_id = users.id)
    OR (status = ${ACCEPTED} AND requester_id = $1 AND recipient_id = users.id)
`;




