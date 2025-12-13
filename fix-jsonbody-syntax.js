// Fix jsonBody with correct n8n syntax
require('dotenv').config()

const N8N_BASE_URL = process.env.N8N_BASE_URL
const N8N_API_KEY = process.env.N8N_API_KEY

async function fixJsonBody() {
  const workflowId = 'dYWw4BkTbkFTvx9A'
  const linkedinUrn = 'urn:li:person:jdAD7Nozqp'
  
  // Get workflow
  const response = await fetch(`${N8N_BASE_URL}/api/v1/workflows/${workflowId}`, {
    headers: { 'X-N8N-API-KEY': N8N_API_KEY },
  })
  const workflow = await response.json()
  
  // Find LinkedIn node
  const linkedInNode = workflow.nodes.find(n => n.name === 'Post LinkedIn (placeholder)')
  
  // Fix: Use template literal with ${} instead of {{}}
  // n8n expressions with "=" prefix are evaluated as JavaScript
  linkedInNode.parameters.jsonBody = `={
  "author": "${linkedinUrn}",
  "lifecycleState": "PUBLISHED",
  "specificContent": {
    "com.linkedin.ugc.ShareContent": {
      "shareCommentary": {
        "text": \${$json.content_text || 'Hello LinkedIn'}
      },
      "shareMediaCategory": "NONE"
    }
  },
  "visibility": {
    "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
  }
}`
  
  console.log('Updated jsonBody:')
  console.log(linkedInNode.parameters.jsonBody)
  
  // Update workflow
  const cleanWorkflow = {
    name: workflow.name,
    nodes: workflow.nodes,
    connections: workflow.connections,
    settings: workflow.settings || {}
  }
  
  console.log('\nUpdating workflow...')
  const updateResponse = await fetch(`${N8N_BASE_URL}/api/v1/workflows/${workflowId}`, {
    method: 'PUT',
    headers: {
      'X-N8N-API-KEY': N8N_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cleanWorkflow),
  })
  
  if (!updateResponse.ok) {
    const error = await updateResponse.text()
    console.error('❌ Update failed:', updateResponse.status, error)
    return
  }
  
  console.log('✅ Workflow updated!')
  
  // Verify
  const verifyResponse = await fetch(`${N8N_BASE_URL}/api/v1/workflows/${workflowId}`, {
    headers: { 'X-N8N-API-KEY': N8N_API_KEY },
  })
  const verified = await verifyResponse.json()
  const verifyNode = verified.nodes.find(n => n.name === 'Post LinkedIn (placeholder)')
  
  console.log('\n=== Verification ===')
  const hasCorrectSyntax = verifyNode.parameters.jsonBody.includes('${')
  console.log('Uses ${} syntax:', hasCorrectSyntax ? '✅' : '❌')
  console.log('Has URN:', verifyNode.parameters.jsonBody.includes(linkedinUrn) ? '✅' : '❌')
}

fixJsonBody().catch(console.error)
