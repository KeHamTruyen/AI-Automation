// Manual fix: Update LinkedIn node with actual URN
require('dotenv').config()

const N8N_BASE_URL = process.env.N8N_BASE_URL
const N8N_API_KEY = process.env.N8N_API_KEY

async function fixLinkedInNode() {
  const workflowId = 'dYWw4BkTbkFTvx9A'
  const linkedinUrn = 'urn:li:person:jdAD7Nozqp'
  const credentialId = 'iJp5QXPquuNaaV0k'
  const credentialName = 'bearer-linkedin-cmiwy249i000152h9ryfc2tev-1765558956252'
  
  // 1. Get workflow
  console.log('Fetching workflow...')
  let response = await fetch(`${N8N_BASE_URL}/api/v1/workflows/${workflowId}`, {
    headers: { 'X-N8N-API-KEY': N8N_API_KEY },
  })
  const workflow = await response.json()
  
  // 2. Update LinkedIn node directly (skip credential lookup)
  console.log('\nUpdating LinkedIn node...')
  const linkedInNode = workflow.nodes.find(n => n.name === 'Post LinkedIn (placeholder)')
  
  if (!linkedInNode) {
    console.error('LinkedIn node not found!')
    return
  }
  
  console.log('\nUpdating LinkedIn node...')
  linkedInNode.parameters.jsonBody = `={\n  "author": "${linkedinUrn}",\n  "lifecycleState": "PUBLISHED",\n  "specificContent": {\n    "com.linkedin.ugc.ShareContent": {\n      "shareCommentary": {\n        "text": "{{$json.content_text || 'Hello LinkedIn'}}"\n      },\n      "shareMediaCategory": "NONE"\n    }\n  },\n  "visibility": {\n    "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"\n  }\n}`
  
  linkedInNode.credentials = {
    httpHeaderAuth: {
      id: credentialId,
      name: credentialName
    }
  }
  
  // 3. PUT update (full replace)
  console.log('Sending PUT request...')
  
  // Clean workflow object - remove fields that API doesn't accept
  const cleanWorkflow = {
    name: workflow.name,
    nodes: workflow.nodes,
    connections: workflow.connections,
    settings: workflow.settings || {}
  }
  
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
    console.error('PUT failed:', response.status, error)
    return
  }
  
  const updated = await response.json()
  console.log('\n✅ Workflow updated successfully!')
  
  // Verify
  const verifyNode = updated.nodes.find(n => n.name === 'Post LinkedIn (placeholder)')
  console.log('\n=== Verification ===')
  console.log('Node credentials:', verifyNode.credentials)
  console.log('URN in jsonBody:', verifyNode.parameters.jsonBody.includes(linkedinUrn) ? '✅ Correct' : '❌ Wrong')
}

fixLinkedInNode().catch(console.error)
