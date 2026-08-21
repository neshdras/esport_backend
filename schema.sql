-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.Users (
  id_user bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name_user character varying NOT NULL,
  email_user character varying NOT NULL UNIQUE,
  pass_user character varying NOT NULL,
  picture_user character varying,
  fk_id_role bigint NOT NULL DEFAULT '2'::smallint,
  CONSTRAINT Users_pkey PRIMARY KEY (id_user),
  CONSTRAINT Users_fk_id_role_fkey FOREIGN KEY (fk_id_role) REFERENCES public.Role(id_role)
);
CREATE TABLE public.Role (
  id_role bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name_role character varying NOT NULL UNIQUE,
  CONSTRAINT Role_pkey PRIMARY KEY (id_role)
);
CREATE TABLE public.Teams (
  id_team bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name_team character varying NOT NULL UNIQUE,
  fk_id_user bigint NOT NULL,
  CONSTRAINT Teams_pkey PRIMARY KEY (id_team),
  CONSTRAINT Teams_fk_id_user_fkey FOREIGN KEY (fk_id_user) REFERENCES public.Users(id_user)
);
CREATE TABLE public.Teams_has_Users (
  fk_id_team bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  fk_id_user bigint NOT NULL,
  CONSTRAINT Teams_has_Users_pkey PRIMARY KEY (fk_id_team, fk_id_user),
  CONSTRAINT Teams has Users_fk_id_team_fkey FOREIGN KEY (fk_id_team) REFERENCES public.Teams(id_team),
  CONSTRAINT Teams has Users_fk_id_user_fkey FOREIGN KEY (fk_id_user) REFERENCES public.Users(id_user)
);
CREATE TABLE public.Tournaments (
  id_tournament bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name_tournament character varying NOT NULL,
  game_tournament character varying NOT NULL,
  date_tournament timestamp with time zone NOT NULL,
  rule_tournament text,
  fk_id_user bigint NOT NULL,
  CONSTRAINT Tournaments_pkey PRIMARY KEY (id_tournament),
  CONSTRAINT Tournaments_fk_id_user_fkey FOREIGN KEY (fk_id_user) REFERENCES public.Users(id_user)
);
CREATE TABLE public.Tournaments_has_Teams (
  fk_id_tournament bigint NOT NULL,
  fk_id_team bigint NOT NULL,
  CONSTRAINT Tournaments_has_teams_fk_id_tournament_fkey FOREIGN KEY (fk_id_tournament) REFERENCES public.Tournaments(id_tournament),
  CONSTRAINT Tournaments_has_teams_fk_id_team_fkey FOREIGN KEY (fk_id_team) REFERENCES public.Teams(id_team)
);