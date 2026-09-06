"""Submit/poll OpenRouter films without exposing credentials or signed media URLs."""
from generate import ROOT,credential
import json,sys,base64,urllib.request,urllib.error,urllib.parse,pathlib
class SafeRedirect(urllib.request.HTTPRedirectHandler):
 def redirect_request(self,req,fp,code,msg,headers,newurl):
  out=super().redirect_request(req,fp,code,msg,headers,newurl)
  if out and urllib.parse.urlparse(newurl).hostname!='openrouter.ai':out.remove_header('Authorization')
  return out
opener=urllib.request.build_opener(SafeRedirect())
def api(url,body=None):
 if urllib.parse.urlparse(url).hostname!='openrouter.ai':raise ValueError('Untrusted credential destination')
 req=urllib.request.Request(url,data=json.dumps(body).encode() if body else None,headers={'Authorization':'Bearer '+credential(),'Content-Type':'application/json'})
 return opener.open(req,timeout=180)
mode=sys.argv[1]
if mode=='submit':
 jobs=json.load(open(sys.argv[2]))
 for job in jobs:
  name=job['name'];path=ROOT/'research'/f'video-{name}.json'
  if path.exists():print(name,'already submitted');continue
  body={k:v for k,v in job.items() if k not in ['name','first','last']}
  body['frame_images']=[]
  for label in ['first','last']:
   if job.get(label):body['frame_images'].append({'type':'image_url','frame_type':label+'_frame','image_url':{'url':'data:image/png;base64,'+base64.b64encode((ROOT/'art-source'/job[label]).read_bytes()).decode()}})
  try:
   with api('https://openrouter.ai/api/v1/videos',body) as r:result=json.load(r)
   path.write_text(json.dumps({'job':job,'result':result},indent=2));print(name,result['status'])
  except urllib.error.HTTPError as e:print(name,'HTTP',e.code)
elif mode=='poll':
 for path in sorted((ROOT/'research').glob('video-*.json')):
  data=json.loads(path.read_text())
  if 'result' not in data:continue
  name=data['job']['name'];out=ROOT/'art-source'/f'{name}.mp4'
  if out.exists():print(name,'downloaded');continue
  try:
   with api(data['result']['polling_url']) as r:result=json.load(r)
   data['result']=result;path.write_text(json.dumps(data,indent=2));print(name,result['status'],result.get('usage',{}))
   if result['status']=='completed':
    # Use the documented trusted content endpoint; strip auth on cross-origin redirect.
    with api('https://openrouter.ai/api/v1/videos/'+result['id']+'/content?index=0') as r:out.write_bytes(r.read())
    print(name,'saved',out.stat().st_size)
  except urllib.error.HTTPError as e:print(name,'HTTP',e.code)
