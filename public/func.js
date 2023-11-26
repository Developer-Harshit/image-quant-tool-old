function showPreview(event) {
    if (event.target.files.length > 0) {
        var src = URL.createObjectURL(event.target.files[0])
        console.log(src)

        imageElement.src = src
        iSrc = src
    }
}
function resizeCanvas() {
    let w = imageElement.naturalWidth
    let h = imageElement.naturalHeight
    renderer.setSize(w, h)
}
function luminance(c) {
    return c.r * 0.2126 + c.g * 0.7152 + c.b * 0.0722
}
function createMesh(THREE) {
    let loader = new THREE.TextureLoader()
    texture = loader.load(iSrc)
    texture.matrixAutoUpdate = true
    let shaderUniforms = {
        u_texture: { value: texture },
        u_palette: { value: myPalette },
        u_res: { value: new THREE.Vector2() },
    }

    planeMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 1),
        new THREE.ShaderMaterial({
            uniforms: shaderUniforms,
            vertexShader,
            fragmentShader,
        })
    )
}
function setShader(m_type, paletteSize) {
    const modes = [
        `gl_FragColor = nearestColor(c0,u_palette);`,
        `gl_FragColor = quantByPalette(c0,u_palette);`,
        `gl_FragColor = quantGray(c0,${paletteSize}.0);`,
    ]
    vertexShader = `
  varying vec2 vUv;
  void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
  `
    fragmentShader = `
  varying vec2 vUv;
  uniform sampler2D u_texture;    
  uniform vec3 u_palette[${paletteSize}];
  
  
  
  float luminance(vec4 c){
      // return (c.r + c.b + c.g)/3.0;
      return c.r * 0.2126  + c.g * 0.7152 + c.b * 0.0722;
  }
  vec4 quantGray(vec4 c,float n){
      
      float i = ( round(luminance(c) * n) / n);
      return vec4(vec3(i),1.0);
  }
  vec4 quantByPalette(vec4 c , vec3 p[${paletteSize}]){
      highp int i =  int(round(luminance(c) * ${paletteSize - 1}.0));
      return vec4(p[i],1.0);
  }
  
  float distSQ(vec3 p1 ,vec3 p2){
      vec3 distanceVector = p2 - p1;
      return dot(distanceVector, distanceVector);
  }
  
  vec4 nearestColor(vec4 c, vec3 p[${paletteSize}]){
      float d = 1000000000.0;
      vec3 cr = vec3(1.0);
      for(int i=0;i<${paletteSize};++i){
          
          float mydist = distSQ(c.rgb,p[i]) ;
          if(d > mydist){
              d = mydist;
              cr = p[i];
          }
      }
      return vec4(cr,1.0);
  }
  void main() {
      vec4 c0 = texture2D(u_texture,vUv); 
      ${modes[m_type]}
  }  
  `
}
function saveImage() {
    const parentDiv = document.getElementById('output')

    const imgSrc = renderer.domElement.toDataURL()

    imageElement.src = imgSrc

    outputAnchor.href = imgSrc
    outputAnchor.innerText = 'Download'
    outputAnchor.download = 'output.png'

    parentDiv.appendChild(outputAnchor)
}
