import './App.css'
import { Canvas, RootState } from '@react-three/fiber'
import { Suspense } from 'react'
import { OrbitControls } from '@react-three/drei'
import Galaxy from './components/Galaxy'



function App() {

  return (
    <div>
      <Canvas
    id='webgl'
    onCreated={(state: RootState) => {
      state.gl.setClearColor('black')
    }}
    camera={{
      position: [0, 2, -5]
    }}
    >
     <Suspense fallback={<div>loading....</div>}>
     <OrbitControls 
     enableZoom={false} 
     minAzimuthAngle={ Math.PI * 0.5 } 
     maxAzimuthAngle={Math.PI }
     minPolarAngle={Math.PI * 0.25}
     maxPolarAngle={Math.PI * 0.5}
     />
         <Galaxy />
     </Suspense>
    </Canvas>
    {/* <DatGUi data={galaxy} onUpdate={handleUpdates}>
      <DatString path='package' label='package' />
      <DatNumber path='particles' min={1000} max={5000} step={100} />
    </DatGUi> */}
    </div>
  )
}

export default App
