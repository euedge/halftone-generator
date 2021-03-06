import JSZip from 'jszip'
import saveAs from 'file-saver';
import Store from './../store'
import preview from './../components/preview.vue'
import Vue from 'vue'
import { PROJECT_STATES, IMAGE_SIZES } from './../cfg/constants.js'

function imageSaver(options) {
  let promises1 = []
  let promises2 = []

  const zip = new JSZip();
  let folder = zip.folder(Store.state.generator.projectName)

  let result = createCanvasList()
  let compList = result.compList
  let canvasPromises = result.promises

  Promise.all(canvasPromises).then((canvases) => {
    let exportSizes = Object.keys(IMAGE_SIZES).filter(defSize =>
      options.exportSizes[defSize]).map(selected =>
      IMAGE_SIZES[selected])

    canvases.forEach((c) => {
      let canvas = c.canvas
      let canvasName = canvas.getAttribute('name')
      let aspect = canvas.width / canvas.height

      promises1.push(new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          resolve({
            url: url,
            canvasName: canvasName,
            aspect: aspect
          })
        })
      }))
    })

    compList.forEach((comp) => {
      comp.$destroy()
    })

    Promise.all(promises1).then((canvasData) => {
      canvasData.forEach((canvasData) => {
        exportSizes.forEach((size) => {
          promises2.push(new Promise((resolve, reject) => {
            let img = new Image()
            img.src = canvasData.url

            let width = Math.round(size * canvasData.aspect)
            let height = size
            let copy = document.createElement('canvas')

            copy.width = width
            copy.height = height
            let ctx = copy.getContext('2d')

            img.onload = function() {
              ctx.fillStyle = 'rgba(0, 0, 0, 0)'
              ctx.drawImage(this, 0, 0, width, height)
              copy.toBlob((blob) => {
                resolve({
                  name: `${canvasData.canvasName}/${canvasData.canvasName}_${width}x${height}`,
                  data: blob
                })
              })
            }
          }))
        })
      })

      Promise.all(promises2).then((values) => {
        let extension = Store.state.generator.fileFormat
        values.forEach((val) => {
          folder.file(`${val.name}.${extension}`, val.data);
        })

        folder.file('config.json', JSON.stringify(Store.state))
        zip.generateAsync({type: 'blob'}).then((content) => {
          saveAs(content, `decent_generator.zip`);
        })
      })
    })
  })
}

function createCanvasList () {
  let generatorType = Store.state.generator.generatorType
  let compList = []
  let data = generatorType === 'logo' ? Object.keys(PROJECT_STATES) : [ generatorType] // TODO refact
  let promises = []

  const createComp = (name, data, transparent) => {
    let comp = getComponent(name, data, transparent)
    compList.push(comp)
    promises.push(comp.drawed)
  }

  data.forEach((c) => {
    let name = generatorType === 'logo' ? `${generatorType}_${c}` : c
    createComp(name, PROJECT_STATES[c], false)
    if (Store.state.generator.alphaExport) {
      createComp(`${name}_alpha`, PROJECT_STATES[c], true)
    }
  })
  return {
    compList: compList,
    promises: promises
  }

  function getComponent(name, project, transparent) {
    return new Vue({
      ...preview,
      propsData: {
        exportZoom: 5,
        name: name,
        project: project,
        transparent: transparent
      },
      store: Store
    }).$mount()
  }
}

export default imageSaver
