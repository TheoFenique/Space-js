import * as THREE from 'three'

import rockDiffuseAlphaSource from '../images/textures/planet/rock/diffuse-alpha.png'





export default class Planet
{
    constructor(_options)
    {
        this.textureLoader = _options.textureLoader

        this.container = new THREE.Object3D()
        this.setBelt()
       
    }

    setBelt()
    {
        this.belt = {}
        this.belt.geometry = new THREE.Geometry()

        const vertice = new THREE.Vector3()
        const angle = Math.random() * Math.PI * 2
        const distance = 5 - Math.random() * 10
        vertice.x = 15 - Math.random() * 30
        vertice.y = 15 - Math.random() * 30
        vertice.z = -Math.random() * 800
        this.belt.geometry.vertices.push(vertice)
        

        this.belt.material = new THREE.PointsMaterial({
            size: 1,
            sizeAttenuation: true,
            map: this.textureLoader.load(rockDiffuseAlphaSource),
            transparent: true
        })
        this.belt.points = new THREE.Points(this.belt.geometry, this.belt.material)
        this.container.add(this.belt.points)
    }
}
