import { Model } from 'expo-orm'
import Post from './Post'

export default class Author extends Model {
  table = 'authors'

  fillable = ['name', 'bio']

  get posts() {
    return this.hasMany(Post, 'author_id')
  }
}
