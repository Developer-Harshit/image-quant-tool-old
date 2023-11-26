import {
  component$,
  useStore,
  useSignal,
  useVisibleTask$,
  $,
} from '@builder.io/qwik'
import Manipulator from './main'
export default component$(() => {
  const loaded = useSignal(false)
  const loop = useSignal(false)
  const finished = useSignal(false)

  const store = useStore({
    palette: [
      '#003049',
      '#d62827',
      '#f77f00',
      '#fdbf49',
      '#eae2b7',

      '#173f5f',
      '#20639b',
      '#3caea3',
      '#f6d55c',
      '#ed553b',
    ],
    loaded,
    loop,
    finished,
  })

  const removeColor = $((e) => {
    let col = e.target.getAttribute('data-color')
    const index = store.palette.indexOf(col)
    // only splice array when item is found
    if (index > -1) store.palette.splice(index, 1) // 2nd parameter means remove one item only
  })
  const addColor = $((e) => {
    let col = e.target.value

    store.palette.push(col)
    // only splice array when item is found
  })
  const handleUpload = $((e) => {
    if (e.target.files.length > 0) {
      const imageElement = document.getElementById('sample') as HTMLImageElement
      if (imageElement)
        imageElement.src = URL.createObjectURL(e.target.files[0])
    }
    e.value = null
  })

  useVisibleTask$(() => {
    const manipulator = new Manipulator('sample', store, 2)
    const startButtom = document.getElementById('start-btn')

    startButtom.addEventListener('click', () => {
      console.log('starting')
      manipulator.init()
      manipulator.animate()
    })
  })

  return (
    <>
      <div>
        <h2>Palette</h2>
        <ul>
          {store.palette.map((col) => (
            <li
              class="colordiv"
              data-color={col}
              onClick$={removeColor}
              style={`background-color:${col}`}
            >
              {col}
            </li>
          ))}

          <label for="colorinput" id="colorlabel">
            <input
              class="none"
              id="colorinput"
              type="color"
              onChange$={addColor}
            />
          </label>
        </ul>
      </div>
      <div>
        <h2>Controls</h2>
        <input
          class="none"
          type="file"
          id="img"
          accept="image/*"
          onChange$={handleUpload}
        />
        <button id="input-btn">
          <label for="img">Select a image</label>
        </button>
        <button class={!loaded.value && 'none'} id="start-btn">
          Start
        </button>
      </div>
      <div>
        <h2>image</h2>

        <img id="sample" src="/samples/sample.jpg" />
        {finished.value && (
          <h2>
            <a href="#" download="output.png" id="download-sample">
              Download
            </a>
          </h2>
        )}
      </div>
    </>
  )
})
