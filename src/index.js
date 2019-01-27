import './css/master.styl'

import Asteroid from './js/Asteroid';
import * as THREE from 'three'
import {MTLLoader, OBJLoader} from 'three-obj-mtl-loader'

const mtlLoader = new MTLLoader()
const objLoader = new OBJLoader()
const textureLoader = new THREE.TextureLoader()
const scene = new THREE.Scene()

//Variables
let velocity = 0

let controlsListeners = {
    z : 0,
    shift : 0,
    s : 0
}

let lifeStatus= 100



//Set the Skybox
const skyBox = {}
skyBox.geometry = new THREE.SphereBufferGeometry(8000, 20, 20)
skyBox.material = new THREE.MeshStandardMaterial({
    map: textureLoader.load('background.jpg'),
    side: THREE.DoubleSide,
})
skyBox.position = (0, 0, 4000)
skyBox.mesh = new THREE.Mesh(skyBox.geometry, skyBox.material)
scene.add(skyBox.mesh)

//Call the borders


const grid = new THREE.Mesh(
    new THREE.BoxGeometry(80, 80, 2000),
    new THREE.MeshStandardMaterial({color: 0x00aaff, side: THREE.DoubleSide, opacity: 0.1, transparent: true})
)
grid.rotation.y = 0
grid.position.z = -1000
grid.receiveShadow = false

scene.add(grid)

const gridWireframe = new THREE.Mesh(
    new THREE.BoxGeometry(80, 80, 2000, 40, 40, 60),
    new THREE.MeshStandardMaterial({color: 0x00aaff, side: THREE.DoubleSide, wireframe: true})
)
gridWireframe.rotation.y = 0
gridWireframe.position.z = -1000
gridWireframe.receiveShadow = false

scene.add(gridWireframe)

// Sizes
const sizes = {}
sizes.width = window.innerWidth
sizes.height = window.innerHeight

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
})


// Cursor
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (_event) =>
{
    cursor.x = _event.clientX / sizes.width - 0.5
    cursor.y = _event.clientY / sizes.height - 0.5
})


//Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 9000)
scene.add(camera)

//Light
const sunLight = new THREE.DirectionalLight( 0xffeedd, 1 )
sunLight.position.x = 2000
sunLight.position.y = 1000
sunLight.position.z = 2000

scene.add(sunLight)

//Renderer
const renderer = new THREE.WebGLRenderer()
renderer.setSize(sizes.width, sizes.height)
renderer.shadowMap.enabled = true
document.body.appendChild(renderer.domElement)

//Listeners for keydowns 
window.addEventListener('keydown', (_e) =>
    {
        //Press Z to increase velocity
        if(_e.key == 'z')
        {
            controlsListeners.z = 1
            window.addEventListener('keyup', (_e) => {
                if(_e.key == 'z')
                {
                    controlsListeners.z = 0
                }
                
            })
        } 
    })

window.addEventListener('keydown', (_e) =>
{
    //Press Shift to highly increase velocity
    if(_e.key == 'Shift')
    {
        controlsListeners.shift = 1
        window.addEventListener('keyup', (_e) => {
            if(_e.key == 'Shift')
            {
                controlsListeners.shift = 0
            }
        })
    } 
})

window.addEventListener('keydown', (_e) =>
{
    //Press S to decrease velocity
    if(_e.key == 's')
    {
        controlsListeners.s = 1
        window.addEventListener('keyup', (_e) => {
            if(_e.key == 's')
            {
                controlsListeners.s = 0
            }
        })
    } 
})

window.addEventListener('keydown', (_e) =>
{
    //Press S to decrease velocity
    if(_e.key == 'r')
    {
        camera.position.z = 0
        camera.position.x = 0
        camera.position.y = 0
    } 
})

// Call the Asteroids
const Asteroids = new Asteroid({
    mtlLoader : mtlLoader,
    objectLoader : objLoader,
    textureLoader : textureLoader,
    camera : camera,
    lifeStatus : lifeStatus,
    scene : scene,
    lifeStatus : lifeStatus
})



// Loop, all the good stuff's here
const loop = () =>
{
    window.requestAnimationFrame(loop)
    //Update velocity
    if(controlsListeners.z === 1 && controlsListeners.shift === 0)//Increase speed to 3.2
    {
        if(velocity < 6)
        {
            velocity += 0.016
        }
    }

    if(controlsListeners.shift === 1 && controlsListeners.z === 1)//Increase speed to 108
    {
        velocity += 0.40
        if (velocity > 40)
        {
            velocity = 40          
        }
    }

    if(controlsListeners.s === 1)//Decrease to 
    {
        velocity -= 0.50
        if (velocity < -4)
        {
            velocity = -4
        }
    }

    if(velocity < 0 && controlsListeners.z === 0 && controlsListeners.shift === 0 && controlsListeners.s ===0){
        velocity += 0.50
    }

    // Update Skybox
    skyBox.mesh.position.x = camera.position.x
    skyBox.mesh.position.y = camera.position.y
    skyBox.mesh.position.z = camera.position.z

    // Update camera
        //Position 
    camera.setFocalLength (15 - (velocity/10))
    camera.position.x += cursor.x * 1.2
    camera.position.y += - cursor.y * 1.2
    camera.position.z -= velocity * 0.08

        //Position container
    if(camera.position.x > 38){camera.position.x = 38}
    if(camera.position.x < -38){camera.position.x = -38}
    if(camera.position.y > 38){camera.position.y = 38}
    if(camera.position.y < -38){camera.position.y = -38}
    if(camera.position.z > 0){camera.position.z = 0}
    
        //Rotation
    camera.rotation.z = - cursor.x * 0.15
    camera.rotation.x = - cursor.y * 0.15

    // Renderer
    renderer.render(scene, camera)

}
loop()