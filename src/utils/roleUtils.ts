import { Role, Roles } from "../types/types";

export const hasRole = (userRoles: Role[] | undefined, requiredRoles: Role[]): boolean => {
    if (!userRoles) {
        return false;
    }
    return requiredRoles.some(role => userRoles.includes(role));
};

export { Roles };