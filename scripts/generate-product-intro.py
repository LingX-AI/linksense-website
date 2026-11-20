#!/usr/bin/env python3
"""Render the authored LinkSense product tour from the approved Figma exports.

Requires Pillow and FFmpeg with libx264. Assets stay in the repository; no
network requests, browser capture, or previous product videos are involved.

Example:
  python3 scripts/generate-product-intro.py --ffmpeg /path/to/ffmpeg

The bundled logo PNG is an exact raster export of brand/figma-lockup-light.svg.
Regenerate it from that source if the approved vector changes.
"""

from __future__ import annotations

import argparse
from functools import lru_cache
import os
from pathlib import Path
import shutil
import subprocess

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
WIDTH, HEIGHT, FPS, DURATION = 1280, 720, 30, 27.6
BLUE = (24, 102, 225)
INK = (27, 29, 32)
MUTED = (82, 97, 116)
LINE = (220, 229, 241)
FONT_FILE = Path('/System/Library/Fonts/HelveticaNeue.ttc')
SCENES = [(0, 2.8), (2.8, 8.2), (8.2, 13.8), (13.8, 18.6), (18.6, 23.7), (23.7, 27.6)]


def ease(value: float) -> float:
    value = max(0.0, min(1.0, value))
    return 1 - (1 - value) ** 3


def smooth(value: float) -> float:
    value = max(0.0, min(1.0, value))
    return value * value * (3 - 2 * value)


@lru_cache(maxsize=48)
def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    try:
        return ImageFont.truetype(str(FONT_FILE), size, index=1 if bold and FONT_FILE.suffix == '.ttc' else 0)
    except OSError:
        return ImageFont.truetype('DejaVuSans-Bold.ttf' if bold else 'DejaVuSans.ttf', size)


def text(draw: ImageDraw.ImageDraw, xy, value, size=24, fill=INK, bold=False, spacing=6):
    draw.multiline_text(xy, value, font=font(size, bold), fill=fill, spacing=spacing)


def rgba_paste(canvas: Image.Image, layer: Image.Image, xy, alpha=1.0):
    if alpha < 1:
        layer = layer.copy()
        layer.putalpha(layer.getchannel('A').point(lambda p: round(p * max(0.0, alpha))))
    canvas.alpha_composite(layer, tuple(map(round, xy)))


def rounded_mask(size, radius):
    mask = Image.new('L', size)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, size[0] - 1, size[1] - 1), radius, fill=255)
    return mask


def background():
    image = Image.new('RGBA', (WIDTH, HEIGHT), (247, 250, 255, 255))
    draw = ImageDraw.Draw(image)
    # A light blue wash from the same blue/neutral website palette.
    for x in range(WIDTH):
        p = x / WIDTH
        draw.line((x, 0, x, HEIGHT), fill=(round(249 - 12*p), round(251 - 7*p), 255, 255))
    return image


def logo(canvas, xy=(56, 34), width=150, alpha=1.0):
    source = LOGO
    height = round(width * source.height / source.width)
    rgba_paste(canvas, source.resize((width, height), Image.Resampling.LANCZOS), xy, alpha)


def base_frame(chapter=-1, progress=0):
    image = BACKGROUND.copy()
    logo(image)
    draw = ImageDraw.Draw(image)
    text(draw, (1026, 43), 'PRODUCT TOUR', 12, MUTED, True)
    draw.rounded_rectangle((56, 674, 1224, 677), 1, fill=(216, 228, 247))
    draw.rounded_rectangle((56, 674, 56 + round(1168 * progress), 677), 1, fill=BLUE)
    text(draw, (56, 691), 'Illustrative product tour · Sample data', 11, MUTED)
    labels = ['Task', 'Files', 'Skills', 'Tools']
    for i, label in enumerate(labels):
        text(draw, (966 + i * 70, 691), label, 11, BLUE if chapter == i else MUTED, chapter == i)
    return image


def cursor(canvas, x, y, click=0):
    layer = Image.new('RGBA', canvas.size)
    draw = ImageDraw.Draw(layer)
    if click > 0:
        radius = 8 + 19 * click
        draw.ellipse((x-radius, y-radius, x+radius, y+radius), outline=(*BLUE, round(170*(1-click))), width=2)
    draw.polygon([(x, y), (x+2, y+22), (x+8, y+16), (x+13, y+25), (x+18, y+22), (x+12, y+14), (x+21, y+12)], fill=(*INK, 255), outline=(255,255,255,255), width=1)
    return Image.alpha_composite(canvas, layer)


def screen(canvas, source, time, zoom=1.0, focus=(.5, .5), arrival=True, highlight=None):
    x, y, w, h = 374, 111, 850, 531
    shift = round((1-ease(time / .7)) * 46) if arrival else 0
    alpha = ease(time / .45) if arrival else 1
    crop_w, crop_h = source.width / zoom, source.height / zoom
    crop_x = max(0, min(source.width-crop_w, source.width*focus[0]-crop_w/2))
    crop_y = max(0, min(source.height-crop_h, source.height*focus[1]-crop_h/2))
    surface = source.transform((w,h), Image.Transform.EXTENT, (crop_x,crop_y,crop_x+crop_w,crop_y+crop_h), Image.Resampling.BICUBIC).convert('RGBA')
    if highlight:
        (left, top, right, bottom), strength = highlight
        focus_layer = Image.new('RGBA', surface.size)
        d = ImageDraw.Draw(focus_layer)
        bounds=((left-crop_x)*w/crop_w,(top-crop_y)*h/crop_h,(right-crop_x)*w/crop_w,(bottom-crop_y)*h/crop_h)
        d.rounded_rectangle(bounds, 5, fill=(*BLUE, round(16*strength)), outline=(*BLUE, round(220*strength)), width=2)
        surface = Image.alpha_composite(surface, focus_layer)
    surface.putalpha(rounded_mask((w,h), 12))
    shadow = Image.new('RGBA', canvas.size)
    ImageDraw.Draw(shadow).rounded_rectangle((x+shift+3,y+12,x+shift+w-3,y+h+12),12,fill=(29,60,102,39))
    shadow = shadow.filter(ImageFilter.GaussianBlur(18))
    canvas = Image.alpha_composite(canvas, shadow)
    rgba_paste(canvas, surface, (x+shift,y), alpha)
    return canvas, (x+shift,y,w,h,crop_x,crop_y,crop_w,crop_h)


def point_on_screen(geometry, source_x, source_y):
    x,y,w,h,cx,cy,cw,ch=geometry
    return x+(source_x-cx)*w/cw, y+(source_y-cy)*h/ch


def caption(canvas, title, body, local, detail=None):
    layer = Image.new('RGBA', canvas.size)
    draw = ImageDraw.Draw(layer)
    offset=round((1-ease(local/.65))*12)
    text(draw, (56, 177+offset), title, 43, INK, True, spacing=4)
    draw.rounded_rectangle((58, 350+offset, 93, 354+offset), 2, fill=BLUE)
    text(draw, (58, 379+offset), body, 20, MUTED, spacing=7)
    if detail:
        text(draw, (58, 495+offset), detail, 13, BLUE, True)
    return Image.alpha_composite(canvas, layer)


def file_card(canvas, xy, title, extension, size, amount, sheet=False):
    if amount <= 0:
        return canvas
    x,y=xy
    y += round((1-ease(amount))*16)
    layer=Image.new('RGBA',canvas.size)
    d=ImageDraw.Draw(layer)
    d.rounded_rectangle((x,y,x+276,y+64),11,fill=(255,255,255),outline=LINE,width=1)
    color=(35,118,82) if sheet else BLUE
    d.rounded_rectangle((x+12,y+14,x+44,y+49),5,fill=(*color,18))
    text(d,(x+17,y+25),extension,9,color,True)
    text(d,(x+57,y+13),title,14,INK,True)
    text(d,(x+57,y+36),size,12,MUTED)
    rgba_paste(canvas,layer,(0,0),ease(amount))
    return canvas


def render_scene(index, t, global_t):
    image=base_frame(index-1,global_t/DURATION)
    if index == 0:
        logo(image,(70,117),276,ease(t/.5))
        d=ImageDraw.Draw(image)
        reveal=ease((t-.25)/.8)
        title=Image.new('RGBA',image.size)
        td=ImageDraw.Draw(title)
        text(td,(68,245),'One workspace.\nFrom request to result.',58,INK,True,6)
        title.putalpha(title.getchannel('A').point(lambda p:round(p*reveal)))
        image=Image.alpha_composite(image,title)
        d=ImageDraw.Draw(image)
        text(d,(72,430),'Work with AI. Keep the method. Share the result.',23,MUTED)
        # An actual product screen arrives behind the opening statement.
        thumb=SCREENS['overview'].resize((512,320),Image.Resampling.LANCZOS).convert('RGBA')
        thumb.putalpha(rounded_mask(thumb.size,12))
        rgba_paste(image,thumb,(720+round((1-ease((t-.6)/.9))*90),155),ease((t-.6)/.7))
        return image
    if index == 1:
        image=caption(image,'Start with\na real task.','Ask for the outcome.\nKeep the context close.',t)
        source=SCREENS['workspace'].copy()
        # Reveal only original pixels: the approved message and reply form the
        # narrative; no generated UI, fabricated metrics, or old recordings.
        d=ImageDraw.Draw(source)
        typing=smooth((t-.3)/1.15)
        if typing < 1:
            d.rectangle((854+round(540*typing),149,1395,167),fill=(244,245,247))
        response=smooth((t-1.5)/1.9)
        if response < 1:
            d.rectangle((298,244+round(277*response),1415,522),fill=(255,255,255))
        zoom=1+.10*smooth(t/5.4)
        image,g=screen(image,source,t,zoom,(.57,.37))
        if t>4.35:
            target=point_on_screen(g,1392,33)
            move=ease((t-4.35)/.55)
            x=990+(target[0]-990)*move; y=435+(target[1]-435)*move
            image=cursor(image,x,y,max(0,min(1,(t-4.95)/.4)))
        return image
    if index == 2:
        image=caption(image,'Take the\nfinished files.','Review the result.\nCheck its sources.',t)
        source=SCREENS['overview'].copy()
        panel=source.crop((1091,73,1415,411))
        if t<.7:
            # Open the exported task-overview surface, keeping the source UI.
            source.paste(SCREENS['workspace'].crop((1091,73,1415,411)),(1091,73))
            reveal=ease(t/.65)
            source.paste(panel.crop((0,0,round(panel.width*reveal),panel.height)),(1091,73))
        zoom=1.03+.10*smooth(t/5.6)
        highlight=None
        if 1.35<t<2.7:
            highlight=((1104,197,1399,246),min(1,(t-1.35)/.2))
        if 3.0<t<4.7:
            highlight=((1104,142,1399,192),min(1,(t-3)/.2))
        image,g=screen(image,source,t,zoom,(.64,.35),highlight=highlight)
        image=file_card(image,(58,476),'Enrollment analysis','XLSX','Workbook · 96 KB',(t-1.55)/.5,True)
        image=file_card(image,(58,552),'Q3 enrollment brief','PDF','Briefing · 248 KB',(t-3.15)/.5)
        if t>.7:
            start=point_on_screen(g,1391,34)
            if t<2.8:
                destination=point_on_screen(g,1377,222)
                p=ease((t-.7)/.6)
                xy=(start[0]+(destination[0]-start[0])*p,start[1]+(destination[1]-start[1])*p)
                click=max(0,min(1,(t-1.55)/.45)) if t<2.05 else 0
            else:
                a=point_on_screen(g,1377,222); b=point_on_screen(g,1377,167)
                p=ease((t-2.8)/.5); xy=(a[0]+(b[0]-a[0])*p,a[1]+(b[1]-a[1])*p)
                click=max(0,min(1,(t-3.35)/.45)) if t<3.8 else 0
            image=cursor(image,*xy,click)
        return image
    if index == 3:
        image=caption(image,'Keep the\ngood methods.','Share skills and apps\nwith the next teammate.',t)
        source=SCREENS['skills']
        if t>2.65:
            source=Image.blend(source,SCREENS['apps'],smooth((t-2.65)/.4))
        image,g=screen(image,source,t,1+.075*smooth(t/4.8),(.59,.46))
        if 1.8<t<3.2:
            p=ease((t-1.8)/.6)
            a=point_on_screen(g,699,435); b=point_on_screen(g,351,230)
            image=cursor(image,a[0]+(b[0]-a[0])*p,a[1]+(b[1]-a[1])*p,max(0,min(1,(t-2.45)/.35)))
        return image
    if index == 4:
        image=caption(image,'Bring your\ntools along.','Work with documents,\nmail and business systems.',t)
        highlight=((301,445,1410,509),min(1,max(0,(t-1.25)/.35))) if 1.25<t<3.1 else None
        image,g=screen(image,SCREENS['connections'],t,1+.07*smooth(t/5.1),(.60,.46),highlight=highlight)
        if t>1.0:
            p=ease((t-1)/1.1)
            a=point_on_screen(g,646,545); b=point_on_screen(g,1288,477)
            image=cursor(image,a[0]+(b[0]-a[0])*p,a[1]+(b[1]-a[1])*p)
        return image
    # Closing image keeps an actual exported product detail in view.
    logo(image,(70,125),282)
    d=ImageDraw.Draw(image)
    text(d,(68,250),'Good work.\nReady to go further.',55,INK,True,6)
    text(d,(72,421),'An open-source workspace for your team.',22,MUTED)
    d.rounded_rectangle((72,493,309,550),28,fill=BLUE)
    text(d,(98,509),'Explore LinkSense',20,(255,255,255),True)
    crop=SCREENS['overview'].crop((285,73,1415,523))
    crop=crop.resize((690,275),Image.Resampling.LANCZOS).convert('RGBA')
    crop.putalpha(rounded_mask(crop.size,14))
    rgba_paste(image,crop,(602+round((1-ease(t/.8))*90),209),ease(t/.65))
    return image


def frame_at(t):
    index=next((i for i,(start,end) in enumerate(SCENES) if start<=t<end),len(SCENES)-1)
    start,_=SCENES[index]
    image=render_scene(index,t-start,t)
    if index and t-start<.36:
        previous=render_scene(index-1,SCENES[index-1][1]-SCENES[index-1][0]-.001,t)
        image=Image.blend(previous,image,smooth((t-start)/.36))
    return image.convert('RGB')


def main():
    global LOGO, SCREENS, BACKGROUND, FONT_FILE
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--ffmpeg',default=os.environ.get('FFMPEG_BIN') or shutil.which('ffmpeg'))
    parser.add_argument('--font',type=Path,default=FONT_FILE)
    parser.add_argument('--output',type=Path,default=ROOT/'public/media/linksense-product-intro.mp4')
    parser.add_argument('--poster',type=Path,default=ROOT/'public/media/linksense-product-poster.webp')
    parser.add_argument('--contact-sheet',type=Path)
    args=parser.parse_args()
    if not args.ffmpeg:
        parser.error('FFmpeg is required; pass --ffmpeg or set FFMPEG_BIN.')
    FONT_FILE=args.font
    LOGO=Image.open(ROOT/'scripts/video-assets/figma-logo.png').convert('RGBA')
    SCREENS={name:Image.open(ROOT/f'public/media/figma-{name}.webp').convert('RGB') for name in ['workspace','overview','skills','connections','apps']}
    BACKGROUND=background()
    frame_at(11.0).save(args.poster,'WEBP',quality=92,method=6)
    if args.contact_sheet:
        sheet=Image.new('RGB',(960,360),(230,237,248))
        for i,t in enumerate([1.6,5.8,10.6,16.8,21.8,26.2]):
            thumb=frame_at(t).resize((320,180),Image.Resampling.LANCZOS)
            sheet.paste(thumb,((i%3)*320,(i//3)*180))
        sheet.save(args.contact_sheet)
    command=[args.ffmpeg,'-hide_banner','-loglevel','warning','-y','-f','rawvideo','-vcodec','rawvideo','-pixel_format','rgb24','-video_size',f'{WIDTH}x{HEIGHT}','-framerate',str(FPS),'-i','pipe:0','-an','-c:v','libx264','-preset','fast','-crf','20','-pix_fmt','yuv420p','-movflags','+faststart','-metadata','title=LinkSense — From request to result','-metadata','comment=Illustrative product tour using approved Figma exports and sample data.',str(args.output)]
    process=subprocess.Popen(command,stdin=subprocess.PIPE)
    try:
        for i in range(round(DURATION*FPS)):
            process.stdin.write(frame_at(i/FPS).tobytes())
            if i%150==0:
                print(f'Rendered {i}/{round(DURATION*FPS)} frames',flush=True)
    finally:
        process.stdin.close()
    if process.wait():
        raise SystemExit('FFmpeg encoding failed.')
    print(f'Created {args.output} ({args.output.stat().st_size:,} bytes), {DURATION}s, {WIDTH}×{HEIGHT} H.264, {FPS}fps')


if __name__=='__main__':
    main()
