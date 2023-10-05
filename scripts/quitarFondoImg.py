from PIL import Image, ImageSequence, GifImagePlugin
import glob
import os, sys
import imageio

def getDictionaryRGB(r:int,g:int,b:int):
    return {
        'r':r,
        'g':g,
        'b':b
    }

def make_gif(frames_folder, extensionFrames, rutaGifResultado):
    images = []
    for file_name in sorted(os.listdir(frames_folder)):
        if file_name.endswith(f'.{extensionFrames}'):
            file_path = os.path.join(frames_folder, file_name)
            images.append(imageio.imread(file_path))

    # Make it pause at the end so that the viewers can ponder
    for _ in range(10):
        images.append(imageio.imread(file_path))

    imageio.mimsave(f'{rutaGifResultado}.gif', images)


def GifsToFrames(ruta:str, nombreArchivo:str, extension, coloresAQuitar):
    # Opening the input gif:
    archivo = ruta + nombreArchivo + ".gif"
    print(archivo)
    im = Image.open(archivo)

    # create an index variable:
    i = 1
    ruta = ruta + "frames/" 
    # iterate over the frames of the gif:
    for fr in ImageSequence.Iterator(im):
        
        # fr = GifImagePlugin.GifImageFile(fr)

        # img = fr.convert("RGBA")

        # datas = img.getdata()

        # newData = []
        
        # for item in datas:

        #     pixelTransparente = False
        #     for i in range(len(coloresAQuitar)):
        #         r = coloresAQuitar[i]['r']
        #         g = coloresAQuitar[i]['g']
        #         b = coloresAQuitar[i]['b']

        #         #if item[0] == r and item[1] == g and item[2] == b:
        #         #   pixelTransparente = True

        #         if item[0] < 25 and item[1] < 25 and item[2] > 10:
        #             pixelTransparente = True

        #     if pixelTransparente:
        #         newData.append((255, 255, 255, 0))
        #     else:
        #         newData.append(item)
    
        # img.putdata(newData)

        i = i + 1

        #print(ruta)
    #img.save(ruta, extension, append = True)
        
        # for color in colors:
        #     rgb = color[1]
        #     print(rgb)
        #     if hasattr(rgb, "__len__") and rgb[0] < 25 and rgb[1] < 25 and rgb[2] > 10:
        #         color[1] = (255,255,255,0)

        
        nombreArchivoNuevo = nombreArchivo + "_frame" + str(i)
        
        rutaFrame = ruta + nombreArchivoNuevo + "." + extension
        fr.save(rutaFrame)
        convertImage(ruta, nombreArchivoNuevo, extension, coloresAQuitar)
        
    return i

 
def convertImage(ruta:str, nombreArchivo:str, extension:str, coloresAQuitar):
    img = Image.open(ruta + nombreArchivo + '.' + extension)
    img = img.convert("RGBA")
 
    datas = img.getdata()
    
    newData = []

    for item in datas:
        pixelTransparente = False
        for i in range(len(coloresAQuitar)):
            r = coloresAQuitar[i]['r']
            g = coloresAQuitar[i]['g']
            b = coloresAQuitar[i]['b']

            #if item[0] == r and item[1] == g and item[2] == b:
             #   pixelTransparente = True

            if item[0] < 25 and item[1] < 25 and item[2] > 10:
                pixelTransparente = True

        if pixelTransparente:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)


 
    img.putdata(newData)
    ruta = ruta + nombreArchivo + "." +  extension
    img.save(ruta, extension)
    #print("Guardado en " + ruta)

ruta = 'D:/wamp64/www/plantasVsZombies/plantasVsZombies/multimedia/zombies/'
#ruta = 'C:/Users/admin-daw2a/Desktop/web/plantasVsZombies/plantasVsZombies/multimedia/zombies/'
nombreArchivo = 'prueba'
extension = 'png'


coloresAQuitar = [
    getDictionaryRGB(0,0,248),
    getDictionaryRGB(0,0,238),
    getDictionaryRGB(0,0,250),
    getDictionaryRGB(1,1,203)
]

#convertImage(ruta, nombreArchivo, extension, coloresAQuitar)

#GifsToFrames(ruta, "zombieComiendo", extension, coloresAQuitar)

#make_gif(ruta + "frames/", extension, ruta + "zombieComiendo")

#https://ezgif.com/



path = f'{ruta}frames/' # on Mac: right click on a folder, hold down option, and click "copy as pathname"

GifsToFrames(ruta, "zombieComiendo", extension, coloresAQuitar)