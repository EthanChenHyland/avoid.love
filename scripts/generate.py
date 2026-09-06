"""Local-only OpenRouter image production. Credentials are never persisted or logged."""
import os,re,json,pathlib,urllib.request,urllib.error,base64,time,sys,concurrent.futures
ROOT=pathlib.Path(__file__).resolve().parents[1]
def credential():
 key=os.getenv('OPENROUTER_API_KEY')
 if not key:
  p=pathlib.Path.home()/'.codex/.env'
  m=re.search(r'^\s*(?:export\s+)?OPENROUTER_API_KEY\s*=\s*(.+)',p.read_text(),re.M)
  key=m.group(1).strip().strip('\"\'') if m else None
 if not key: raise RuntimeError('OPENROUTER_API_KEY unavailable')
 return key

def generate(job):
 name=job['name'];out=ROOT/'art-source'/f'{name}.png'
 if out.exists(): return {'name':name,'status':'already exists'}
 body={k:v for k,v in job.items() if k not in ['name','references']}
 if job.get('references'):
  body['input_references']=[{'type':'image_url','image_url':{'url':'data:image/png;base64,'+base64.b64encode((ROOT/'art-source'/f).read_bytes()).decode()}} for f in job['references']]
 req=urllib.request.Request('https://openrouter.ai/api/v1/images',data=json.dumps(body).encode(),headers={'Authorization':'Bearer '+credential(),'Content-Type':'application/json'})
 start=time.time()
 try:
  with urllib.request.urlopen(req,timeout=300) as r: data=json.load(r)
  out.write_bytes(base64.b64decode(data['data'][0]['b64_json']))
  record={'name':name,'model':job['model'],'prompt':job['prompt'],'seconds':round(time.time()-start,1),'usage':data.get('usage'),'bytes':out.stat().st_size,'status':'generated'}
 except urllib.error.HTTPError as e:
  record={'name':name,'status':'failed','http':e.code,'seconds':round(time.time()-start,1)}
 except Exception as e: record={'name':name,'status':'failed','error':type(e).__name__,'seconds':round(time.time()-start,1)}
 (ROOT/'research'/f'generation-{name}.json').write_text(json.dumps(record,indent=2));return record
if __name__=='__main__':
 jobs=json.loads(pathlib.Path(sys.argv[1]).read_text())
 with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
  for result in pool.map(generate,jobs):print(json.dumps(result),flush=True)
