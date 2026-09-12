"""Reject frame-level lighting resets, including ones hidden by chapter tests."""
import json,pathlib,subprocess
from PIL import Image,ImageChops,ImageStat
import imageio_ffmpeg
root=pathlib.Path(__file__).resolve().parents[1];manifest=json.loads((root/'public/film-manifest.json').read_text())['spare']
frames=[Image.open(p).convert('RGB').resize((160,90)) for p in sorted((root/'public'/manifest['desktop'].lstrip('/')).glob('*.webp'))]
def change(a,b):return sum(ImageStat.Stat(ImageChops.difference(a,b)).mean)/3/255
light=[sum(ImageStat.Stat(im).mean)/3/255 for im in frames];deltas=[change(a,b) for a,b in zip(frames,frames[1:])]
report={'frames':len(frames),'largestAdjacentChange':max(deltas),'largestBrightnessStep':max(abs(a-b) for a,b in zip(light,light[1:])),'worstFrame':deltas.index(max(deltas))+1}
assert report['largestAdjacentChange']<.008,report
assert report['largestBrightnessStep']<.004,report
for tier,suffix in [('desktop',''),('mobile','-mobile')]:
 out=root/'qa'/f'steady-{tier}-%02d.png'
 subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(),'-y','-loglevel','error','-i',str(root/'public/films'/f'morning-steady-loop{suffix}.mp4'),'-vf','select=eq(n\\,0)+eq(n\\,431),scale=160:90','-vsync','0',str(out)],check=True)
 first=Image.open(root/'qa'/f'steady-{tier}-01.png').convert('RGB');last=Image.open(root/'qa'/f'steady-{tier}-02.png').convert('RGB')
 report[tier]={'handoff':change(frames[-1],first),'loopSeam':change(first,last)}
 assert report[tier]['handoff']<.012,report
 assert report[tier]['loopSeam']<.006,report
(root/'qa/steady-source.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2))
