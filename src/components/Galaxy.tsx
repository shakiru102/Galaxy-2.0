
import { RootState, useFrame, useLoader, useThree } from '@react-three/fiber'
import { useEffect, useState } from 'react'
import * as dat from 'dat.gui'
import * as THREE from 'three'

export interface IGuiProperties {
  particles: number;
  radius: number;
  size: number;
  branches: number;
  curve: number; 
  randomness: number;
  insideColor: string;
  outsideColor: string;
}
import Star from '../assets/images/star_01.png'

const gui = new dat.GUI()
let points: THREE.Points , geometry: THREE.BufferGeometry , material: THREE.PointsMaterial

let envGeometry: THREE.BufferGeometry, envMaterial: THREE.PointsMaterial, envPoints: THREE.Points



const Galaxy = () => {

  const [ galaxy, setGalaxy ] = useState<IGuiProperties>({
    size: 0.07,
    particles: 4000,
    radius: 4,
    branches: 3,
    curve: 0.5,
    randomness: 4,
    insideColor: '#b06b1f',
    outsideColor: '#2347c8'
  })

  const textureLoader = new THREE.TextureLoader()
  const star = textureLoader.load(Star)
  const { scene, clock } = useThree()
  const handleSceneUpdate = (name: any, value: any) => setGalaxy(prev => ({...prev, [name]: value}))
  const renderGalaxy = () => {

    if(points && geometry && material) {
        geometry.dispose()
        material.dispose()
        scene.remove(points)
    }

    geometry = new THREE.BufferGeometry()
    material = new THREE.PointsMaterial()
    material.color = new THREE.Color('white')
    material.size = galaxy.size
    material.vertexColors = true
    material.blending =  THREE.AdditiveBlending
    material.sizeAttenuation = true
    material.map = star
    material.depthWrite = false
   
    const colorInside = new THREE.Color(galaxy.insideColor)
    const colorOutside = new THREE.Color(galaxy.outsideColor)

    const particles = new Float32Array(galaxy.particles * 3)
    const colors = new Float32Array(galaxy.particles * 3)

    for (let i = 0; i < galaxy.particles; i++) {
        const i3 = i * 3

        const radius = Math.random() * galaxy.radius
        const branches = (i % galaxy.branches) / galaxy.branches * Math.PI * 2
        const spinAngle = radius * galaxy.curve

        const randomX = Math.pow(Math.random(), galaxy.randomness) * (Math.random() < 0.5 ? -1 : 1)
        const randomY = Math.pow(Math.random(), galaxy.randomness) * (Math.random() < 0.5 ? -1 : 1)
        const randomZ = Math.pow(Math.random(), galaxy.randomness) * (Math.random() < 0.5 ? -1 : 1)

        particles[i3] = Math.cos(branches + spinAngle) * radius + randomX
        particles[i3 + 1] = randomY
        particles[i3 + 2] =  Math.sin(branches + spinAngle) * radius + randomZ
         
        let mixedColor = colorInside.clone()
        mixedColor.lerp(colorOutside, radius / galaxy.radius)

        colors[i3] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b


    }

    geometry.setAttribute(
        'color',
        new THREE.BufferAttribute(colors, 3)
    )

    geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(particles, 3)
    )

    points = new THREE.Points(
        geometry,
        material
    )
    scene.add(points)
  }
 const [previousTime, setPreviousTime] = useState<number>(0)
  useFrame(() => {
    if(geometry && material && points){
       const currentTime = clock.getElapsedTime()
       const deltaTime = currentTime - previousTime
       setPreviousTime(currentTime)

       points.rotation.y = points.rotation.y  + deltaTime * 0.1
    }
  })

  useEffect(() => {
    renderGalaxy()
  },[galaxy])

  useEffect(() => {

    // ENVIROMENT INSTANCE
    envGeometry = new THREE.BufferGeometry()
    envMaterial = new THREE.PointsMaterial()
    envPoints = new THREE.Points(envGeometry, envMaterial)
    
    const count = 1000
    const stars = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
        let i3 = i * 3
        
        stars[i3] = (Math.random() - 0.5)  * 30
        stars[i3 + 1] = (Math.random() - 0.5)  * 30
        stars[i3 + 2] = (Math.random() - 0.5)  * 30
    }

    envGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(stars, 3)
    )

    envMaterial.size = 0.2
    envMaterial.color = new THREE.Color('white')
    envMaterial.map = star
    envMaterial.depthWrite = false
   envPoints.scale.set(4, 4, 4)
    scene.add(envPoints)

   

  },[])

  useEffect(() => {
//    Particles
    gui
    .add(galaxy, 'particles').min(1000).max(10000).step(100).onFinishChange(() => handleSceneUpdate('particles', galaxy.particles))
//   Size
gui
    .add(galaxy, 'size').min(0.02).max(0.6).step(0.001).onFinishChange(() => handleSceneUpdate('size', galaxy.size)) 

//  radius
gui
.add(galaxy, 'radius').min(1).max(10).step(0.05).onFinishChange(() => handleSceneUpdate('radius', galaxy.radius)) 

//  branches
gui
.add(galaxy, 'branches').min(2).max(8).step(1).onFinishChange(() => handleSceneUpdate('branches', galaxy.branches)) 

// SpinAngle
gui
.add(galaxy, 'curve').min(-4).max(4).step(0.05).onFinishChange(() => handleSceneUpdate('curve', galaxy.curve)) 

//  randomness
gui
.add(galaxy, 'randomness').min(1).max(10).step(1).onFinishChange(() => handleSceneUpdate('randomness', galaxy.randomness)) 

//  Color Inside
gui
.addColor(galaxy, 'insideColor').onFinishChange(() => handleSceneUpdate('insideColor', galaxy.insideColor)) 

//  Color Outside
gui
.addColor(galaxy, 'outsideColor').onFinishChange(() => handleSceneUpdate('outsideColor', galaxy.outsideColor)) 
    return () => gui.destroy()
  },[])

  return null
}

export default Galaxy