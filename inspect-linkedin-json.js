const https = require('https');
require('dotenv').config();

const N8N_BASE_URL = process.env.N8N_BASE_URL;
const N8N_API_KEY = process.env.N8N_API_KEY;

async function checkLinkedInNode() {
  const workflowId = 'dYWw4BkTbkFTvx9A';
  
  const response = await fetch(`${N8N_BASE_URL}/api/v1/workflows/${workflowId}`, {
    headers: { 'X-N8N-API-KEY': N8N_API_KEY }
  });
  
  const workflow = await response.json();
  const linkedInNode = workflow.nodes.find(n => 
    n.name === 'Post LinkedIn (placeholder)' || 
    n.name === 'Post LinkedIn'
  );
  
  if (!linkedInNode) {
    console.log('❌ No LinkedIn node found');
    return;
  }
  
  console.log('📋 LinkedIn Node Configuration:\n');
  console.log('Name:', linkedInNode.name);
  console.log('Type:', linkedInNode.type);
  console.log('\n🔑 Authentication:');
  console.log('  method:', linkedInNode.parameters?.authentication);
  console.log('  nodeCredentialType:', linkedInNode.parameters?.nodeCredentialType);
  console.log('\n📝 JSON Body (raw):');
  console.log('---START---');
  console.log(linkedInNode.parameters?.jsonBody);
  console.log('---END---');
  
  console.log('\n🔍 Checking format:');
  const jsonBody = linkedInNode.parameters?.jsonBody || '';
  console.log('  Starts with "=": ', jsonBody.startsWith('=') ? '✅' : '❌');
  console.log('  Contains JSON.stringify:', jsonBody.includes('JSON.stringify') ? '⚠️ YES' : '✅ NO');
  console.log('  Contains ${}: ', jsonBody.includes('${') ? '✅' : '❌');
  console.log('  Contains author URN:', jsonBody.includes('jdAD7Nozqp') ? '✅' : '❌');
}

checkLinkedInNode().catch(console.error);
