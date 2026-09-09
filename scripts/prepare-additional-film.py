"""Export one additional film without touching the accepted six sequences."""
import pathlib,subprocess,json,sys
import imageio_ffmpeg
root=pathlib.Path(__file__).resolve().parents[1];name,key=sys.argv[1:3]
if not all(c.isalnum() or c=='-' for c in name+key):raise ValueError('Invalid asset name')
source=root/'art-source'/f'{name}.mp4';ff=imageio_ffmpeg.get_ffmpeg_exe()
for tier,width in [('desktop',1280),('mobile',640)]:
 dest=root/'public/frames'/name/tier;dest.mkdir(parents=True,exist_ok=True)
 subprocess.run([ff,'-y','-hide_banner','-loglevel','error','-i',str(source),'-vf',f'fps=15,scale={width}:-2','-c:v','libwebp','-quality','76','-start_number','0',str(dest/'%03d.webp')],check=True)
subprocess.run([ff,'-y','-hide_banner','-loglevel','error','-i',str(source),'-an','-c:v','libx264','-crf','22','-preset','fast','-g','6','-movflags','+faststart',str(root/'public/films'/f'{name}.mp4')],check=True)
path=root/'public/film-manifest.json';manifest=json.loads(path.read_text());count=len(list((root/'public/frames'/name/'desktop').glob('*.webp')));manifest[key]={'count':count,'fps':15,'desktop':f'/frames/{name}/desktop','mobile':f'/frames/{name}/mobile','video':f'/films/{name}.mp4'};path.write_text(json.dumps(manifest,indent=2));print(name,count,'frames exported')
