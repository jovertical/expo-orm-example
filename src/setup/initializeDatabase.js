export default (db) => {
  return new Promise((resolve, reject) => {
    db.exec([{ sql: 'PRAGMA foreign_keys = ON;', args: [] }], false, () => {})

    db.transaction(
      (tx) => {
        tx.executeSql(`
          create table if not exists authors (
            id integer primary key not null,
            name varchar not null,
            bio varchar,
            created_at varchar,
            updated_at varchar
          )
        `)

        tx.executeSql(`
          create table if not exists posts (
            id integer primary key not null,
            author_id unsigned integer not null,
            title varchar not null,
            body varchar,
            created_at varchar,
            updated_at varchar,

            constraint fk_authors
              foreign key (author_id) 
              references authors (id) 
              on delete cascade
          )
        `)

        tx.executeSql(`
          create table if not exists comments (
            id integer primary key not null,
            post_id unsigned integer not null,
            body varchar,
            created_at varchar,
            updated_at varchar,

            constraint fk_posts
              foreign key (post_id) 
              references posts (id) 
              on delete cascade
          )
        `)
      },
      (error) => reject(error),
      () => resolve(),
    )
  })
}
