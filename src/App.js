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
import { Database } from 'expo-orm'
import initializeDatabase from './setup/initializeDatabase'
import seedPosts from './setup/seedPosts'

const db = SQLite.openDatabase('database.db')

export default function App() {
  const [posts, setPosts] = React.useState([])
  const [currentPost, setCurrentPost] = React.useState(null)
  const [title, setTitle] = React.useState('')
  const [body, setBody] = React.useState('')

  function clear() {
    setTitle('')
    setBody('')
  }

  async function update() {
    await Database.table('posts')
      .where('id', '=', currentPost.id)
      .update({ title, body })

    await fetchPosts()
  }

  async function prepareUpdate(id) {
    const post = await Database.table('posts').find(id)

    setCurrentPost(post)
    setTitle(post.title || '')
    setBody(post.body || '')
  }

  async function destroy(id) {
    await Database.table('posts').where('id', '=', id).delete()
    await fetchPosts()
    clear()
  }

  async function publish() {
    await Database.table('posts').insert({ title, body })
    await fetchPosts()
    clear()
  }

  async function fetchPosts() {
    const posts = await Database.table('posts').get()
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

        {currentPost ? (
          <Button title="Update" onPress={update} />
        ) : (
          <Button title="Publish" onPress={publish} />
        )}
      </View>

      {posts.map((post) => (
        <TouchableOpacity
          key={post.id}
          onPress={() => prepareUpdate(post.id)}
          style={styles.post}
        >
          <View style={styles.header}>
            <Text style={styles.title}>{post.title}</Text>
            <Text onPress={() => destroy(post.id)} style={styles.delete}>
              &times;
            </Text>
          </View>
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

  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontWeight: 'bold',
    fontSize: 18,
  },

  delete: {
    fontSize: 20,
  },
})
