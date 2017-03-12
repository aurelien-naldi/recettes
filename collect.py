import os
import json

from PIL import Image

imgsize = 800
thumbsize = 150
CORE_META = ["title", "description", "tags"]

def load(src, output):
    files = []
    collect(src, src, files)
    all_meta = []
    for path in files:
        uid = path[:-4]
        print(path)
        parsed = parse( os.path.join(src, path) )
        core = [uid, ] + [ parsed.get(k,"") for k in CORE_META ]
        all_meta.append( core )
        outfile = os.path.join(output, path[:-3]+"json")
        parent = os.path.dirname(outfile)
        if not os.path.exists(parent):
            os.makedirs(parent)
        f = open( outfile, "w")
        json.dump(parsed,f)
        f.write("\n")
        f.close()
        
        # copy image and thumbnail
        imgname = os.path.join(src,"%s.jpg"%uid)
        if os.path.exists(imgname):
            thumbname = os.path.join(output, "%s_thumb.jpg" % uid)
            outimgname = os.path.join(output, "%s.jpg" % uid)
            im = Image.open(imgname)
            thumb = im.copy()
            thumb.thumbnail((thumbsize, thumbsize), Image.ANTIALIAS)
            thumb.save(thumbname)
            im.thumbnail((imgsize, imgsize), Image.ANTIALIAS)
            im.save(outimgname)
            core.append(True)
        else:
            core.append(False)

    f = open( os.path.join(output, "recipes.js"), "w")
    f.write("recipes = ")
    json.dump(all_meta,f)
    f.write("\n")
    f.close()
    


def collect(src, base, files):
    l = len(src) + 1
    for name in os.listdir(base):
        path = os.path.join(base,name)
        if name.startswith("."): continue
        if os.path.isdir(path):
            collect(src, path, files)
        elif name.endswith(".rst"):
            files.append(path[l:])


def parse(filename):
    f = open(filename)
    meta = {}
    ingredients=[]
    text = []
    ismeta = True
    isingredient = True
    for line in f:
        if ismeta:
            if line.startswith(".. "):
                info = line[3:].strip().split(":",1)
                meta[info[0]] = info[1].strip()
                continue
            ismeta = False
        
        if not line.strip(): continue
        
        if isingredient:
            if line.startswith("* "):
                ingredients.append(line[2:].strip())
                continue
            isingredient = False
        
        text.append(line)
    
    f.close()
    meta["ingredients"] = ingredients
    meta["text"] = "\n".join(text)
    
    return meta


load("recipes", "html/recipes")

