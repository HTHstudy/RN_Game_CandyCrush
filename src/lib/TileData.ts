import {Animated} from 'react-native'
import {ImageObjType} from './Images'

export interface TileDataType {
  key: number
  markedAsMatch: boolean
  location: Animated.ValueXY
  imgObj: ImageObjType | null
  scale: Animated.Value
}

// export function TileData(this: TileDataType, imgObj, key) {
//   this.key = key
//   this.markedAsMatch = false
//   this.location = new Animated.ValueXY()
//   this.imgObj = imgObj
//   this.scale = new Animated.Value(1)
// }

export function TileData(imgObj, key): TileDataType {
  return {
    key: key,
    markedAsMatch: false,
    location: new Animated.ValueXY(),
    imgObj: imgObj,
    scale: new Animated.Value(1),
  }
}
