import * as THREE from 'three'

export default class Asteroid
{
    constructor(_options)
    {
        this.textureLoader = _options.textureLoader
        this.mtlLoader = _options.mtlLoader
        this.objLoader = _options.objectLoader
        this.container = new THREE.Object3D()
        this.thisObject = {}
        this.setObject()
        this.setDust()
    }

    setObject()
    {
        this.mtlLoader.load('/objects/asteroid.mtl', (materials) => //besoin de mettre tout les objets dans un tebleau pour y acceder
        {
            materials.preload()
            this.objLoader.setMaterials(materials)
            this.objLoader.load('/objects/asteroid.obj', (object) => 
            {
            object.receiveShadow = true
            object.position.x = 35 - (Math.random() * 70)
            object.position.y = 35 - (Math.random() * 70)
            object.position.z = -Math.random() * 2000
            object.scale.x = 0.0001
            object.scale.y = 0.0001
            object.scale.z = 0.0001
            object.rotation.x = 180 - Math.random() * 360
            object.rotation.y = 180 - Math.random() * 360
            object.rotation.z = 180 - Math.random() * 360
            
            this.thisObject = object
            this.rotationXRatio = 0.5 - Math.random()
            this.rotationZRatio = 0.5 - Math.random()

            const loop = () =>
            {
                window.requestAnimationFrame(loop)
                this.thisObject.rotation.x += this.rotationXRatio * 0.005
                this.thisObject.rotation.z += this.rotationZRatio * 0.005
                this.thisObject.position.z += 0.03
            }
            loop()

            this.container.add(this.thisObject)
            
            })
        })  
    }
    setDust()
    {
        {
            this.dust = {}
            this.dust.geometry = new THREE.Geometry()
    
    
            for(let i =0; i < 4; i++)
            {
                const vertice = new THREE.Vector3()
    
                vertice.x = 80 - (Math.random() * 160)
                vertice.y = 80 - (Math.random() * 160)
                vertice.z = -Math.random() * 2000
                
    
                this.dust.geometry.vertices.push(vertice)
            }
    
            this.dust.material = new THREE.PointsMaterial({
                size: 0.12,
                sizeAttenuation: true,
                map: this.textureLoader.load('particules.png'),
                transparent: true
            })
            this.dust.points = new THREE.Points(this.dust.geometry, this.dust.material)
            this.container.add(this.dust.points)
        }
    }
}