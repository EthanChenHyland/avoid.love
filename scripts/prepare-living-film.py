"""Encode a slow, smooth forward/reverse ambient cycle with matching seam frames."""
import argparse,json,math,pathlib,subprocess
import imageio_ffmpeg
from PIL import Image
root=pathlib.Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser();parser.add_argument('--source',default='morning-living-film');parser.add_argument('--output',default='morning-living-loop');parser.add_argument('--start-at-end',action='store_true');parser.add_argument('--frames-from-manifest');args=parser.parse_args()
if not all(c.isalnum() or c=='-' for c in args.source+args.output):raise ValueError('Invalid asset name')
ff=imageio_ffmpeg.get_ffmpeg_exe();name=args.source;fps=24;duration=18
frames=root/'art-source'/f'{name}-nativeframes';frames.mkdir(exist_ok=True)
if args.frames_from_manifest:
 manifest=json.loads((root/'public/film-manifest.json').read_text())[args.frames_from_manifest]
 sources=sorted((root/'public'/manifest['desktop'].lstrip('/')).glob('*.webp'))
 matched=frames/'matched-rgb';matched.mkdir(exist_ok=True);images=[]
 for i,source in enumerate(sources):
  path=matched/f'{i:04d}.png';Image.open(source).convert('RGB').save(path,icc_profile=None);images.append(path)
else:
 subprocess.run([ff,'-y','-hide_banner','-loglevel','error','-i',str(root/'art-source'/f'{name}.mp4'),'-vf','fps=24,scale=1280:-2',str(frames/'%04d.png')],check=True)
 images=sorted(frames.glob('*.png'))
indices=[round((1-math.cos(2*math.pi*i/(fps*duration-1)))*.5*(len(images)-1)) for i in range(fps*duration)]
if args.start_at_end:indices=[len(images)-1-i for i in indices]
listing=frames/'loop.ffconcat';listing.write_text('ffconcat version 1.0\n'+''.join(f"file '{images[i]}'\nduration {1/fps:.12f}\n" for i in indices))
for suffix,width in [('',1280),('-mobile',960)]:
 subprocess.run([ff,'-y','-hide_banner','-loglevel','error','-safe','0','-f','concat','-i',str(listing),'-vf',f'fps={fps},scale={width}:-2:in_range=pc:out_color_matrix=bt709:out_range=tv','-frames:v',str(len(indices)),'-an','-c:v','libx264','-pix_fmt','yuv420p','-colorspace','bt709','-color_primaries','bt709','-color_trc','bt709','-color_range','tv','-crf','21','-preset','fast','-g','24','-movflags','+faststart',str(root/'public/films'/f'{args.output}{suffix}.mp4')],check=True)
report={'source':name,'duration':duration,'fps':fps,'frames':len(indices),'firstSourceFrame':indices[0],'lastSourceFrame':indices[-1],'maximumSourceFrameStep':max(abs(a-b) for a,b in zip(indices,indices[1:])),'retiming':'cosine forward/reverse; same frame at seam; zero-speed turns'}
(root/'research'/('living-ending-export.json' if args.output=='morning-living-loop' else f'{args.output}-export.json')).write_text(json.dumps(report,indent=2));print(report)
