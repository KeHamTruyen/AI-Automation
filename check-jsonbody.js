// Check jsonBody syntax
require('dotenv').config()

const N8N_BASE_URL = process.env.N8N_BASE_URL
const N8N_API_KEY = process.env.N8N_API_KEY

async function checkJsonBody() {
  const workflowId = 'dYWw4BkTbkFTvx9A'
  
  const response = await fetch(`${N8N_BASE_URL}/api/v1/workflows/${workflowId}`, {
    headers: { 'X-N8N-API-KEY': N8N_API_KEY },
  })
  
  const workflow = await response.json()
  const linkedInNode = workflow.nodes.find(n => n.name === 'Post LinkedIn (placeholder)')
  
  console.log('=== LinkedIn Node jsonBody ===\n')
  console.log(linkedInNode.parameters.jsonBody)
  console.log('\n\n=== Parsed (attempt) ===')
  
  // Try to extract the actual JSON part
  const jsonBodyStr = linkedInNode.parameters.jsonBody
  
  // Check if it starts with = (expression)
  if (jsonBodyStr.startsWith('=')) {
    console.log('✅ Is n8n expression (starts with =)')
    const expression = jsonBodyStr.substring(1)
    console.log('\nExpression content:')
    console.log(expression)
    
    // Check for mustache syntax
    if (expression.includes('{{')) {
      console.log('\n⚠️  Contains mustache syntax {{...}}')
      console.log('This is INVALID for n8n jsonBody expression!')
      console.log('\nn8n expressions should use JavaScript, not mustache templates')
      console.log('Example: Instead of {{$json.field}}, use ${$json.field}')
    }
  } else {
    console.log('❌ Not an n8n expression (should start with =)')
  }
}

checkJsonBody().catch(console.error)
