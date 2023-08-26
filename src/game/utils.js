export function timeToFall(height, gravity) {
    var time = Math.sqrt((2 * height) / gravity);
    return time;
}

export function maxPotentialDistanceToCatch(time, velocity) {
    var distance = velocity * time;
    return distance * 0.6;
}
