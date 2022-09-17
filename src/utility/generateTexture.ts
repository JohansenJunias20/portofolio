import * as THREE from "three"
interface IGenerateTexture {
    layers: {
        type: "image" | "text",
        text?: string,
        ImageSize?: {
            x: number,
            y: number
        },
        image?: HTMLImageElement | string,
        position: {
            x: number,
            y: number
        }
    }[],
    width: number,
    height: number
}
export default async function generateTexture({ layers, width, height }: IGenerateTexture) {
    const canvas = document.createElement("canvas");
    // canvas.
    const ctx = canvas.getContext("2d");
    if (!ctx) {
        throw "context not found"
    }
    canvas.width = width;
    canvas.height = height;
    var promises: Promise<any>[] = []
    layers.forEach(layer => {
        switch (layer.type) {
            case "image":
                if (typeof layer.image == "string") {
                    const img = new Image(layer.ImageSize.x, layer.ImageSize.y);
                    img.src = layer.image;
                    var promise = new Promise<void>((res) => {
                        img.onload = () => {
                            ctx.drawImage(img, layer.position.x, layer.position.y, img.width, img.height);
                            res();
                        }
                    })
                    promises.push(promise);
                }
                else {
                    ctx.drawImage(layer.image, layer.position.x, layer.position.y, layer.image.width, layer.image.height);
                }
                // ctx.drawImage()
                break;
            case "text":
                ctx.fillText(layer.text, layer.position.x, layer.position.y);
                break;
            default:
                break;
        }
    })

    await Promise.all(promises);
    return new THREE.CanvasTexture(canvas);
}