// Test LinkedIn API call directly
require('dotenv').config()

const N8N_BASE_URL = process.env.N8N_BASE_URL
const N8N_API_KEY = process.env.N8N_API_KEY

async function testLinkedInExecution() {
  const workflowId = 'dYWw4BkTbkFTvx9A'
  
  // Trigger webhook with test data
  const webhookUrl = 'https://n8n.daisuyeuthuong.com/webhook/user-cmiwy249i000152h9ryfc2tev-1765557572144'
  
  console.log('Triggering PRODUCTION webhook:', webhookUrl)
  
  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content_text: 'Test LinkedIn post from automation',
      platform: 'linkedin',
      platforms: ['linkedin'],
      hashtags: ['#test'],
      media: []
    })
  })
  
  const result = await response.text()
  console.log('\nResponse status:', response.status)
  console.log('Response:', result.substring(0, 500))
  
  // Get executions
  console.log('\n\nFetching recent executions...')
  const execResponse = await fetch(`${N8N_BASE_URL}/api/v1/executions?workflowId=${workflowId}&limit=3`, {
    headers: { 'X-N8N-API-KEY': N8N_API_KEY },
  })
  
  const execData = await execResponse.json()
  
  if (execData.data && execData.data.length > 0) {
    const latest = execData.data[0]
    console.log('\nLatest execution:')
    console.log('ID:', latest.id)
    console.log('Status:', latest.status)
    console.log('Finished:', latest.finished)
    console.log('Mode:', latest.mode)
    
    if (latest.status === 'error') {
      console.log('\n❌ Error:', latest.data?.resultData?.error?.message)
    }
  }
}

testLinkedInExecution().catch(console.error)
