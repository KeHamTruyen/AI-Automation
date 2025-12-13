const https = require('https');

const N8N_API_KEY = 'n8n_api_4ec6fe43ecc5f2fe2f6a7e65f15657b25c0e1958e933e6dd9f51f8ea2caeb69a';
const WORKFLOW_ID = 'dYWw4BkTbkFTvx9A';

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'n8n.daisuyeuthuong.com',
      port: 443,
      path: path,
      method: 'GET',
      headers: {
        'X-N8N-API-KEY': N8N_API_KEY,
        'Accept': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function main() {
  console.log('🔍 Fetching workflow...\n');
  const workflow = await makeRequest(`/api/v1/workflows/${WORKFLOW_ID}`);
  
  console.log('Workflow response:', JSON.stringify(workflow, null, 2).substring(0, 500));
  
  if (!workflow || !workflow.nodes) {
    console.log('❌ Invalid workflow response');
    return;
  }
  
  const linkedinNode = workflow.nodes.find(n => 
    n.name === 'Post LinkedIn' || 
    n.type === 'n8n-nodes-base.httpRequest' && 
    n.parameters?.url?.includes('linkedin.com')
  );

  if (!linkedinNode) {
    console.log('❌ No LinkedIn node found!');
    return;
  }

  console.log('📋 LinkedIn Node Details:');
  console.log('Name:', linkedinNode.name);
  console.log('Type:', linkedinNode.type);
  console.log('\n🔑 Credentials:');
  console.log(JSON.stringify(linkedinNode.credentials, null, 2));
  
  console.log('\n📝 Parameters:');
  console.log('Authentication:', linkedinNode.parameters?.authentication);
  console.log('URL:', linkedinNode.parameters?.url);
  
  console.log('\n📦 Full Node:');
  console.log(JSON.stringify(linkedinNode, null, 2));

  // Check all credentials
  console.log('\n\n🔍 Fetching all credentials...\n');
  const creds = await makeRequest('/api/v1/credentials');
  console.log('Total credentials:', creds.data?.length || 0);
  
  const httpAuthCreds = creds.data?.filter(c => c.type === 'httpHeaderAuth') || [];
  console.log('\n📋 httpHeaderAuth credentials:');
  httpAuthCreds.forEach(c => {
    console.log(`  - ID: ${c.id}, Name: ${c.name}`);
  });

  const oauth2Creds = creds.data?.filter(c => c.type === 'oAuth2Api') || [];
  console.log('\n📋 oAuth2Api credentials:');
  oauth2Creds.forEach(c => {
    console.log(`  - ID: ${c.id}, Name: ${c.name}`);
  });
}

main().catch(console.error);
