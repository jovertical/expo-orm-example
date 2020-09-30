export default (db) => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql('select * from posts', [], (_, results) => {
          if (results.rows.length > 0) return

          tx.executeSql('insert into posts (title, body) values (?, ?)', [
            'My first post',
            'Lorem ipsum dolor sit ament.',
          ])

          tx.executeSql('insert into posts (title, body) values (?, ?)', [
            'My second post',
            'Lorem ipsum dolor sit ament.',
          ])
        })
      },
      (error) => reject(error),
      () => resolve(),
    )
  })
}
