
create table if not exists idea_categories
(
    category_id serial primary key,
    category text not null

);

CREATE TABLE if not exists idea_approvers
(
    approver_id serial primary key,
    name TEXT,
    pidm TEXT NOT NULL
);


CREATE TABLE if not exists idea_post
(
    title TEXT NOT NULL,
    description TEXT,
    approved BOOLEAN DEFAULT false,
    created_by TEXT NOT NULL,
    active BOOLEAN DEFAULT false,
    approved_at TIMESTAMP,
    created_at TIMESTAMP,
    start_vote_date TIMESTAMP,
    end_vote_date TIMESTAMP,
    vote_count INTEGER,
    category integer references idea_categories,
    idea_id serial primary key,
    approved_by integer references idea_approvers(approver_id)
);


CREATE TABLE if not exists idea_vote
(
    vote_id serial primary key,
    idea_id integer references idea_post,
    pidm TEXT NOT NULL,
    vote_value SMALLINT DEFAULT 0,
    voted_at TIMESTAMP
);


