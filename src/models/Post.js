import { Model } from 'expo-orm'
import Author from './Author'

export default class Post extends Model {
  table = 'posts'

  fillable = ['author_id', 'title', 'body']

  get author() {
    return this.belongsTo(Author, 'author_id', 'id')
  }
}
