def algo():
    import os
    import cv2

    path = "D:/wamp64/www/carlos/"
    archivos = sorted(os.listdir(path))
    print(archivos)
    img_array = []

    for x in range(0, len(archivos)):
        nomArchivo = archivos[x]
        if 'mp4' in nomArchivo:
            img_array.append(None)
        else:
            dirArchivo = path + str(nomArchivo)
            print(dirArchivo)
            img = cv2.imread(dirArchivo)
            img_array.append(img)


path = "D:/wamp64/www/carlos/"


from moviepy.editor import *
clip1 = VideoFileClip(path + "WhatsApp Video 2022-10-09 at 11.50.52 PM.mp4")
clip2 = VideoFileClip(path + "WhatsApp Image 2022-10-09 at 11.50.53 PM (1).jpeg")
final_clip = concatenate_videoclips([clip1,clip2])
final_clip.write_videofile(path + "resultado.mp4")