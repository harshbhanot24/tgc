import { combineReducers } from 'redux'
import user from './user'
import register from './register'
import card from './card'
import buy from './buy'
import transfer from './transfer'
import profile from './profile'
import temp from './temp'

export default combineReducers({
  user,
  register,
  card,
  buy,
  transfer,
  profile,
  temp
})
