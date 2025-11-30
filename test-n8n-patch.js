// Test script để kiểm tra PATCH method có bị chặn không
const N8N_API_BASE_URL = process.env.N8N_API_BASE_URL
const N8N_API_KEY = process.env.N8N_API_KEY

if (!N8N_API_BASE_URL || !N8N_API_KEY) {
  console.error('❌ Thiếu N8N_API_BASE_URL hoặc N8N_API_KEY')
  process.exit(1)
}

async function testPatch() {
  console.log('🔍 Testing n8n PATCH method...')
  console.log('URL:', N8N_API_BASE_URL)
  
  try {
    // 1. Lấy danh sách workflows
    console.log('\n1️⃣ Getting workflows list...')
    const listRes = await fetch(`${N8N_API_BASE_URL}/workflows`, {
      headers: {
        'X-N8N-API-KEY': N8N_API_KEY,
        'Authorization': `Bearer ${N8N_API_KEY}`,
      }
    })
    
    if (!listRes.ok) {
      throw new Error(`GET workflows failed: ${listRes.status} ${listRes.statusText}`)
    }
    
    const workflows = await listRes.json()
    console.log(`✅ Found ${workflows.data?.length || 0} workflows`)
    
    if (!workflows.data || workflows.data.length === 0) {
      console.log('⚠️  No workflows found to test PATCH')
      return
    }
    
    const testWorkflow = workflows.data[0]
    console.log(`\n2️⃣ Testing PATCH on workflow: ${testWorkflow.id} (${testWorkflow.name})`)
    
    // 2. Thử PATCH workflow (chỉ update tags - thay đổi vô hại)
    const patchRes = await fetch(`${N8N_API_BASE_URL}/workflows/${testWorkflow.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-N8N-API-KEY': N8N_API_KEY,
        'Authorization': `Bearer ${N8N_API_KEY}`,
      },
      body: JSON.stringify({
        tags: testWorkflow.tags || []
      })
    })
    
    console.log(`Response status: ${patchRes.status} ${patchRes.statusText}`)
    const responseText = await patchRes.text()
    
    if (patchRes.status === 405) {
      console.log('\n❌ PATCH BỊ CHẶN (405 Method Not Allowed)')
      console.log('Response:', responseText)
      console.log('\n🔧 Nguyên nhân: Nginx/proxy đang chặn PATCH method')
      console.log('📝 Giải pháp: Cần cấu hình nginx cho phép PATCH:')
      console.log(`
location /api/v1/ {
    proxy_pass http://n8n:5678;
    
    # Cho phép PATCH method
    if ($request_method !~ ^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)$) {
        return 405;
    }
    
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
      `)
    } else if (patchRes.ok) {
      console.log('\n✅ PATCH HOẠT ĐỘNG BÌNH THƯỜNG!')
      console.log('Vấn đề không phải từ n8n server.')
      console.log('Response:', responseText.substring(0, 200))
    } else {
      console.log('\n⚠️  PATCH failed với lỗi khác (không phải 405):')
      console.log('Response:', responseText)
    }
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message)
  }
}

testPatch()
