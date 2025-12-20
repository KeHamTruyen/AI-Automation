function getEnv() {
  const RAW_N8N_API_BASE_URL = process.env.N8N_API_BASE_URL || ''
  const _base = RAW_N8N_API_BASE_URL.replace(/\/$/, '')
  const N8N_API_BASE_URL = _base.endsWith('/rest') ? _base.replace(/\/rest$/, '/api/v1') : _base
  const N8N_API_KEY = process.env.N8N_API_KEY || ''
  const N8N_BASE_URL = (process.env.N8N_BASE_URL || '').replace(/\/$/, '')
  return { N8N_API_BASE_URL, N8N_API_KEY, N8N_BASE_URL }
}

function clampString(s: string, max: number): string {
  if (!s) return s
  return s.length > max ? s.slice(0, max) : s
}

function assertEnv() {
  const { N8N_API_BASE_URL, N8N_API_KEY } = getEnv()
  if (!N8N_API_BASE_URL || !N8N_API_KEY) {
    throw new Error('N8N_API_BASE_URL or N8N_API_KEY is not configured')
  }
}

async function n8nRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  assertEnv()
  const { N8N_API_BASE_URL, N8N_API_KEY } = getEnv()
  const url = `${N8N_API_BASE_URL}${path.startsWith('/') ? path : '/' + path}`
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    // Send both headers for broader compatibility with different n8n/proxy setups
    'X-N8N-API-KEY': N8N_API_KEY,
    'Authorization': `Bearer ${N8N_API_KEY}`,
    ...(init.headers as any),
  }
  console.log(`[n8nRequest] ${init.method || 'GET'} ${url}`)
  const res = await fetch(url, { ...init, headers })
  const rawText = await res.text().catch(() => '')
  if (!res.ok) {
    let bodySnippet = rawText.slice(0, 500)
    console.error(`[n8nRequest] ERROR ${res.status} ${res.statusText}`, bodySnippet)
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
    },
  }
  const created = await n8nRequest<N8NCredential>('/credentials', {
    method: 'POST',
    body: JSON.stringify(body),
  })
  return created
}

// Create Facebook Graph API credential using a direct access token (no OAuth flow inside n8n)
export async function createFacebookTokenCredential(
  name: string,
  accessToken: string
): Promise<N8NCredential> {
  const body = {
    name,
    type: 'facebookGraphApi',
    data: {
      accessToken,
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
  // Try PUT first (full replace), as some n8n proxies/configs block PATCH
  try {
    // GET current workflow to merge patch
    const current = await getWorkflow(id)
    const merged = { ...current, ...patch }
    
    // Clean object - remove read-only fields
    const cleanWorkflow: any = {
      name: merged.name,
      nodes: merged.nodes,
      connections: merged.connections,
      settings: merged.settings || {}
    }
    
    return await n8nRequest<Workflow>(`/workflows/${id}`, { method: 'PUT', body: JSON.stringify(cleanWorkflow) })
  } catch (e: any) {
    // Fallback to PATCH if PUT fails
    const msg = String(e?.message || '')
    if (msg.includes('405') || /method not allowed/i.test(msg)) {
      throw new Error('PUT/PATCH to update workflow is blocked by server/proxy; cannot update workflow without creating extra workflows. Please allow PUT/PATCH or edit manually in n8n.')
    }
    throw e
  }
}

export async function setWorkflowActive(id: string, active: boolean): Promise<void> {
  const endpoint = active ? `/workflows/${id}/activate` : `/workflows/${id}/deactivate`
  await n8nRequest(endpoint, { method: 'POST' })
}

export async function deleteWorkflow(id: string): Promise<void> {
  await n8nRequest(`/workflows/${id}`, { method: 'DELETE' })
}

export function buildWebhookUrl(path: string): string {
  const { N8N_BASE_URL } = getEnv()
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
  const rawName = `[USER ${opts.userId}] ${template.name || 'Posting'} (${opts.platform}) ${stamp}`
  const name = clampString(rawName, 120)

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
      const nativeTypes = ['twitterOAuth2Api', 'facebookGraphApi', 'instagram']
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

// Create a workflow from a template and append multiple account-specific posting nodes before creating it.
// This avoids using PATCH by constructing the full workflow graph up front.
export async function createWorkflowFromTemplateWithAccounts(opts: {
  templateId: string
  userId: string
  accounts: Array<{
    platform: string
    accountDisplayName: string
    credentialId: string
    credentialName: string
    credentialType: string
    nodeTypeOverride?: string
    nodeId?: string
  }>
}): Promise<{ workflow: Workflow; webhookPath?: string; webhookUrl?: string }> {
  const template = await getWorkflow(opts.templateId)
  const stamp = Date.now()
  const rawName = `[USER ${opts.userId}] ${template.name || 'Posting'} (${opts.accounts.length} accounts) ${stamp}`
  const name = clampString(rawName, 120)

  // Deep clone nodes & connections
  const nodes = Array.isArray(template.nodes) ? JSON.parse(JSON.stringify(template.nodes)) : []
  const connections: Record<string, any> = template.connections ? JSON.parse(JSON.stringify(template.connections)) : {}

  // Customize webhook path if a Webhook node exists
  let webhookPath: string | undefined
  for (const node of nodes) {
    if (node.type?.includes('webhook')) {
      webhookPath = `user-${opts.userId}-${stamp}`
      node.parameters = node.parameters || {}
      node.parameters.path = webhookPath
      break
    }
  }

  // Heuristics to place/connect account nodes
  const routeNode = nodes.find((n: any) => String(n.name || '').toLowerCase().includes('route'))
  const normalizeNode = nodes.find((n: any) => String(n.name || '').toLowerCase().includes('normalize'))

  function readXY(p: any): { x: number; y: number } {
    if (!p) return { x: 600, y: 300 }
    if (Array.isArray(p) && p.length >= 2) return { x: Number(p[0]) || 600, y: Number(p[1]) || 300 }
    if (typeof p === 'object' && p !== null && 'x' in p && 'y' in p) {
      return { x: Number((p as any).x) || 600, y: Number((p as any).y) || 300 }
    }
    return { x: 600, y: 300 }
  }

  const { x: baseX, y: baseY } = readXY(routeNode?.position)

  for (const acc of opts.accounts) {
    const platform = String(acc.platform || '').toLowerCase()

    // Try bind native node(s) first based on type + name hints
    let bound = false
    if (acc.credentialType === 'facebookGraphApi') {
      // Collect all facebookGraphApi nodes
      const fbNodes = nodes.filter((n: any) => String(n.type || '').toLowerCase().includes('facebookgraphapi'))
      // Determine platform keyword
      const keyword = platform === 'instagram' ? 'instagram' : 'facebook'
      
      // Filter nodes matching this platform (facebook or instagram)
      const platformNodes = fbNodes.filter((n: any) => {
        const name = String(n.name || '').toLowerCase()
        if (keyword === 'instagram') {
          return name.includes('instagram')
        } else {
          // Facebook: match all facebookGraphApi nodes EXCEPT instagram
          return !name.includes('instagram')
        }
      })
      
      if (platformNodes.length > 0) {
        // Bind credential to ALL matching platform nodes
        for (const target of platformNodes) {
          target.credentials = target.credentials || {}
          target.credentials.facebookGraphApi = { id: acc.credentialId, name: acc.credentialName }
          // Enable node if previously disabled
          if (target.disabled) delete target.disabled
          // If we have a specific resource/node id (e.g., igUserId or pageId), set it on the node parameter
          target.parameters = target.parameters || {}
          if (acc.nodeId) {
            target.parameters.node = acc.nodeId
          }
        }
        console.log(`[createWorkflowFromTemplateWithAccounts] Bound ${platformNodes.length} ${platform} nodes:`, platformNodes.map((n: any) => n.name))
        bound = true
      }
    } else if (acc.credentialType === 'twitterOAuth2Api') {
      const twNode = nodes.find((n: any) => String(n.type || '').toLowerCase().includes('twitter'))
      if (twNode) {
        twNode.credentials = twNode.credentials || {}
        twNode.credentials.twitterOAuth2Api = { id: acc.credentialId, name: acc.credentialName }
        if (twNode.disabled) delete twNode.disabled
        bound = true
      }
    }

    if (bound) continue

    // Fallback: add an HTTP Request node if no native node exists in template
    const existingPerPlatformCount: Record<string, number> = {}
    existingPerPlatformCount[platform] = existingPerPlatformCount[platform] || 0
    const indexOffset = existingPerPlatformCount[platform]++

    const newNodeName = `[${platform}] Post ${acc.accountDisplayName}`
    const safeNodeName = clampString(newNodeName, 64)

    const nodeType = acc.nodeTypeOverride || 'n8n-nodes-base.httpRequest'
    const newNode: any = {
      name: safeNodeName,
      type: nodeType,
      parameters: {},
      position: [ baseX + 300, baseY + indexOffset * 120 ],
      credentials: {},
    }

    if (acc.credentialType === 'httpHeaderAuth') {
      newNode.parameters = {
        url: 'https://graph.facebook.com/v19.0/<page-id>/feed',
        method: 'POST',
        sendBody: true,
        jsonParameters: true,
        options: { },
        bodyParametersJson: '{"message":"{{$json[\"content\"] || \"Hello\"}}"}'
      }
      newNode.credentials.httpHeaderAuth = { id: acc.credentialId, name: acc.credentialName }
    } else if (acc.credentialType === 'facebookGraphApi') {
      newNode.credentials.facebookGraphApi = { id: acc.credentialId, name: acc.credentialName }
    } else if (acc.credentialType === 'twitterOAuth2Api') {
      newNode.credentials.twitterOAuth2Api = { id: acc.credentialId, name: acc.credentialName }
    } else {
      newNode.credentials[acc.credentialType] = { id: acc.credentialId, name: acc.credentialName }
    }

    nodes.push(newNode)

    if (routeNode) {
      const routeName = routeNode.name
      connections[routeName] = connections[routeName] || {}
      connections[routeName].main = connections[routeName].main || [[]]
      connections[routeName].main.push([{ node: safeNodeName, type: 'main', index: 0 }])
    }
    if (normalizeNode) {
      connections[safeNodeName] = connections[safeNodeName] || {}
      connections[safeNodeName].main = [ [ { node: normalizeNode.name, type: 'main', index: 0 } ] ]
    }
  }

  const newWf: Partial<Workflow> = {
    name,
    nodes,
    connections,
    settings: (template as any).settings || {},
  }

  const created = await createWorkflow(newWf)
  await setWorkflowActive(created.id, true)
  const activated = await getWorkflow(created.id)

  const webhookUrl = webhookPath ? buildWebhookUrl(webhookPath) : undefined
  return { workflow: activated, webhookPath, webhookUrl }
}

// New: add a posting node for a newly connected social account into an existing per-user workflow.
// This is a simplified helper; it appends a new HTTP Request node (or leaves type override) and connects
// it directly to a downstream normalization node if found, otherwise no connections are wired.
// IMPORTANT: n8n connections structure expects: connections: { [nodeName]: { main: [ [ { node, type, index } ] ] } }
// We attempt minimal mutation; for advanced merging (multiple accounts per platform) you may need to
// implement chained Merge nodes. This helper is intentionally conservative.
export async function addPlatformAccountNode(opts: {
  workflowId: string
  platform: string
  accountDisplayName: string
  credentialId: string
  credentialName: string
  credentialType: string
  nodeTypeOverride?: string // e.g. native node type, else httpRequest
  linkedinUrn?: string // LinkedIn author URN for ugcPosts
}): Promise<{ workflow: Workflow; replaced?: boolean; oldWorkflowId?: string }> {
  const wf = await getWorkflow(opts.workflowId)
  const nodes = Array.isArray(wf.nodes) ? JSON.parse(JSON.stringify(wf.nodes)) : []

  // Heuristic: find route node and normalize node by name hint
  const routeNode = nodes.find((n: any) => String(n.name || '').toLowerCase().includes('route'))
  const normalizeNode = nodes.find((n: any) => String(n.name || '').toLowerCase().includes('normalize'))

  function readXY(p: any): { x: number; y: number } {
    if (!p) return { x: 600, y: 300 }
    if (Array.isArray(p) && p.length >= 2) return { x: Number(p[0]) || 600, y: Number(p[1]) || 300 }
    if (typeof p === 'object' && p !== null && 'x' in p && 'y' in p) {
      return { x: Number((p as any).x) || 600, y: Number((p as any).y) || 300 }
    }
    return { x: 600, y: 300 }
  }

  const { x: baseX, y: baseY } = readXY(routeNode?.position)
  // Offset Y per platform to spread nodes vertically
  const platformIndexOffset = nodes.filter((n: any) => String(n.name || '').includes(`[${opts.platform}]`)).length
  const newNodeName = `[${opts.platform}] Post ${opts.accountDisplayName}`
  const safeNodeName = clampString(newNodeName, 64)

  // Choose node type
  const nodeType = opts.nodeTypeOverride || 'n8n-nodes-base.httpRequest'
  const newNode: any = {
    name: safeNodeName,
    type: nodeType,
    parameters: {},
    position: [ baseX + 300, baseY + platformIndexOffset * 120 ],
    credentials: {},
  }

  // Attach credential appropriately
  if (opts.credentialType === 'httpHeaderAuth') {
    // LinkedIn or generic HTTP with Bearer token
    if (opts.platform.toLowerCase() === 'linkedin') {
      const authorUrn = opts.linkedinUrn ? `urn:li:person:${opts.linkedinUrn}` : 'urn:li:person:REPLACE_WITH_AUTHOR_ID'
      newNode.parameters = {
        url: 'https://api.linkedin.com/v2/ugcPosts',
        method: 'POST',
        authentication: 'predefinedCredentialType',
        nodeCredentialType: 'httpHeaderAuth',
        sendBody: true,
        specifyBody: 'json',
        jsonBody: `={{\n  JSON.stringify({\n    author: "${authorUrn}",\n    lifecycleState: "PUBLISHED",\n\n    specificContent: {\n      "com.linkedin.ugc.ShareContent": {\n        shareCommentary: {\n          text: $('Fanout Platforms').item.json.content_text\n        },\n\n        shareMediaCategory: (\n          (\n            $json.asset\n          )\n          ? "IMAGE"\n          : "NONE"\n        ),\n\n        media: (\n          (\n            $json.asset \n          )\n          ? [\n              {\n                status: "READY",\n                media:\n                  $json.asset\n              }\n            ]\n          : []\n        )\n      }\n    },\n\n    visibility: {\n      "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"\n    }\n  })\n}}`,
        options: {}
      }
    } else {
      newNode.parameters = {
        url: 'https://graph.facebook.com/v19.0/<page-id>/feed', // Placeholder; replace dynamically
        method: 'POST',
        sendBody: true,
        jsonParameters: true,
        options: {},
        bodyParametersJson: '{"message":"{{$json[\"content\"] || \"Hello\"}}"}'
      }
    }
    newNode.credentials.httpHeaderAuth = { id: opts.credentialId, name: opts.credentialName }
  } else if (opts.credentialType === 'facebookGraphApi') {
    // Native facebook node type expected; adapt if nodeTypeOverride provided
    newNode.credentials.facebookGraphApi = { id: opts.credentialId, name: opts.credentialName }
  } else if (opts.credentialType === 'twitterOAuth2Api') {
    newNode.credentials.twitterOAuth2Api = { id: opts.credentialId, name: opts.credentialName }
  } else {
    // Fallback generic
    newNode.credentials[opts.credentialType] = { id: opts.credentialId, name: opts.credentialName }
  }

  nodes.push(newNode)

  // Mutate connections: connect routeNode -> new node; then new node -> normalizeNode (if exists)
  const connections = wf.connections ? JSON.parse(JSON.stringify(wf.connections)) : {}
  if (routeNode) {
    const routeName = routeNode.name
    connections[routeName] = connections[routeName] || {}
    connections[routeName].main = connections[routeName].main || [[]]
    connections[routeName].main.push([{ node: newNodeName, type: 'main', index: 0 }])
  }
  if (normalizeNode) {
    connections[newNodeName] = connections[newNodeName] || {}
    connections[newNodeName].main = [ [ { node: normalizeNode.name, type: 'main', index: 0 } ] ]
  }

  const patched: Partial<Workflow> = { nodes, connections }
  try {
    const updated = await updateWorkflow(opts.workflowId, patched)
    return { workflow: updated }
  } catch (e: any) {
    const msg = String(e?.message || '')
    const patchBlocked = msg.includes('405') || /method not allowed/i.test(msg)
    if (patchBlocked) {
      throw new Error('PATCH to update workflow is blocked by server/proxy; cannot add node without creating extra workflows. Please allow PATCH or edit manually in n8n.')
    }
    throw e
  }
}

// Update credential on an existing node (identified by name/type hints) without creating a new node.
// Falls back to workflow recreation if PATCH blocked.
export async function updateExistingNodeCredential(opts: {
  workflowId: string
  platform: string
  credentialId: string
  credentialName: string
  credentialType: string
  nodeNameHint?: string // e.g. 'facebook'
  linkedinUrn?: string // LinkedIn author URN to update jsonBody
}): Promise<{ workflow: Workflow; updated: boolean; replaced?: boolean; oldWorkflowId?: string }> {
  const wf = await getWorkflow(opts.workflowId)
  const nodes = Array.isArray(wf.nodes) ? JSON.parse(JSON.stringify(wf.nodes)) : []
  const connections = wf.connections ? JSON.parse(JSON.stringify(wf.connections)) : {}

  const hint = (opts.nodeNameHint || opts.platform).toLowerCase()
  
  // For LinkedIn, find ALL nodes that need updating (Post LinkedIn + HTTP Request for register upload)
  // For Facebook, find ALL nodes (Feed + Photo + any other FB nodes)
  let targets: any[] = []
  if (opts.platform.toLowerCase() === 'linkedin') {
    targets = nodes.filter((n: any) => {
      const name = String(n.name || '').toLowerCase()
      return name.includes('linkedin') || (name.includes('http request') && n.parameters?.url?.includes('linkedin'))
    })
  } else if (opts.platform.toLowerCase() === 'facebook') {
    // Find ALL Facebook nodes (Feed, Photo, etc.)
    targets = nodes.filter((n: any) => {
      const name = String(n.name || '').toLowerCase()
      return name.includes('facebook')
    })
  } else {
    const target = nodes.find((n: any) => String(n.name || '').toLowerCase().includes(hint))
    if (target) targets = [target]
  }
  
  if (targets.length === 0) {
    return { workflow: wf, updated: false }
  }

  // Update all target nodes
  for (const target of targets) {
    target.credentials = target.credentials || {}
    
    // Map credentialType to key
    if (opts.credentialType === 'httpHeaderAuth') {
      target.credentials.httpHeaderAuth = { id: opts.credentialId, name: opts.credentialName }
      
      // For LinkedIn nodes, also update authentication parameters and URN
      if (opts.platform.toLowerCase() === 'linkedin' && opts.linkedinUrn) {
        const authorUrn = `urn:li:person:${opts.linkedinUrn}`
        target.parameters = target.parameters || {}
        target.parameters.authentication = 'predefinedCredentialType'
        target.parameters.nodeCredentialType = 'httpHeaderAuth'
        
        const nodeName = String(target.name || '').toLowerCase()
        
        // Update jsonBody based on node type
        if (nodeName.includes('post')) {
          // Post LinkedIn node - full UGC post body
          target.parameters.jsonBody = `={{\n  JSON.stringify({\n    author: "${authorUrn}",\n    lifecycleState: "PUBLISHED",\n\n    specificContent: {\n      "com.linkedin.ugc.ShareContent": {\n        shareCommentary: {\n          text: $('Fanout Platforms').item.json.content_text\n        },\n\n        shareMediaCategory: (\n          (\n            $json.asset \n          )\n          ? "IMAGE"\n          : "NONE"\n        ),\n\n        media: (\n          (\n            $json.asset \n           \n          )\n          ? [\n              {\n                status: "READY",\n                media:\n                  $json.asset \n              }\n            ]\n          : []\n        )\n      }\n    },\n\n    visibility: {\n      "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"\n    }\n  })\n}}`
        } else if (nodeName.includes('http request') || target.parameters?.url?.includes('registerUpload')) {
          // HTTP Request (Register Upload) node - register upload body
          target.parameters.jsonBody = `{\n  "registerUploadRequest": {\n    "owner": "${authorUrn}",\n    "recipes": ["urn:li:digitalmediaRecipe:feedshare-image"],\n    "serviceRelationships": [\n      {\n        "relationshipType": "OWNER",\n        "identifier": "urn:li:userGeneratedContent"\n      }\n    ]\n  }\n}`
        }
      }
    } else if (opts.credentialType === 'facebookGraphApi') {
      target.credentials.facebookGraphApi = { id: opts.credentialId, name: opts.credentialName }
    } else {
      // Generic assignment
      target.credentials[opts.credentialType] = { id: opts.credentialId, name: opts.credentialName }
    }
    
    // ACTIVATE node (set disabled = false)
    target.disabled = false
  }

  const patch: Partial<Workflow> = { nodes }
  try {
    const updated = await updateWorkflow(opts.workflowId, patch)
    console.log(`[updateExistingNodeCredential] Updated and activated ${targets.length} nodes for ${opts.platform}`)
    return { workflow: updated, updated: true }
  } catch (e: any) {
    const msg = String(e?.message || '')
    const patchBlocked = msg.includes('405') || /method not allowed/i.test(msg)
    if (patchBlocked) {
      throw new Error('PATCH to update workflow is blocked; cannot update existing node credential without manual change.')
    }
    throw e
  }
}

// Remove a platform/account node from a per-user workflow. It prefers matching by credentialId
// and falls back to name heuristics. Updates connections accordingly. If PATCH is blocked, falls
// back to create+activate like in addPlatformAccountNode.
export async function removePlatformAccountNode(opts: {
  workflowId: string
  credentialId?: string
  platformHint?: string
  accountDisplayNameHint?: string
}): Promise<{ workflow: Workflow }> {
  const wf = await getWorkflow(opts.workflowId)
  const nodes = Array.isArray(wf.nodes) ? JSON.parse(JSON.stringify(wf.nodes)) : []
  const connections = wf.connections ? JSON.parse(JSON.stringify(wf.connections)) : {}

  // Find target node
  let targetIndex = -1
  let targetName: string | undefined
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i]
    const creds = n?.credentials || {}
    let hasCred = false
    if (opts.credentialId) {
      for (const k of Object.keys(creds)) {
        if (creds[k]?.id === opts.credentialId) { hasCred = true; break }
      }
    }
    const lowerName = String(n.name || '').toLowerCase()
    const nameMatch = (opts.platformHint && lowerName.includes(String(opts.platformHint).toLowerCase()))
      || (opts.accountDisplayNameHint && lowerName.includes(String(opts.accountDisplayNameHint).toLowerCase()))
    if (hasCred || nameMatch) {
      targetIndex = i
      targetName = n.name
      break
    }
  }

  if (targetIndex === -1 || !targetName) {
    // Nothing to remove; return as-is
    return { workflow: wf }
  }

  // Remove node
  nodes.splice(targetIndex, 1)
  // Remove connections pointing to this node
  for (const from of Object.keys(connections)) {
    const main = connections[from]?.main
    if (Array.isArray(main)) {
      for (let i = 0; i < main.length; i++) {
        const branch = main[i]
        if (Array.isArray(branch)) {
          connections[from].main[i] = branch.filter((l: any) => l?.node !== targetName)
        }
      }
    }
  }
  // Remove the node's own connection entry
  if (connections[targetName]) delete connections[targetName]

  const patch: Partial<Workflow> = { nodes, connections }
  try {
    const updated = await updateWorkflow(opts.workflowId, patch)
    return { workflow: updated }
  } catch (e: any) {
    const msg = String(e?.message || '')
    const patchBlocked = msg.includes('405') || /method not allowed/i.test(msg)
    if (patchBlocked) {
      throw new Error('PATCH blocked; cannot remove node without manual change in n8n.')
    }
    throw e
  }
}

// Toggle các node theo nền tảng (facebook/instagram/twitter) trong 1 workflow hiện có.
// - active=true: bật node và gán credential (nếu cung cấp)
// - active=false: tắt node và gỡ credential của nền tảng đó
export async function setPlatformNodesActive(opts: {
  workflowId: string
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin'
  active: boolean
  credentialId?: string
  credentialName?: string
}): Promise<Workflow> {
  const wf = await getWorkflow(opts.workflowId)
  const nodes = Array.isArray(wf.nodes) ? JSON.parse(JSON.stringify(wf.nodes)) : []
  const plat = String(opts.platform).toLowerCase()

  function isFacebookNode(n: any): boolean {
    const t = String(n?.type || '').toLowerCase()
    if (!t.includes('facebookgraphapi')) return false
    const name = String(n?.name || '').toLowerCase()
    // Loại trừ node Instagram (cũng dùng facebookGraphApi) để tránh gán nhầm
    if (name.includes('instagram')) return false
    // Chấp nhận mọi node facebookGraphApi còn lại là node Facebook (feed/photo/...)
    return true
  }
  function isInstagramNode(n: any): boolean {
    const t = String(n?.type || '').toLowerCase()
    const name = String(n?.name || '').toLowerCase()
    // Instagram dùng facebookGraphApi node nhưng name thường chứa 'instagram'
    return t.includes('facebookgraphapi') && name.includes('instagram')
  }
  function isTwitterNode(n: any): boolean {
    const t = String(n?.type || '').toLowerCase()
    return t.includes('twitter')
  }
  function isLinkedInNode(n: any): boolean {
    const t = String(n?.type || '').toLowerCase()
    const name = String(n?.name || '').toLowerCase()
    // LinkedIn uses httpRequest nodes (HTTP Request, HTTP Request1, HTTP Request2)
    // and a main node with 'linkedin' in the name
    if (name.includes('linkedin')) return true
    // Also match HTTP Request nodes that have httpHeaderAuth credential (LinkedIn-specific)
    if (t.includes('httprequest') && n?.credentials?.httpHeaderAuth) return true
    return false
  }

  console.log(`[setPlatformNodesActive] Scanning ${nodes.length} nodes for platform=${plat}, active=${opts.active}`)
  const touched: string[] = []
  for (const n of nodes) {
    const match = plat === 'facebook' ? isFacebookNode(n) : plat === 'instagram' ? isInstagramNode(n) : plat === 'twitter' ? isTwitterNode(n) : plat === 'linkedin' ? isLinkedInNode(n) : false
    console.log(`[setPlatformNodesActive] Node "${n.name}" type=${n.type} match=${match} disabled=${!!n.disabled}`)
    if (!match) continue
    touched.push(n.name || '(unnamed)')
    if (opts.active) {
      if (n.disabled) delete n.disabled
      if (opts.credentialId && opts.credentialName) {
        n.credentials = n.credentials || {}
        if (plat === 'twitter') {
          n.credentials.twitterOAuth2Api = { id: opts.credentialId, name: opts.credentialName }
        } else if (plat === 'linkedin') {
          n.credentials.httpHeaderAuth = { id: opts.credentialId, name: opts.credentialName }
        } else {
          n.credentials.facebookGraphApi = { id: opts.credentialId, name: opts.credentialName }
        }
      }
      console.log(`[setPlatformNodesActive] ✓ Activated "${n.name}" with credential ${opts.credentialName}`)
    } else {
      n.disabled = true
      if (n.credentials) {
        if (plat === 'twitter') delete n.credentials.twitterOAuth2Api
        else if (plat === 'linkedin') delete n.credentials.httpHeaderAuth
        else delete n.credentials.facebookGraphApi
      }
      console.log(`[setPlatformNodesActive] ✗ Deactivated "${n.name}"`)
    }
  }
  if (touched.length) {
    console.log(`[setPlatformNodesActive] ${plat} toggled ${touched.length} nodes:`, touched)
  } else {
    console.warn(`[setPlatformNodesActive] No nodes matched platform=${plat} in workflow ${opts.workflowId}`)
  }

  const patch: Partial<Workflow> = { nodes }
  const updated = await updateWorkflow(opts.workflowId, patch)
  return updated
}
