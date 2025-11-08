export const CONFIG = {
  models: {
    primary: {
      name: "Grok-1",
      source: "xai-org/grok-1",
      type: "open-weights (314B MoE)",
      size: "~80GB (4-bit quantized)",
      lmStudioSetup: "Download LM Studio, search 'xai-org/grok-1' (GGUF quantized), load model with GPU offload",
      inference: "LM Studio with CUDA 12.8 for 2-4x speedup on RTX GPUs"
    },
    fallback: [
      {
        name: "Llama 3.2 8B",
        source: "ollama run llama3.2",
        access: "Free, local, NVIDIA-optimized"
      }
    ]
  },
  ui: {
    port: 3000,
    host: 'localhost'
  },
  sandbox: {
    persistent: './sandbox',
    configPath: './sandbox/mcp-config.json'
  }
};
