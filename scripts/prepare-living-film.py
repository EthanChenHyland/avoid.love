"""Encode a slow, smooth forward/reverse ambient cycle with matching seam frames."""
import json,math,pathlib,subprocess
import imageio_ffmpeg
root=pathlib.Path(__file__).resolve().parents[1]
ff=imageio_ffmpeg.get_ffmpeg_exe();name='morning-living-film';fps=24;duration=18
frames=root/'art-source'/f'{name}-nativeframes';frames.mkdir(exist_ok=True)
subprocess.run([ff,'-y','-hide_banner','-loglevel','error','-i',str(root/'art-source'/f'{name}.mp4'),'-vf','fps=24,scale=1280:-2',str(frames/'%04d.png')],check=True)
images=sorted(frames.glob('*.png'));indices=[round((1-math.cos(2*math.pi*i/(fps*duration-1)))*.5*(len(images)-1)) for i in range(fps*duration)]
listing=frames/'loop.ffconcat';listing.write_text('ffconcat version 1.0\n'+''.join(f"file '{images[i].name}'\nduration {1/fps:.12f}\n" for i in indices))
for suffix,width in [('',1280),('-mobile',960)]:
 subprocess.run([ff,'-y','-hide_banner','-loglevel','error','-safe','0','-f','concat','-i',str(listing),'-vf',f'fps={fps},scale={width}:-2','-frames:v',str(len(indices)),'-an','-c:v','libx264','-pix_fmt','yuv420p','-crf','21','-preset','fast','-g','24','-movflags','+faststart',str(root/'public/films'/f'morning-living-loop{suffix}.mp4')],check=True)
report={'source':name,'duration':duration,'fps':fps,'frames':len(indices),'firstSourceFrame':indices[0],'lastSourceFrame':indices[-1],'maximumSourceFrameStep':max(abs(a-b) for a,b in zip(indices,indices[1:])),'retiming':'cosine forward/reverse; same frame at seam; zero-speed turns'}
(root/'research/living-ending-export.json').write_text(json.dumps(report,indent=2));print(report)
