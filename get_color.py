try:
    from PIL import Image
    img_path = "/Users/siammozumder/Downloads/ezgif-2f03231cf6c40ecf-jpg/ezgif-frame-001.jpg"
    with Image.open(img_path) as img:
        color = img.getpixel((0, 0))
        hex_color = '#{:02x}{:02x}{:02x}'.format(color[0], color[1], color[2])
        print(f"Hex: {hex_color}")
except Exception as e:
    print(e)
