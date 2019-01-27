import * as THREE from 'three'
const lifeBar = document.querySelector('.lifeStatus')
const looseScreen = document.querySelector('.looseScreen')
const looseLink = document.querySelector('.retry-js')
const winScreen = document.querySelector('.winScreen')
const winLink = document.querySelector('.winLink-js')
console.log(lifeBar)

export default class Asteroid
{
    constructor(_options)
    {
        this.textureLoader = _options.textureLoader
        this.mtlLoader = _options.mtlLoader
        this.objLoader = _options.objectLoader
        this.camera = _options.camera
        this.scene = _options.scene
        this.lifeStatus = _options.lifeStatus
        this.velocity = _options.velocity
        this.container = new THREE.Object3D()
        this.thisObject = {}
        this.setObject()
        this.setDust()
        this.checkCollisions()
        this.lifeBarStatus()
        this.didHeWin()
    }

    setObject()
    {
        this.objTab = []
        for(let i =0; i < 450; i++){
            this.mtlLoader.load('/objects/asteroid.mtl', (materials) => //besoin de mettre tout les objets dans un tebleau pour y acceder
            {
                materials.preload()
                this.objLoader.setMaterials(materials)
                this.objLoader.load('/objects/asteroid.obj', (object) => 
                {
                    object.receiveShadow = true
                    // object.position.x = 0
                    // object.position.y = 0
                    // object.position.z = -25
                    object.position.x = 35 - (Math.random() * 70)
                    object.position.y = 35 - (Math.random() * 70)
                    object.position.z = -Math.random() * 2000 - 50
                    object.scale.x = 0.00014
                    object.scale.y = 0.00014
                    object.scale.z = 0.00014
                    object.rotation.x = 180 - Math.random() * 360
                    object.rotation.y = 180 - Math.random() * 360
                    object.rotation.z = 180 - Math.random() * 360
                    
                    this.thisObject = object
                    this.rotationXRatio = 0.5 - Math.random()
                    this.rotationZRatio = 0.5 - Math.random()
                    
                    this.objTab.push(this.thisObject)                    
    
                    const loop = () =>
                    {
                        window.requestAnimationFrame(loop)
                        this.objTab[i].rotation.x += this.rotationXRatio * 0.005
                        this.objTab[i].rotation.z += this.rotationZRatio * 0.005
                        this.asteroidCollision(this.objTab[i])
                    }
                    loop()
                    this.container.add(this.objTab[i])
                    this.scene.add(this.container)
                })
            })  
        }
        
    }
    setDust()
    {
        {
            this.dust = {}
            this.dust.geometry = new THREE.Geometry()
    
    
            for(let i =0; i < 4000; i++)
            {
                const vertice = new THREE.Vector3()
    
                vertice.x = 80 - (Math.random() * 160)
                vertice.y = 80 - (Math.random() * 160)
                vertice.z = -Math.random() * 2000
                
    
                this.dust.geometry.vertices.push(vertice)
            }
    
            this.dust.material = new THREE.PointsMaterial({
                size: 0.3,
                sizeAttenuation: true,
                map: this.textureLoader.load('particules.png'),
                transparent: true
            })
            this.dust.points = new THREE.Points(this.dust.geometry, this.dust.material)
            this.container.add(this.dust.points)
        }
    }
    asteroidCollision(obj)
    {   
        // console.log(obj.position.x,obj.position.y,obj.position.z)
        // console.log(this.camera.position.x,this.camera.position.y,this.camera.position.z)
        if(
            (Math.abs(this.camera.position.x)-Math.abs(obj.position.x)< 3)
            &&Math.abs(this.camera.position.x)-Math.abs(obj.position.x)> -3
            &&Math.abs(this.camera.position.y)-Math.abs(obj.position.y)< 3
            &&Math.abs(this.camera.position.y)-Math.abs(obj.position.y)> -3
            &&Math.abs(obj.position.z)-Math.abs(this.camera.position.z)< 3
            &&Math.abs(obj.position.z)-Math.abs(this.camera.position.z)> -3)
        {
            this.reduceLife(2)
        }
    }

    checkCollisions()
    {
        const loop = () =>
        {
            window.requestAnimationFrame(loop)
            if(
                this.camera.position.x === -38
                ||this.camera.position.x === 38
                ||this.camera.position.y === 38
                ||this.camera.position.y === -38)
            {
                this.reduceLife(0.5)
            }
        }
        loop()
    }




    reduceLife(malus)
    {
        this.lifeStatus -= malus
        console.log(this.lifeStatus)
        if(this.lifeStatus <= 0)
        {
            looseScreen.style.display = "block"
        }
        looseLink.addEventListener('click', (_e) =>
        {
            _e.preventDefault()
            this.camera.position.x = 0
            this.camera.position.y = 0
            this.camera.position.z = 0
            this.velocity = 0
            looseScreen.style.display = 'none'
            this.lifeStatus = 100
        })  
    }
    
    lifeBarStatus()
    {
        const loop = () =>
        {
            window.requestAnimationFrame(loop)
            lifeBar.style.width = this.lifeStatus + "px"
        }
        loop()

    }

    didHeWin()
    {
        winLink.addEventListener('click', (_e)=>
        {
            _e.preventDefault()
            this.camera.position.x = 0
            this.camera.position.y = 0
            this.camera.position.z = 0
            this.velocity = 0
            winScreen.style.display = 'none'
            this.lifeStatus = 100
        })
        
        const loop = () =>
        {
            window.requestAnimationFrame(loop)
            if(this.camera.position.z < -1990)
            {
                winScreen.style.display = "block"
            }
        }
        loop()
    }
}