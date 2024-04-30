import { Vector2 } from "../Engine.js";

async function CreateSpriteData(src) {
    var response = await fetch(src);

    var fileBlob = await response.blob();
    var bitmap = await createImageBitmap(fileBlob);

    var canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    var context = canvas.getContext('2d');

    context.drawImage(bitmap, 0, 0);
    var myData = context.getImageData(0, 0, bitmap.width, bitmap.height);
    return myData;
};

const GMath = {
    GetDistanceBetweenPoints: (a,b) => Math.sqrt(((b.x - a.x)**2) + ((b.y - a.y)**2)),
    FlipBetween1and0: (n) => 1 - n,
    IsBetween: (n, min, max) => {
        if(n >= min && n <= max) return true;
        return false;
    },
    Clamp: (x, min, max) => {
        if(x < min) return min;
        if(x > max) return max;

        return x;
    },
    VMultiply: (v1, v2) => {
        return new Vector2(v1.x * v2.x, v1.y * v2.y)
    },
    VFactor: (v1, n) => {
        return new Vector2(v1.x * n, v1.y * n)
    }
};

const Vector2Dir = {
    up: new Vector2(0, -1),
    down: new Vector2(0, 1),
    left: new Vector2(-1, 0),
    right: new Vector2(1, 0)
}

export { CreateSpriteData, GMath, Vector2Dir }