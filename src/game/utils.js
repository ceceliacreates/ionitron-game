export function timeToFall(height, gravity) {
    var time = Math.sqrt((2 * height) / gravity);
    return time;
}

export function maxPotentialDistanceToCatch(time, velocity) {
    var distance = velocity * time;
    return distance * 0.6;
}

export function wrapText(scene, text, maxWidth, fontSize) {
    let words = text.split(' ');
    let wrappedText = '';
    let line = '';

    words.forEach((word) => {
        const testLine = scene.add.text(0, 0, line + word + ' ', { fontSize: fontSize, visible: false });
        const testWidth = testLine.width;
        testLine.destroy();

        if (testWidth > maxWidth) {
            wrappedText += line + '\n';
            line = word + ' ';
        } else {
            line = line + word + ' ';
        }
    });

    wrappedText += line;
    return wrappedText.trim();
}