// Test script to check LinkedIn node in n8n workflow
require('dotenv').config()

const N8N_BASE_URL = process.env.N8N_BASE_URL
const N8N_API_KEY = process.env.N8N_API_KEY

async function checkWorkflow() {
  // Get user's workflow ID from database
  const userId = 'cmiwy249i000152h9ryfc2tev' // From logs
  
  // Fetch workflow
  const workflowId = 'dYWw4BkTbkFTvx9A' // From logs
  
  const response = await fetch(`${N8N_BASE_URL}/api/v1/workflows/${workflowId}`, {
    headers: {
      'X-N8N-API-KEY': N8N_API_KEY,
    },
  })
  
  const workflow = await response.json()
  
  console.log('=== Workflow Info ===')
  console.log('ID:', workflow.id)
  console.log('Name:', workflow.name)
  console.log('Active:', workflow.active)
  console.log('\n=== LinkedIn Nodes ===')
  
  // Find LinkedIn nodes
  const linkedInNodes = workflow.nodes.filter(n => 
    n.name?.toLowerCase().includes('linkedin') || 
    n.type?.includes('httpRequest')
  )
  
  linkedInNodes.forEach(node => {
    console.log('\n--- Node:', node.name)
    console.log('Type:', node.type)
    console.log('Disabled:', node.disabled)
    console.log('Parameters:', JSON.stringify(node.parameters, null, 2))
    console.log('Credentials:', JSON.stringify(node.credentials, null, 2))
  })
}

checkWorkflow().catch(console.error)
