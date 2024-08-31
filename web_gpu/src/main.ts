
import vertex from './shaders/triangle/vertex.wgsl?raw'
import fragment from './shaders/triangle/fragment.wgsl?raw'
import '../src/style.css'

async function initWebGPU(canvas: HTMLCanvasElement) {
  if (!navigator.gpu)
    throw new Error('not support webgpu');
  const adapter = await navigator.gpu.requestAdapter({
    powerPreference: "high-performance"
  });
  if (!adapter)
    throw new Error('no adapters');
  const device = await adapter.requestDevice({});
  const context = canvas.getContext('webgpu');
  if (!context)
    throw new Error('no contexts');
  const format = navigator.gpu.getPreferredCanvasFormat()
  context.configure({
    device,
    format,
    alphaMode: 'opaque'
  })
  const devicePixelRatio = window.devicePixelRatio || 1
  canvas.width = canvas.clientWidth * devicePixelRatio
  canvas.height = canvas.clientHeight * devicePixelRatio
  const size = { width: canvas.width, height: canvas.height }
  return { adapter, device, context, format, size };
}

async function initPipeline(device: GPUDevice, format: GPUTextureFormat): Promise<GPURenderPipeline> {
  const vertexShader = device.createShaderModule({
    label: 'verteces of the triangle',
    code: vertex
  });

  const fragmentShader = device.createShaderModule({
    label: 'fragments of the triangle',
    code: fragment
  });
  const pipeline: GPURenderPipeline = await device.createRenderPipelineAsync({
    vertex: {
      module: vertexShader,
      entryPoint: 'main'
    },
    fragment: {
      module: fragmentShader,
      entryPoint: 'main',
      targets: [{
        format
      }]
    },
    primitive: {
      topology: 'triangle-list'
    },
    layout: 'auto',
    multisample: {
      count: 4,
    }
  })
  return pipeline
}

function draw(device: GPUDevice, pipeline: GPURenderPipeline, context: GPUCanvasContext, MSAAView: GPUTextureView) {
  const encoder = device.createCommandEncoder();
  const renderPass = encoder.beginRenderPass({
    label: 'render pass',
    colorAttachments: [{
      view: MSAAView,
      resolveTarget: context.getCurrentTexture().createView(),
      clearValue: { r: 0, g: 0, b: 0, a: 1.0 },
      loadOp: 'clear', // clear/load
      storeOp: 'store' // store/discard
    }]
  });
  renderPass.setPipeline(pipeline);
  renderPass.draw(3);
  renderPass.end();
  const buffer = encoder.finish();
  device.queue.submit([buffer]);
}

async function run() {
  const canvas = <HTMLCanvasElement>document.getElementById('cx1');
  if (!canvas)
    throw new Error('No Canvas')
  const { device, format, context, size } = await initWebGPU(canvas);
  const pipeline = await initPipeline(device, format);
  let MSAATexture = device.createTexture({
    size, format,
    sampleCount: 4,
    usage: GPUTextureUsage.RENDER_ATTACHMENT
  });
  let MSAAView = MSAATexture.createView();
  draw(device, pipeline, context, MSAAView);
  // const devicePixelRatio = window.devicePixelRatio || 1
  window.addEventListener('resize', () => {
    size.width = canvas.width = canvas.clientWidth * devicePixelRatio
    size.height = canvas.height = canvas.clientHeight * devicePixelRatio
    // don't need to recall context.configure() after v104
    MSAATexture.destroy()
    MSAATexture = device.createTexture({
      size, format,
      sampleCount: 4,
      usage: GPUTextureUsage.RENDER_ATTACHMENT
    });
    MSAAView = MSAATexture.createView();
    draw(device, pipeline, context, MSAAView)

  })
}

run();

