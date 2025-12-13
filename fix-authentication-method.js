// Fix LinkedIn node authentication method
require('dotenv').config()

const N8N_BASE_URL = process.env.N8N_BASE_URL
const N8N_API_KEY = process.env.N8N_API_KEY

async function fixAuthentication() {
  const workflowId = 'dYWw4BkTbkFTvx9A'
  const credentialId = 'iJp5QXPquuNaaV0k'
  const credentialName = 'bearer-linkedin-cmiwy249i000152h9ryfc2tev-1765558956252'
  const linkedinUrn = 'urn:li:person:jdAD7Nozqp'
  
  // 1. Get workflow
  console.log('📥 Fetching workflow...')
  let response = await fetch(`${N8N_BASE_URL}/api/v1/workflows/${workflowId}`, {
    headers: { 'X-N8N-API-KEY': N8N_API_KEY },
  })
  
  if (!response.ok) {
    console.error('❌ Failed to fetch workflow:', response.status)
    return
  }
  
  const workflow = await response.json()
  
  // 2. Find LinkedIn node
  const linkedInNode = workflow.nodes.find(n => 
    n.name === 'Post LinkedIn (placeholder)' || 
    n.name === 'Post LinkedIn'
  )
  
  if (!linkedInNode) {
    console.error('❌ LinkedIn node not found!')
    console.log('Available nodes:', workflow.nodes.map(n => n.name))
    return
  }
  
  console.log('✅ Found node:', linkedInNode.name)
  console.log('\n📋 Current configuration:')
  console.log('  Authentication:', linkedInNode.parameters?.authentication)
  console.log('  Credentials:', JSON.stringify(linkedInNode.credentials, null, 2))
  
  // 3. Update node - CRITICAL: Set authentication to "predefinedCredentialType"
  linkedInNode.parameters = {
    ...linkedInNode.parameters,
    authentication: 'predefinedCredentialType',
    nodeCredentialType: 'httpHeaderAuth'
  }
  
  linkedInNode.credentials = {
    httpHeaderAuth: {
      id: credentialId,
      name: credentialName
    }
  }
  
  // Also ensure jsonBody uses correct syntax
  linkedInNode.parameters.jsonBody = `={\n  "author": "${linkedinUrn}",\n  "lifecycleState": "PUBLISHED",\n  "specificContent": {\n    "com.linkedin.ugc.ShareContent": {\n      "shareCommentary": {\n        "text": \${$json.content_text || 'Hello LinkedIn'}\n      },\n      "shareMediaCategory": "NONE"\n    }\n  },\n  "visibility": {\n    "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"\n  }\n}`
  
  console.log('\n🔧 Updated to:')
  console.log('  Authentication:', linkedInNode.parameters.authentication)
  console.log('  Credentials:', JSON.stringify(linkedInNode.credentials, null, 2))
  
  // 4. Clean and update workflow
  const cleanWorkflow = {
    name: workflow.name,
    nodes: workflow.nodes,
    connections: workflow.connections,
    settings: workflow.settings || {}
  }
  
  console.log('\n📤 Sending PUT request...')
  response = await fetch(`${N8N_BASE_URL}/api/v1/workflows/${workflowId}`, {
    method: 'PUT',
    headers: {
      'X-N8N-API-KEY': N8N_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cleanWorkflow),
  })
  
  if (!response.ok) {
    const error = await response.text()
    console.error('❌ PUT failed:', response.status, error)
    return
  }
  
  console.log('✅ Workflow updated successfully!')
  
  // 5. Verify
  response = await fetch(`${N8N_BASE_URL}/api/v1/workflows/${workflowId}`, {
    headers: { 'X-N8N-API-KEY': N8N_API_KEY },
  })
  
  const updated = await response.json()
  const verifyNode = updated.nodes.find(n => n.name === linkedInNode.name)
  
  console.log('\n=== ✅ VERIFICATION ===')
  console.log('Authentication method:', verifyNode.parameters?.authentication)
  console.log('Has httpHeaderAuth:', !!verifyNode.credentials?.httpHeaderAuth)
  console.log('Credential ID:', verifyNode.credentials?.httpHeaderAuth?.id)
  console.log('URN in jsonBody:', verifyNode.parameters.jsonBody.includes(linkedinUrn) ? '✅' : '❌')
  console.log('\n🎉 LinkedIn node is ready to publish!')
}

fixAuthentication().catch(console.error)
