import { ObjectId } from 'mongoose'
import web3 from 'web3'

export const objectIdToBytes24 = (objectId: ObjectId) => {
  return web3.utils.asciiToHex(objectId.toString())
}
