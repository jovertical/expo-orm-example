import { Model } from 'expo-orm'

export default class Post extends Model {
  table = 'posts'

  fillable = ['author_id', 'title', 'body']
}
