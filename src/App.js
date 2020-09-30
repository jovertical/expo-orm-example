import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import * as SQLite from 'expo-sqlite'
import { QueryBuilder } from 'expo-orm'
import initializeDatabase from './setup/initializeDatabase'
import seedPosts from './setup/seedPosts'

const db = SQLite.openDatabase('example.db')

export default function App() {
  const [posts, setPosts] = React.useState([])

  async function fetchPosts() {
    const query = new QueryBuilder(db)
    const posts = await query.selectAll('posts')

    setPosts(posts)
  }

  React.useEffect(() => {
    const bootstrap = async () => {
      await initializeDatabase(db)
      await seedPosts(db)
      fetchPosts()
    }

    bootstrap()
  }, [])

  return (
    <View style={styles.container}>
      {posts.map((post) => (
        <View key={post.id} style={styles.post}>
          <Text style={styles.title}>{post.title}</Text>
          <Text>{post.body}</Text>
        </View>
      ))}

      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  post: {
    marginBottom: 10,
  },

  title: {
    fontWeight: 'bold',
    fontSize: 18,
  },
})
