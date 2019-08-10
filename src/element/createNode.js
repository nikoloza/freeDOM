'use strict'

import Evt from '../event'
import Err from '../res/error'

import create from './create'
import cacheNode from './cacheNode'

import { exec, registry } from './params'

var createNode = (element) => {
  if (!Evt.can.render(element)) {
    return Err('HTMLInvalidTag')
  }

  // create and assign a node
  var node = cacheNode(element)
  element.node = node

  node.ref = element

  // Apply element parameters
  if (element.tag !== 'string' || element.tag !== 'fragment') {
    for (const param in element) {
      var execParam = exec(element[param], element)

      var registeredParam = registry[param]
      if (registeredParam) {
        if (typeof registeredParam === 'function') {
          registeredParam(execParam, element, node)
        }
      } else if (element.define && element.define[param]) { // Check if it's under `define`
        element[param] = element.define[param](execParam, element)
      } else if (element[param]) {
        create(execParam, element, param)
      }
    }
  }

  // node.dataset.key = key
  return element
}

export default createNode