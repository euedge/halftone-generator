import TEMPLATES from './../templates'

function dataTransform (grid, paintNum, radius, direction, logo) {
  let data = {
    0: [], // empty
    1: [], // random dot
    2: [], // fix dot
    3: [], // paint
    logo: []
  }

  grid.forEach((line, yi) => {
    line.forEach((item, xi) => {
      data[item].push({
        x: xi,
        y: yi,
        size: (Math.random() * (radius*2 - radius/2)) + radius/2
      })
    })
  })

  paintNum = paintNum <= data['1'].length ? paintNum : data['1'].length
  let selectedNum = 0

  if (logo) {
    selectProjectDots(data, direction)
    while (data['1'].length) {
      select()
    }
  } else {
    while (selectedNum < paintNum) {
      select()
    }
  }

  function select () {
    let index = Math.round(Math.random() * (data['1'].length-1))
    let selected = data['1'][index]

    if (selected) {
      let pair = findPair(data,selected, direction)

      if (pair) {
        selected.pair = pair
        selectedNum += 1

        data['3'].push(selected)
        data['1'].splice(index, 1)
      }
    }
  }

  console.log(data, 'transformData');
  return data
}

function selectProjectDots (data, direction) {
  for (let d = 0; d < 5; d++) {
    let index = Math.round(Math.random() * (data['1'].length-1))
    let item = data['1'][index]

    if (item) {
      let pair = findPair(data, item, direction)
      console.log(pair, 'pair');
      if (pair) {
        item.pair = pair
        data['logo'].push(item)
        data['1'].splice(index, 1)
      }
    }
  }
}

function findPair (data, selected, direction) {
  let directions = [-1, 1]
  let pair = {}
  let cx = Math.round(Math.random())
  let cy = Math.round(Math.random())

  if(direction === 'diagonal') {
    pair.x = selected.x + directions[cx]
    pair.y = selected.y + directions[cy]
  } else if (direction === 'vertical') {
    pair.x = selected.x
    pair.y = selected.y + directions[cy]
  } else if (direction === 'horizontal') {
    pair.x = selected.x + directions[cx]
    pair.y = selected.y
  }

  let includes = data.logo.find(item => item.x === pair.x && item.y === pair.y)

  return !includes ? pair : null
}


export default dataTransform
