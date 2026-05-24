import { useEffect, useRef } from 'react'

const vertexShaderSource = `
attribute vec2 aPosition;

void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`

const fragmentShaderSource = `
precision highp float;

uniform float uTime;
uniform float uAttenuation;
uniform float uLineThickness;
uniform float uThicknessGrowth;
uniform float uBaseRadius;
uniform float uRadiusStep;
uniform float uScaleRate;
uniform float uOpacity;
uniform float uNoiseAmount;
uniform float uRotation;
uniform float uRingGap;
uniform float uFadeIn;
uniform float uFadeOut;
uniform float uCenterMaskInner;
uniform float uCenterMaskOuter;
uniform float uInnerRingOffset;
uniform vec2 uResolution;
uniform vec3 uColor;
uniform vec3 uColorTwo;
uniform int uRingCount;

const float HP = 1.5707963;
const float CYCLE = 3.45;

float fadePhase(float t) {
  return t < uFadeIn
    ? smoothstep(0.0, uFadeIn, t)
    : 1.0 - smoothstep(uFadeOut, CYCLE - 0.2, t);
}

float ring(vec2 p, float ringIndex, float cut, float offset, float px) {
  float t = mod(uTime + offset, CYCLE);
  float r = ringIndex + t / CYCLE * uScaleRate;
  float d = abs(length(p) - r);
  float a = atan(abs(p.y), abs(p.x)) / HP;
  float growth = 1.0 + (t / CYCLE) * uThicknessGrowth;
  float th = max(1.0 - a, 0.5) * px * uLineThickness * growth;
  float h = (1.0 - smoothstep(th, th * 1.5, d)) + 1.0;
  d += pow(cut * a, 3.0) * r;
  return h * exp(-uAttenuation * d) * fadePhase(t);
}

void main() {
  float px = 1.0 / min(uResolution.x, uResolution.y);
  vec2 p = (gl_FragCoord.xy - 0.5 * uResolution.xy) * px;
  float cr = cos(uRotation);
  float sr = sin(uRotation);
  p = mat2(cr, -sr, sr, cr) * p;

  vec3 color = vec3(0.0);
  float ringCountFactor = max(float(uRingCount) - 1.0, 1.0);

  for (int i = 0; i < 10; i++) {
    if (i >= uRingCount) {
      break;
    }

    float fi = float(i);
    float ringOffset = fi - uInnerRingOffset;
    vec3 ringColor = mix(uColor, uColorTwo, fi / ringCountFactor);
    float ringValue = ring(
      p,
      uBaseRadius + ringOffset * uRadiusStep,
      pow(uRingGap, fi),
      i == 0 ? 0.0 : 2.95 * fi,
      px
    );
    color = mix(color, ringColor, vec3(ringValue));
  }

  float centerMask = 1.0 - smoothstep(uCenterMaskInner, uCenterMaskOuter, length(p));
  color *= centerMask;

  float noise = fract(sin(dot(gl_FragCoord.xy + uTime * 100.0, vec2(12.9898, 78.233))) * 43758.5453);
  color += (noise - 0.5) * uNoiseAmount;
  gl_FragColor = vec4(color, max(color.r, max(color.g, color.b)) * uOpacity);
}
`

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)

  if (!shader) {
    return null
  }

  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }

  return shader
}

function createProgram(gl: WebGLRenderingContext, vertexSource: string, fragmentSource: string) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource)

  if (!vertexShader || !fragmentShader) {
    return null
  }

  const program = gl.createProgram()

  if (!program) {
    gl.deleteShader(vertexShader)
    gl.deleteShader(fragmentShader)
    return null
  }

  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)

  gl.deleteShader(vertexShader)
  gl.deleteShader(fragmentShader)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program)
    return null
  }

  return program
}

function hexToRgb(color: string) {
  const normalized = color.replace('#', '')

  return {
    r: Number.parseInt(normalized.slice(0, 2), 16) / 255,
    g: Number.parseInt(normalized.slice(2, 4), 16) / 255,
    b: Number.parseInt(normalized.slice(4, 6), 16) / 255,
  }
}

type MagicRingsBackgroundProps = {
  active?: boolean
  playKey?: number
}

export function MagicRingsBackground({ active = true, playKey = 0 }: MagicRingsBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const activeRef = useRef(active)
  const playKeyRef = useRef(playKey)
  const cycleStartTimeRef = useRef<number | null>(null)

  useEffect(() => {
    activeRef.current = active
  }, [active])

  useEffect(() => {
    playKeyRef.current = playKey
    cycleStartTimeRef.current = null
  }, [playKey])

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) {
      return undefined
    }

    const gl = canvas.getContext('webgl', { alpha: true, antialias: true })

    if (!gl) {
      return undefined
    }

    const program = createProgram(gl, vertexShaderSource, fragmentShaderSource)

    if (!program) {
      return undefined
    }

    const positionBuffer = gl.createBuffer()

    if (!positionBuffer) {
      gl.deleteProgram(program)
      return undefined
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1,
        1, -1,
        -1, 1,
        -1, 1,
        1, -1,
        1, 1,
      ]),
      gl.STATIC_DRAW,
    )

    gl.useProgram(program)

    const positionLocation = gl.getAttribLocation(program, 'aPosition')
    gl.enableVertexAttribArray(positionLocation)
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

    const uniforms = {
      time: gl.getUniformLocation(program, 'uTime'),
      attenuation: gl.getUniformLocation(program, 'uAttenuation'),
      lineThickness: gl.getUniformLocation(program, 'uLineThickness'),
      thicknessGrowth: gl.getUniformLocation(program, 'uThicknessGrowth'),
      baseRadius: gl.getUniformLocation(program, 'uBaseRadius'),
      radiusStep: gl.getUniformLocation(program, 'uRadiusStep'),
      scaleRate: gl.getUniformLocation(program, 'uScaleRate'),
      opacity: gl.getUniformLocation(program, 'uOpacity'),
      noiseAmount: gl.getUniformLocation(program, 'uNoiseAmount'),
      rotation: gl.getUniformLocation(program, 'uRotation'),
      ringGap: gl.getUniformLocation(program, 'uRingGap'),
      fadeIn: gl.getUniformLocation(program, 'uFadeIn'),
      fadeOut: gl.getUniformLocation(program, 'uFadeOut'),
      centerMaskInner: gl.getUniformLocation(program, 'uCenterMaskInner'),
      centerMaskOuter: gl.getUniformLocation(program, 'uCenterMaskOuter'),
      innerRingOffset: gl.getUniformLocation(program, 'uInnerRingOffset'),
      resolution: gl.getUniformLocation(program, 'uResolution'),
      color: gl.getUniformLocation(program, 'uColor'),
      colorTwo: gl.getUniformLocation(program, 'uColorTwo'),
      ringCount: gl.getUniformLocation(program, 'uRingCount'),
    }

    const color = hexToRgb('#54E8FF')
    const colorTwo = hexToRgb('#5BF58A')
    let animationFrameId = 0

    const resize = () => {
      const parent = canvas.parentElement

      if (!parent) {
        return
      }

      const width = parent.clientWidth
      const height = parent.clientHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)

      canvas.width = Math.max(1, Math.floor(width * dpr))
      canvas.height = Math.max(1, Math.floor(height * dpr))
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      gl.viewport(0, 0, canvas.width, canvas.height)
    }

    resize()
    window.addEventListener('resize', resize)

    const render = (time: number) => {
      animationFrameId = window.requestAnimationFrame(render)

      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)

      if (activeRef.current && cycleStartTimeRef.current === null) {
        cycleStartTimeRef.current = time
      }

      const elapsedTime = activeRef.current && cycleStartTimeRef.current !== null
        ? time - cycleStartTimeRef.current
        : 0

      gl.useProgram(program)
      gl.uniform1f(uniforms.time, elapsedTime * 0.0007)
      gl.uniform1f(uniforms.attenuation, 10.5)
      gl.uniform1f(uniforms.lineThickness, 1.4)
      gl.uniform1f(uniforms.thicknessGrowth, 1.15)
      gl.uniform1f(uniforms.baseRadius, 0.59625)
      gl.uniform1f(uniforms.radiusStep, 0.162)
      gl.uniform1f(uniforms.scaleRate, 0.207)
      gl.uniform1f(uniforms.opacity, 0.42)
      gl.uniform1f(uniforms.noiseAmount, 0.035)
      gl.uniform1f(uniforms.rotation, 0)
      gl.uniform1f(uniforms.ringGap, 1.44)
      gl.uniform1f(uniforms.fadeIn, 0.72)
      gl.uniform1f(uniforms.fadeOut, 0.52)
      gl.uniform1f(uniforms.centerMaskInner, 0.3)
      gl.uniform1f(uniforms.centerMaskOuter, 0.54)
      gl.uniform1f(uniforms.innerRingOffset, 2.0)
      gl.uniform2f(uniforms.resolution, canvas.width, canvas.height)
      gl.uniform3f(uniforms.color, color.r, color.g, color.b)
      gl.uniform3f(uniforms.colorTwo, colorTwo.r, colorTwo.g, colorTwo.b)
      gl.uniform1i(uniforms.ringCount, 9)

      gl.drawArrays(gl.TRIANGLES, 0, 6)
    }

    animationFrameId = window.requestAnimationFrame(render)

    return () => {
      window.cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', resize)
      gl.deleteBuffer(positionBuffer)
      gl.deleteProgram(program)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-[1] h-full w-full transition-opacity duration-300"
      style={{ opacity: active ? 1 : 0 }}
    />
  )
}
