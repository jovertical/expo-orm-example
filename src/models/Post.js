import { Model } from 'expo-orm'

export default class Post extends Model {
  static table = 'posts'
}
