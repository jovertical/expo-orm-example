export default (db) => {
  return new Promise((resolve, reject) => {
    db.exec([{ sql: 'PRAGMA foreign_keys = ON;', args: [] }], false, () => {})

    db.transaction(
      (tx) => {
        tx.executeSql(`
          create table if not exists posts (
            id integer primary key not null,
            title varchar not null,
            body varchar,
            created_at timestamp not null,
            updated_at timestamp not null
          )
        `)

        tx.executeSql(`
          create table if not exists comments (
            id integer primary key not null,
            post_id unsigned integer not null,
            body varchar,
            created_at timestamp not null,
            updated_at timestamp not null,

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
