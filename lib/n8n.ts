const RAW_N8N_API_BASE_URL = process.env.N8N_API_BASE_URL || ''
// Normalize base URL: prefer Public API (/api/v1). If user provided /rest, fallback-rewrite to /api/v1.
const _base = RAW_N8N_API_BASE_URL.replace(/\/$/, '')
const N8N_API_BASE_URL = _base.endsWith('/rest') ? _base.replace(/\/rest$/, '/api/v1') : _base
const N8N_API_KEY = process.env.N8N_API_KEY || ''
const N8N_BASE_URL = (process.env.N8N_BASE_URL || '').replace(/\/$/, '')

function assertEnv() {
  if (!N8N_API_BASE_URL || !N8N_API_KEY) {
    throw new Error('N8N_API_BASE_URL or N8N_API_KEY is not configured')
  }
}

async function n8nRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  assertEnv()
  const url = `${N8N_API_BASE_URL}${path.startsWith('/') ? path : '/' + path}`
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    // Send both headers for broader compatibility with different n8n/proxy setups
    'X-N8N-API-KEY': N8N_API_KEY,
    'Authorization': `Bearer ${N8N_API_KEY}`,
    ...(init.headers as any),
  }
  const res = await fetch(url, { ...init, headers })
  const rawText = await res.text().catch(() => '')
  if (!res.ok) {
    let bodySnippet = rawText.slice(0, 500)
    throw new Error(`n8n ${init.method || 'GET'} ${path} failed: ${res.status} ${res.statusText} ${bodySnippet}`)
  }
  try {
    return JSON.parse(rawText) as T
  } catch {
    // If non-JSON, return as any
    return rawText as unknown as T
  }
}

export type N8NCredential = {
  id: string
  name: string
  type: string
}

export async function createHttpHeaderBearerCredential(name: string, token: string): Promise<N8NCredential> {
  // NOTE: credential type must exist in your n8n instance. 'httpHeaderAuth' is a common generic type.
  const body = {
    name,
    type: 'httpHeaderAuth',
    data: {
      name: 'Authorization',
      value: `Bearer ${token}`,
    },
  }
  const created = await n8nRequest<N8NCredential>('/credentials', {
    method: 'POST',
    body: JSON.stringify(body),
  })
  return created
}

export async function createBasicAuthCredential(name: string, username: string, password: string): Promise<N8NCredential> {
  const body = {
    name,
    type: 'httpBasicAuth',
    data: {
      user: username,
      password,
    },
  }
  const created = await n8nRequest<N8NCredential>('/credentials', {
    method: 'POST',
    body: JSON.stringify(body),
  })
  return created
}

// Create Twitter OAuth2 credential shell to be used with Twitter node (user must authorize it in n8n UI)
export async function createTwitterOAuth2Credential(
  name: string,
  clientId: string,
  clientSecret: string,
  scope?: string
): Promise<N8NCredential> {
  // Some n8n versions (>=1.40+) validate credential schema strictly.
  // Error you saw: additional property "scope"; requires sendAdditionalBodyProperties & additionalBodyProperties.
  // We'll send only permitted core fields and required flags. (Scope can be chosen later via UI OAuth if supported.)
  const data: Record<string, any> = {
    clientId,
    clientSecret,
    sendAdditionalBodyProperties: false,
    additionalBodyProperties: {},
  }
  // Include scope only if provided AND not empty (some versions still allow it). We can feature-detect later if needed.
  if (scope) {
    data.scope = scope
  }
  const body = {
    name,
    type: 'twitterOAuth2Api',
    data,
  }
  const created = await n8nRequest<N8NCredential>('/credentials', {
    method: 'POST',
    body: JSON.stringify(body),
  })
  return created
}

// Create Facebook Graph API credential shell (app-level). User must finish connecting/selecting page in n8n UI.
export async function createFacebookGraphApiCredential(
  name: string,
  appId: string,
  appSecret: string
): Promise<N8NCredential> {
  const body = {
    name,
    type: 'facebookGraphApi',
    data: {
      appId,
      appSecret,
      sendAdditionalBodyProperties: false,
      additionalBodyProperties: {},
    },
  }
  const created = await n8nRequest<N8NCredential>('/credentials', {
    method: 'POST',
    body: JSON.stringify(body),
  })
  return created
}

export async function deleteCredential(id: string): Promise<void> {
  await n8nRequest(`/credentials/${id}`, { method: 'DELETE' })
}

export type Workflow = {
  id: string
  name: string
  active: boolean
  nodes?: any[]
  connections?: Record<string, any>
  settings?: Record<string, any>
  tags?: any[]
}

export async function getWorkflow(id: string): Promise<Workflow> {
  return await n8nRequest<Workflow>(`/workflows/${id}`)
}

export async function createWorkflow(workflow: Partial<Workflow>): Promise<Workflow> {
  return await n8nRequest<Workflow>('/workflows', { method: 'POST', body: JSON.stringify(workflow) })
}

export async function updateWorkflow(id: string, patch: Partial<Workflow>): Promise<Workflow> {
  return await n8nRequest<Workflow>(`/workflows/${id}`, { method: 'PATCH', body: JSON.stringify(patch) })
}

export async function setWorkflowActive(id: string, active: boolean): Promise<void> {
  const endpoint = active ? `/workflows/${id}/activate` : `/workflows/${id}/deactivate`
  await n8nRequest(endpoint, { method: 'POST' })
}

export async function deleteWorkflow(id: string): Promise<void> {
  await n8nRequest(`/workflows/${id}`, { method: 'DELETE' })
}

export function buildWebhookUrl(path: string): string {
  if (!N8N_BASE_URL) return ''
  const clean = path.replace(/^\//, '')
  return `${N8N_BASE_URL}/webhook/${clean}`
}

export async function cloneWorkflowFromTemplate(opts: {
  templateId: string
  userId: string
  platform: string
  credentialName?: string
  credentialId?: string
  credentialType?: string
}): Promise<{ workflow: Workflow; webhookPath?: string; webhookUrl?: string }> {
  const template = await getWorkflow(opts.templateId)
  const stamp = Date.now()
  const name = `[USER ${opts.userId}] ${template.name || 'Posting'} (${opts.platform}) ${stamp}`

  // Attempt to customize webhook path in nodes if a Webhook node exists
  let webhookPath: string | undefined
  const nodes = Array.isArray(template.nodes) ? JSON.parse(JSON.stringify(template.nodes)) : []

  for (const node of nodes) {
    if (node.type?.includes('webhook')) {
      webhookPath = `user-${opts.userId}-${opts.platform}-${stamp}`
      node.parameters = node.parameters || {}
      node.parameters.path = webhookPath
    }
    // Bind credential by name if provided
    if (opts.credentialName && node.credentials) {
      for (const key of Object.keys(node.credentials)) {
        node.credentials[key].name = opts.credentialName
      }
    }
    // If HTTP Request node lacks credentials, attach based on credentialType
    if (opts.credentialName && opts.credentialId) {
      const isHttpRequest = node.type === 'n8n-nodes-base.httpRequest' || node.type?.includes('httpRequest')
      if (isHttpRequest) {
        const credKey = opts.credentialType === 'httpBasicAuth'
          ? 'httpBasicAuth'
          : (opts.credentialType === 'httpHeaderAuth' ? 'httpHeaderAuth' : undefined)
        if (credKey) {
          node.credentials = node.credentials || {}
          node.credentials[credKey] = {
            id: opts.credentialId,
            name: opts.credentialName,
          }
        }
      }
      // Attach native credentials (twitter/facebook) to their nodes when present in template
      const nativeTypes = ['twitterOAuth2Api', 'facebookGraphApi']
      const credIsNative = nativeTypes.includes(String(opts.credentialType))
      if (credIsNative) {
        const platformHint = String(opts.platform || '').toLowerCase()
        const nodeType = String(node.type || '').toLowerCase()
        const looksRelevant = nodeType.includes(platformHint) || (node.credentials && (opts.credentialType! in (node.credentials || {})))
        if (looksRelevant) {
          node.credentials = node.credentials || {}
          node.credentials[opts.credentialType!] = {
            id: opts.credentialId,
            name: opts.credentialName,
          }
        }

        // Disable irrelevant platform posting nodes so n8n doesn't block activation due to missing credentials
        // Example: when provisioning Twitter, disable Facebook node; when provisioning Facebook, disable Twitter node.
        if (platformHint === 'twitter') {
          if (nodeType.includes('facebook')) {
            node.disabled = true
          }
        } else if (platformHint === 'facebook') {
          if (nodeType.includes('twitter')) {
            node.disabled = true
          }
        }
      }
    }
  }

  const newWf: Partial<Workflow> = {
    name,
    // NOTE: 'active' is read-only in Public API create; we'll activate after creation
    nodes,
    connections: template.connections || {},
    settings: (template as any).settings || {},
  }

  const created = await createWorkflow(newWf)
  // Activate using Public API endpoint
  await setWorkflowActive(created.id, true)
  const activated = await getWorkflow(created.id)

  const webhookUrl = webhookPath ? buildWebhookUrl(webhookPath) : undefined
  return { workflow: activated, webhookPath, webhookUrl }
}
