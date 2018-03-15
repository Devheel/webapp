import Immutable from 'immutable'
import { ASSETS } from '../constants/mapping_types'

// state.json.assets.xxx
export const selectAssets = state => state.json.get(ASSETS, Immutable.Map())

export default selectAssets
