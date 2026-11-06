import {spawnSync} from 'node:child_process';
for(const file of ['tests/training.mjs','tests/v3-api.mjs','tests/refinement-meta.mjs','tests/v3-server.mjs','tests/v3-dom.mjs']){
 const result=spawnSync(process.execPath,[file],{stdio:'inherit'});if(result.status!==0)process.exit(result.status||1);
}
