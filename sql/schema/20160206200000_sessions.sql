
create table sessions (
    id uuid primary key,
    app_token varchar(255) not null unique,
    provider varchar(45),
    provider_token varchar(256),
    is_active boolean not null default false,
    created_at timestamp,
    updated_at timestamp
);
