type ToastOptions = {
  title?: string
  description?: string
  variant?: "default" | "destructive" | "success" | "info"
  duration?: number
}

function ensureContainer() {
  if (typeof document === "undefined") return null
  let el = document.getElementById("__simple_toaster__") as HTMLDivElement | null
  if (!el) {
    el = document.createElement("div")
    el.id = "__simple_toaster__"
    el.style.position = "fixed"
    el.style.top = "16px"
    el.style.right = "16px"
    el.style.zIndex = "9999"
    el.style.display = "flex"
    el.style.flexDirection = "column"
    el.style.gap = "8px"
    document.body.appendChild(el)
  }
  return el
}

function renderToast(opts: ToastOptions) {
  if (typeof document === "undefined") return
  const container = ensureContainer()
  if (!container) return

  const item = document.createElement("div")
  item.style.minWidth = "260px"
  item.style.maxWidth = "360px"
  item.style.padding = "10px 12px"
  item.style.borderRadius = "8px"
  item.style.boxShadow = "0 6px 16px rgba(0,0,0,0.12)"
  item.style.background = opts.variant === "destructive" ? "#fee2e2" : "#ffffff"
  item.style.border = `1px solid ${opts.variant === "destructive" ? "#fecaca" : "#e5e7eb"}`
  item.style.fontFamily = "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial"
  item.style.color = "#111827"

  const title = document.createElement("div")
  title.style.fontWeight = "600"
  title.style.marginBottom = opts.description ? "4px" : "0"
  title.textContent = opts.title || (opts.variant === "destructive" ? "Có lỗi xảy ra" : "Thông báo")

  const desc = document.createElement("div")
  desc.style.fontSize = "12px"
  desc.style.color = "#374151"
  desc.textContent = opts.description || ""

  item.appendChild(title)
  if (opts.description) item.appendChild(desc)

  container.appendChild(item)

  const duration = typeof opts.duration === "number" ? opts.duration : 3000
  const timer = setTimeout(() => {
    try {
      container.removeChild(item)
    } catch {}
  }, duration)

  item.addEventListener("click", () => {
    clearTimeout(timer)
    try {
      container.removeChild(item)
    } catch {}
  })
}

export function useToast() {
  return {
    toast: (opts: ToastOptions) => {
      if (typeof window === "undefined") return
      renderToast(opts)
    },
  }
}
