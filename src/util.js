import { Vector3 } from "three"
import { GRAVITATIONAL_CONSTANT } from "./constants"
/**
 * Force Between Two Celestial Objects
 * @param {CelestialObject} co1 
 * @param {CelestialObject} co2 
 * @returns {Vector3}
 */
export function force( co1, co2 ) {
    let pos1 = co1.getPosition();
    let pos2 = co2.getPosition();
    return new Vector3 (
        pos2.x - pos1.x,
        pos2.y - pos1.y,
        pos2.z - pos1.z
    )
    .normalize()
    .multiplyScalar(
        (
            GRAVITATIONAL_CONSTANT * co1.mass * co2.mass
        ) / (
            pos1.distanceToSquared( pos2 )
        )
    )
}