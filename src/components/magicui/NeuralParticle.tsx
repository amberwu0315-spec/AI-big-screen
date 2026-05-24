import { useEffect, useRef, type CSSProperties } from 'react'
import * as THREE from 'three'

import cyacleLogo from '@/assets/cyacle-logo.svg'
import { cn } from '@/lib/utils'

type LogoParticlePoint = {
  color: [number, number, number]
  position: [number, number, number]
}

const logoPointCache = new Map<string, LogoParticlePoint[]>()

const vertexShader = `
uniform float uTime;
uniform float uMorph;
uniform float uPointSize;
uniform int uEffectMode;
uniform float uEffectIntensity;
uniform float uExplosionTime;
uniform float uReveal;
uniform float uScatterDistance;

attribute vec3 targetPosition;
attribute vec3 targetColor;
attribute vec3 color;
attribute vec3 randomOffset;

varying vec3 vColor;
varying float vDistance;

vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec2 mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}
vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}

float snoise(vec2 v){
  const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
  vec2 i=floor(v+dot(v,C.yy));
  vec2 x0=v-i+dot(i,C.xx);
  vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
  vec4 x12=x0.xyxy+C.xxzz;
  x12.xy-=i1;
  i=mod289(i);
  vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
  vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);
  m=m*m;
  m=m*m;
  vec3 x=2.0*fract(p*C.www)-1.0;
  vec3 h=abs(x)-0.5;
  vec3 ox=floor(x+0.5);
  vec3 a0=x-ox;
  m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
  vec3 g;
  g.x=a0.x*x0.x+h.x*x0.y;
  g.yz=a0.yz*x12.xz+h.yz*x12.yw;
  return 130.0*dot(m,g);
}

void main(){
  vColor=mix(color,targetColor,uMorph);
  vec3 pos=mix(position,targetPosition,uMorph);
  vec3 originalPos=pos;
  float effectMix=uEffectIntensity;
  float revealEase=smoothstep(0.0,1.0,uReveal);
  float looseMotion=1.0-revealEase;

  if(uEffectMode==0){
    float noise=sin(uTime*1.5+position.x*0.3)*cos(uTime*1.5+position.y*0.3);
    pos+=normalize(pos)*noise*(0.2*(1.0-uMorph))*looseMotion;
    pos.x+=sin(uTime*0.3+position.z)*0.1*looseMotion;
    pos.y+=cos(uTime*0.3+position.x)*0.1*looseMotion;
  }else if(uEffectMode==1){
    vec3 scatterDir=normalize(pos+randomOffset*0.5);
    float scatterDist=length(pos)*0.5+randomOffset.x*3.0;
    vec3 scattered=pos+scatterDir*scatterDist*effectMix*2.5;
    float turb=snoise(pos.xy*0.3+uTime*0.5);
    scattered+=vec3(turb,turb*0.5,turb*0.3)*effectMix*1.5;
    pos=mix(originalPos,scattered,effectMix);
  }else if(uEffectMode==2){
    float explodeProgress=min(uExplosionTime*2.0,1.0);
    float returnProgress=max(0.0,(uExplosionTime-0.5)*2.0);
    vec3 explodeDir=normalize(pos+randomOffset);
    float explodeDist=(5.0+randomOffset.x*8.0)*sin(explodeProgress*3.14159);
    vec3 exploded=originalPos+explodeDir*explodeDist*effectMix;
    float spin=explodeProgress*6.28318*(0.5+randomOffset.y);
    exploded.x+=cos(spin)*explodeDist*0.3;
    exploded.z+=sin(spin)*explodeDist*0.3;
    pos=mix(originalPos,exploded,effectMix*(1.0-returnProgress*0.7));
  }else if(uEffectMode==3){
    float angle=atan(pos.z,pos.x);
    float radius=length(pos.xz);
    float height=pos.y;
    float spiralSpeed=uTime*2.0+height*0.3;
    float newAngle=angle+spiralSpeed*effectMix;
    float vortexPull=(1.0-abs(height)/20.0)*effectMix;
    float newRadius=radius*(1.0-vortexPull*0.5)+sin(uTime*3.0+height)*effectMix;
    float lift=effectMix*5.0*(1.0-radius/20.0);
    pos.x=cos(newAngle)*newRadius;
    pos.z=sin(newAngle)*newRadius;
    pos.y=height+lift*sin(uTime+radius);
  }else if(uEffectMode==4){
    float pulsePhase=uTime*2.5;
    float pulseFactor=1.0+sin(pulsePhase)*0.4*effectMix;
    float waveFactor=sin(pulsePhase+length(pos)*0.3)*0.3*effectMix;
    vec3 pulsed=pos*pulseFactor;
    pulsed+=normalize(pos)*waveFactor*3.0;
    float colorPulse=sin(pulsePhase*0.5)*0.5+0.5;
    vColor=mix(vColor,vec3(1.0,0.4,0.8),colorPulse*effectMix*0.3);
    pos=pulsed;
  }else if(uEffectMode==5){
    float waveX=sin(pos.x*0.5+uTime*2.0)*effectMix*3.0;
    float waveZ=cos(pos.z*0.5+uTime*1.5)*effectMix*2.0;
    float waveY=sin(pos.x*0.3+pos.z*0.3+uTime*2.5)*effectMix*4.0;
    waveY+=sin(pos.x*0.8-uTime*1.8)*effectMix*1.5;
    waveY+=cos(pos.z*0.6+uTime*1.2)*effectMix*1.0;
    pos.x+=waveX*0.3;
    pos.y+=waveY;
    pos.z+=waveZ*0.3;
  }

  vec2 scatterDir2=normalize(pos.xy+randomOffset.xy*2.0+vec2(0.001));
  vec3 scatterOffset=vec3(scatterDir2*uScatterDistance, randomOffset.z*3.0);
  pos+=scatterOffset*(1.0-revealEase);

  vec4 mvPosition=modelViewMatrix*vec4(pos,1.0);
  float dist=length(pos);
  vDistance=dist;
  float sizeMultiplier=1.0;
  if(uEffectMode==2&&effectMix>0.1)sizeMultiplier=1.0+sin(uExplosionTime*10.0)*0.3;
  if(uEffectMode==4)sizeMultiplier=1.0+sin(uTime*2.5)*0.2*effectMix;
  float pointPulse=mix(1.2+sin(uTime*3.0+dist*0.15)*0.5,1.0,revealEase);
  gl_PointSize=(uPointSize/-mvPosition.z)*pointPulse*sizeMultiplier*mix(0.42,1.0,revealEase);
  gl_Position=projectionMatrix*mvPosition;
}
`

const fragmentShader = `
uniform float uTime;
uniform float uReveal;

varying vec3 vColor;
varying float vDistance;

void main(){
  float dist=distance(gl_PointCoord,vec2(0.5));
  if(dist>0.5)discard;
  float strength=pow(1.0-dist*2.0,1.6);
  vec3 finalColor=vColor;
  float revealEase=smoothstep(0.0,1.0,uReveal);
  float alpha=strength*mix(0.17,0.25,revealEase);
  gl_FragColor=vec4(finalColor,alpha);
}
`

type NeuralParticleProps = {
  className?: string
  effectMode?: 0 | 1 | 2 | 3 | 4 | 5
  freezeAfterReveal?: boolean
  imageSrc?: string
  maxFps?: number
  particleCount?: number
  particleSize?: number
  revealDuration?: number
  scatterDistance?: number
  scale?: number
  solidDuration?: number
  speed?: number
  style?: CSSProperties
}

export function NeuralParticle({
  className,
  effectMode = 0,
  freezeAfterReveal = false,
  imageSrc = cyacleLogo,
  maxFps = 24,
  particleCount = 24000,
  particleSize = 125,
  revealDuration = 4,
  scatterDistance = 14,
  scale = 1,
  solidDuration = 2,
  speed = 1,
  style,
}: NeuralParticleProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current

    if (!container) {
      return undefined
    }

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 1000)
    camera.position.z = 45
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance',
    })
    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.width = '100%'
    container.appendChild(renderer.domElement)

    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const targetPositions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const targetColors = new Float32Array(particleCount * 3)
    const randomOffsets = new Float32Array(particleCount * 3)
    const greenColor = new THREE.Color(0x00ff66)
    const brightWhite = new THREE.Color(0xffffff)

    for (let i = 0; i < particleCount; i += 1) {
      const i3 = i * 3
      const t = imageSrc ? 0 : (Math.random() - 0.5) * 5.0
      const angle = imageSrc ? 0 : Math.random() * Math.PI * 2
      const radiusBase = imageSrc ? 0 : 0.4 + Math.abs(t) ** 2.4
      const radius = imageSrc ? 0 : radiusBase * (0.75 + Math.random() * 0.55)
      const x = radius * Math.cos(angle) * 2.9
      const z = radius * Math.sin(angle) * 2.9
      const y = t * 7.5
      const color = Math.random() > 0.7 ? greenColor : brightWhite

      positions[i3] = x
      positions[i3 + 1] = y
      positions[i3 + 2] = z
      targetPositions[i3] = x
      targetPositions[i3 + 1] = y
      targetPositions[i3 + 2] = z
      randomOffsets[i3] = (Math.random() - 0.5) * 2
      randomOffsets[i3 + 1] = (Math.random() - 0.5) * 2
      randomOffsets[i3 + 2] = (Math.random() - 0.5) * 2
      colors[i3] = color.r
      colors[i3 + 1] = color.g
      colors[i3 + 2] = color.b
      targetColors[i3] = color.r
      targetColors[i3 + 1] = color.g
      targetColors[i3 + 2] = color.b
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('targetPosition', new THREE.BufferAttribute(targetPositions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('targetColor', new THREE.BufferAttribute(targetColors, 3))
    geometry.setAttribute('randomOffset', new THREE.BufferAttribute(randomOffsets, 3))

    let targetMorph = 0
    let isDisposed = false

    const applyLogoPoints = (validPoints: LogoParticlePoint[]) => {
      for (let i = 0; i < particleCount; i += 1) {
        const i3 = i * 3
        const pointIndex = Math.floor((i / particleCount) * validPoints.length)
        const point = validPoints[Math.min(pointIndex, validPoints.length - 1)]
        const targetX = point.position[0] + (Math.random() - 0.5) * 0.4
        const targetY = point.position[1] + (Math.random() - 0.5) * 0.4
        const targetZ = point.position[2] + (Math.random() - 0.5) * 1.5

        positions[i3] = targetX
        positions[i3 + 1] = targetY
        positions[i3 + 2] = targetZ
        targetPositions[i3] = targetX
        targetPositions[i3 + 1] = targetY
        targetPositions[i3 + 2] = targetZ
        colors[i3] = point.color[0]
        colors[i3 + 1] = point.color[1]
        colors[i3 + 2] = point.color[2]
        targetColors[i3] = point.color[0]
        targetColors[i3 + 1] = point.color[1]
        targetColors[i3 + 2] = point.color[2]
      }

      geometry.getAttribute('position').needsUpdate = true
      geometry.getAttribute('color').needsUpdate = true
      geometry.getAttribute('targetPosition').needsUpdate = true
      geometry.getAttribute('targetColor').needsUpdate = true
      targetMorph = 1
      morphFactor = 1
      material.uniforms.uMorph.value = 1
      material.uniforms.uReveal.value = 0
      points.visible = true
    }

    const processImage = (source: string) => {
      const cachedPoints = logoPointCache.get(source)

      if (cachedPoints) {
        applyLogoPoints(cachedPoints)
        return
      }

      const image = new Image()
      image.crossOrigin = 'anonymous'
      image.src = source
      image.onload = () => {
        if (isDisposed) {
          return
        }

        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')

        if (!context) {
          return
        }

        const resolution = 200
        const aspect = image.width / image.height
        const drawWidth = aspect > 1 ? resolution : resolution * aspect
        const drawHeight = aspect > 1 ? resolution / aspect : resolution
        const validPoints: LogoParticlePoint[] = []

        canvas.width = resolution
        canvas.height = resolution
        context.fillStyle = 'black'
        context.fillRect(0, 0, resolution, resolution)
        context.drawImage(
          image,
          (resolution - drawWidth) / 2,
          (resolution - drawHeight) / 2,
          drawWidth,
          drawHeight,
        )

        const imageData = context.getImageData(0, 0, resolution, resolution).data

        for (let y = 0; y < resolution; y += 1) {
          for (let x = 0; x < resolution; x += 1) {
            const index = (y * resolution + x) * 4
            const r = imageData[index]
            const g = imageData[index + 1]
            const b = imageData[index + 2]

            if ((r + g + b) / 3 > 15) {
              validPoints.push({
                color: [r / 255, g / 255, b / 255],
                position: [(x / resolution - 0.5) * 38, (0.5 - y / resolution) * 38, ((r + g + b) / 765 - 0.5) * 12],
              })
            }
          }
        }

        if (validPoints.length === 0) {
          return
        }

        logoPointCache.set(source, validPoints)
        applyLogoPoints(validPoints)
      }
    }

    const material = new THREE.ShaderMaterial({
      blending: THREE.NormalBlending,
      depthWrite: false,
      fragmentShader,
      transparent: true,
      uniforms: {
        uEffectIntensity: { value: 0 },
        uEffectMode: { value: effectMode },
        uExplosionTime: { value: 0 },
        uMorph: { value: 0 },
        uPointSize: { value: particleSize },
        uReveal: { value: imageSrc ? 0 : 1 },
        uScatterDistance: { value: scatterDistance },
        uTime: { value: 0 },
      },
      vertexShader,
    })

    const points = new THREE.Points(geometry, material)
    points.scale.setScalar(scale)
    points.visible = !imageSrc
    scene.add(points)

    if (imageSrc) {
      processImage(imageSrc)
    }

    const resize = () => {
      const width = container.clientWidth || 1
      const height = container.clientHeight || 1
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height, false)
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)
    resize()

    let animationFrame = 0
    let lastFrameAt = 0
    let lastTickAt = 0
    let morphFactor = 0
    let time = 0
    const cycleDuration = revealDuration * 2 + solidDuration
    const frameDuration = 1000 / Math.max(1, maxFps)

    const animate = (now: number) => {
      if (now - lastFrameAt < frameDuration) {
        animationFrame = requestAnimationFrame(animate)
        return
      }

      const deltaSeconds = lastTickAt > 0 ? Math.min((now - lastTickAt) / 1000, 0.1) : 0
      lastTickAt = now
      lastFrameAt = now
      time += deltaSeconds * speed
      morphFactor += (targetMorph - morphFactor) * 0.05

      if (imageSrc) {
        const cycleTime = time % cycleDuration
        let revealProgress = 0

        if (freezeAfterReveal && time >= revealDuration) {
          revealProgress = 1
        } else if (cycleTime < revealDuration) {
          revealProgress = cycleTime / revealDuration
        } else if (cycleTime < revealDuration + solidDuration) {
          revealProgress = 1
        } else {
          revealProgress = 1 - (cycleTime - revealDuration - solidDuration) / revealDuration
        }

        material.uniforms.uReveal.value = revealProgress
      }

      material.uniforms.uMorph.value = morphFactor
      material.uniforms.uTime.value = time
      renderer.render(scene, camera)

      if (freezeAfterReveal && imageSrc && time >= revealDuration && morphFactor > 0.995) {
        return
      }

      animationFrame = requestAnimationFrame(animate)
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      isDisposed = true
      cancelAnimationFrame(animationFrame)
      resizeObserver.disconnect()
      scene.remove(points)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
      renderer.domElement.remove()
    }
  }, [effectMode, freezeAfterReveal, imageSrc, maxFps, particleCount, particleSize, revealDuration, scale, scatterDistance, solidDuration, speed])

  return <div ref={containerRef} className={cn('pointer-events-none overflow-hidden', className)} style={style} />
}
