import pathlib,subprocess,json
import imageio_ffmpeg
from PIL import Image,ImageDraw
root=pathlib.Path(__file__).resolve().parents[1];ff=imageio_ffmpeg.get_ffmpeg_exe();manifest={}
for name,key in [('petal-transition','transition'),('poppy-film','opening'),('waiting-film','waiting'),('unsent-film','unsent'),('distance-film','distance'),('impossible-film','impossible')]:
 src=root/'art-source'/f'{name}.mp4'
 for tier,width in [('desktop',1280),('mobile',640)]:
  dest=root/'public/frames'/name/tier;dest.mkdir(parents=True,exist_ok=True)
  subprocess.run([ff,'-y','-hide_banner','-loglevel','error','-i',str(src),'-vf',f'fps=15,scale={width}:-2','-c:v','libwebp','-quality','76','-start_number','0',str(dest/'%03d.webp')],check=True)
 films=root/'public/films';films.mkdir(exist_ok=True)
 subprocess.run([ff,'-y','-hide_banner','-loglevel','error','-i',str(src),'-an','-c:v','libx264','-crf','22','-preset','fast','-g','6','-movflags','+faststart',str(films/f'{name}.mp4')],check=True)
 paths=sorted((root/'public/frames'/name/'desktop').glob('*.webp'));n=len(paths)
 manifest[key]={'count':n,'fps':15,'desktop':f'/frames/{name}/desktop','mobile':f'/frames/{name}/mobile','video':f'/films/{name}.mp4'}
 sheet=Image.new('RGB',(1280,720),(20,20,20));draw=ImageDraw.Draw(sheet)
 for j in range(8):
  i=round(j*(n-1)/7);im=Image.open(paths[i]);im.thumbnail((320,180));sheet.paste(im,(j%4*320,j//4*360));draw.text((j%4*320+10,j//4*360+185),f'{name}: frame {i}/{n}',fill='white')
 sheet.save(root/'qa'/f'{name}-contact.jpg')
(root/'public/film-manifest.json').write_text(json.dumps(manifest,indent=2));print(json.dumps(manifest))
