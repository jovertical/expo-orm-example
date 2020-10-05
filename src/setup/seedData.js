export default (db) => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        const now = new Date().toISOString()

        tx.executeSql('select * from authors', [], (_, results) => {
          if (results.rows.length > 0) return

          tx.executeSql(
            'insert into authors (name, bio, created_at, updated_at) values (?, ?, ?, ?)',
            ['John', 'Doe', now, now],
          )
        })

        tx.executeSql('select * from posts', [], (_, results) => {
          if (results.rows.length > 0) return

          tx.executeSql(
            'insert into posts (author_id, title, body, created_at, updated_at) values (1, ?, ?, ?, ?)',
            ['My first post', 'Lorem ipsum dolor sit ament.', now, now],
          )

          tx.executeSql(
            'insert into posts (author_id, title, body, created_at, updated_at) values (1, ?, ?, ?, ?)',
            ['My second post', 'Lorem ipsum dolor sit ament.', now, now],
          )
        })
      },
      (error) => reject(error),
      () => resolve(),
    )
  })
}
