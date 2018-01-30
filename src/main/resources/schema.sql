
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
    is_archived BOOLEAN DEFAULT false,
    is_flagged BOOLEAN DEFAULT false,
    flagged_by TEXT,
    flagged_on TIMESTAMP,
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


CREATE OR REPLACE FUNCTION submit_vote(in p_idea integer, in p_pidm text, in p_stuff SMALLINT) RETURNS VOID AS '
    BEGIN
        if exists (select 1 from idea_vote where idea_id = p_idea and pidm = p_pidm) then
            update idea_vote set vote_value = p_stuff where idea_id = p_idea and pidm = p_pidm;
        else
            insert into idea_vote (idea_id, pidm, vote_value, voted_at) values (p_idea, p_pidm, p_stuff, now());
        end if;
        update idea_post set vote_count = (select sum(vote_value) from idea_vote where idea_id = p_idea) where idea_id = p_idea;
    END
' LANGUAGE plpgsql
;

CREATE OR REPLACE FUNCTION update_ideas()
  RETURNS void as '
    BEGIN
      update idea_post set (is_archived) = (true) where approved=false and is_archived=false and now() > idea_post.end_vote_date;
    END;
' LANGUAGE plpgsql;
