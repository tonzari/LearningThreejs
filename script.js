import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import * as dat from 'dat.gui'
import { Group, Material } from 'three'

/**
 * Debug UI: https://github.com/dataarts/dat.gui
 */
const debugUI = new dat.GUI()

/**
 * Cursor
 */

const cursor = {
    x: 0,
    y: 0
}

window.addEventListener('mousemove', (event) => 
{
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY /sizes.height - 0.5
})


/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Handle window resize
window.addEventListener('resize', () => 
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update aspect ratio
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

window.addEventListener('dblclick', () =>
{
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

    if(!fullscreenElement)
    {
        if(canvas.requestFullscreen)
        {
            canvas.requestFullscreen()
        }
        else if(canvas.webkitFullscreenElement)
        {
            canvas.webkitRequestFullscreen()
        }
    }
    else
    {
        if(document.exitFullscreen)
        {
            document.exitFullscreen()
        }
        else if(document.webkitExitFullscreen)
        {
            document.webkitExitFullscreen()
        }
    }
})

// Scene
const scene = new THREE.Scene()

// Object

// const mesh = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
//     new THREE.MeshBasicMaterial({ color: 0xff0000 })
// )
// scene.add(mesh)

const meshes = []
const group = new Group()


for (let index = 0; index < 20; index++) {
    meshes[index] = new THREE.Mesh(
        new THREE.BoxGeometry(index, index, index, 5, 5, 5),
        new THREE.MeshBasicMaterial({ wireframe: true, color: `rgb(33,0,${(index * 60) + 0})` })
    )
    scene.add(meshes[index])
    group.add(meshes[index])
    meshes[index].position.y += index * 2
    meshes[index].rotation.z = index * 10
}

scene.add(group)
group.position.set(0,0,0)
console.log(group)

// Debug properties
debugUI
    .add(group.position, 'x')
    .min(0)
    .max(10)
    .step(0.01)
    .name('Vortex Position X')
debugUI
    .add(group.position, 'y')
    .min(0)
    .max(10)
    .step(0.01)
    .name('Vortex Position Y')
debugUI
    .add(group.position, 'z')
    .min(0)
    .max(10)
    .step(0.01)
    .name('Vortex Position Z')
debugUI
    .add(group, 'visible')
debugUI
    .add(meshes[4].material, 'wireframe')
debugUI
    .add(meshes[4].material.color, 'r')
    .min(0)
    .max(1)
    .step(0.01)
    .name('First Cube Red Channel')

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)

camera.position.z = 4
scene.add(camera)

// Controls

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // some mobile devices have VERY high pixel ratios (like 4 or 5) and rendering all those pixels is a complete waste!! limit to 2 at most

// Animate
const clock = new THREE.Clock()

const UpdateLoop = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    for (let index = 0; index < meshes.length; index++) {
        meshes[index].rotation.y = elapsedTime * (index / 10 )
    }

    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(UpdateLoop)
}

UpdateLoop()