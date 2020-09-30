export default (db) => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql('select * from posts', [], (_, results) => {
          if (results.rows.length > 0) return

          const now = '2020-09-30 00:00:00'

          tx.executeSql(
            'insert into posts (title, body, created_at, updated_at) values (?, ?, ?, ?)',
            ['My first post', 'Lorem ipsum dolor sit ament.', now, now],
          )

          tx.executeSql(
            'insert into posts (title, body, created_at, updated_at) values (?, ?, ?, ?)',
            ['My second post', 'Lorem ipsum dolor sit ament.', now, now],
          )
        })
      },
      (error) => reject(error),
      () => resolve(),
    )
  })
}
