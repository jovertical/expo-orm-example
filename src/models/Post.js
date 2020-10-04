import { Model } from 'expo-orm'
import { openDatabase } from 'expo-sqlite'

export default class Post extends Model {
  /**
   * The table associated with the model
   */
  table = 'posts'

  /**
   * The attributes that are mass assignable
   */
  fillable = ['title', 'body']
}
