export function getChangedFields<T extends object>(
    original: T,
    updated: Partial<T>
): Partial<T> {
    const changed: Partial<T> = {};

    for (const key in updated) {
        if (Object.prototype.hasOwnProperty.call(updated, key) &&
            !isEqual(updated[key], original[key as keyof T])) {
            changed[key] = updated[key];
        }
    }

    return changed;
}

function isEqual(a: unknown, b: unknown): boolean {
    if (a === b) {
        return true;
    }

    if (a == null || b == null) {
        return a === b;
    }

    if (typeof a !== typeof b) {
        return false;
    }

    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) {
            return false;
        }
        return a.every((item, index) => isEqual(item, b[index]));
    }

    if (typeof a === 'object' && typeof b === 'object') {
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);

        if (keysA.length !== keysB.length) {
            return false;
        }

        return keysA.every(key => (a as any)[key] === (b as any)[key]);
    }

    return a === b;
}