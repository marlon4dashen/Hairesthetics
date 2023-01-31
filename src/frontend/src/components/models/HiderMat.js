import * as THREE from 'three'
export const HiderMat = new THREE.MeshPhongMaterial({
    attach: 'material',
    color: 'hotpink',
    colorWrite: false,
    renderOrder: 1,
});