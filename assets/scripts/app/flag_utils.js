import { FEATURE_FLAGS } from './flag_data'
import { observeStore } from '../store'

// Imported to force updates when state changes
import { createDomFromData } from '../streets/data_model'

export function initializeFlagSubscribers () {
  initLocalStorageUpdateListener()
  initCanvasRectangleUpdateListener()
}

function whatAreTheFlagsWeNeedToSave (flags) {
  // convert to array
  const array = Object.entries(flags)
  // filter out all non-user set flags
  const filter1 = array.filter((item) => item[1].source === 'user')
  // filter out flags that equal default values
  const filter2 = filter1.filter((item) => item[1].value !== FEATURE_FLAGS[item[0]].defaultValue)
  // convert back to obj but simplify it to just the value
  return filter2.reduce((obj, item) => {
    obj[item[0]] = item[1].value
    return obj
  }, {})
}

function initLocalStorageUpdateListener () {
  const select = (state) => state.flags
  const onChange = (flags) => {
    const toSet = whatAreTheFlagsWeNeedToSave(flags)
    window.localStorage.setItem('flags', JSON.stringify(toSet))
  }

  return observeStore(select, onChange)
}

// Listeners to handle app updates for flags that don't have any other way to do it
// todo: try to avoid doing these if possible
function initCanvasRectangleUpdateListener () {
  const select = (state) => state.flags.DEBUG_SEGMENT_CANVAS_RECTANGLES.value
  const onChange = () => { createDomFromData() }

  return observeStore(select, onChange)
}
