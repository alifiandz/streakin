import {spawnSync} from 'node:child_process';
for(const file of ['tests/demo-account.mjs','tests/google-auth.mjs','tests/google-auth-dom.mjs','tests/training.mjs','tests/v3-api.mjs','tests/refinement-meta.mjs','tests/stage-art.mjs','tests/product-completeness.mjs','tests/v3-server.mjs','tests/v3-dom.mjs']){
 const result=spawnSync(process.execPath,[file],{stdio:'inherit'});if(result.status!==0)process.exit(result.status||1);
}
