import { StatusBar } from 'expo-status-bar'
import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  TouchableOpacity,
} from 'react-native'
import * as SQLite from 'expo-sqlite'
import { QueryBuilder } from 'expo-orm'
import initializeDatabase from './setup/initializeDatabase'
import seedPosts from './setup/seedPosts'

const db = SQLite.openDatabase('example.db')

export default function App() {
  const [posts, setPosts] = React.useState([])
  const [title, setTitle] = React.useState('')
  const [body, setBody] = React.useState('')

  async function deletePost(id) {
    const query = new QueryBuilder(db, 'posts')
    await query.where('id', '=', id).delete()
    await fetchPosts()
  }

  async function publish() {
    const query = new QueryBuilder(db, 'posts')
    await query.insert({ title, body })
    await fetchPosts()

    setTitle('')
    setBody('')
  }

  async function fetchPosts() {
    const query = new QueryBuilder(db, 'posts')
    const posts = await query.selectAll()

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
      <View style={styles.form}>
        <TextInput
          placeholder="Title"
          value={title}
          onChangeText={(value) => setTitle(value)}
          style={styles.textInput}
        />

        <TextInput
          placeholder="Body"
          value={body}
          onChangeText={(value) => setBody(value)}
          multiline
          numberOfLines={3}
          style={styles.textInput}
        />

        <Button title="Publish" onPress={publish} />
      </View>

      {posts.map((post) => (
        <TouchableOpacity
          key={post.id}
          onLongPress={() => deletePost(post.id)}
          style={styles.post}
        >
          <Text style={styles.title}>{post.title}</Text>
          <Text>{post.body}</Text>
        </TouchableOpacity>
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

  form: {
    width: '70%',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },

  textInput: {
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: '#718096',
    paddingHorizontal: 12,
    paddingVertical: 5,
  },

  post: {
    width: '70%',
    marginBottom: 10,
  },

  title: {
    fontWeight: 'bold',
    fontSize: 18,
  },
})
