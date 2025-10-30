import { Role, Roles } from "../types/types";

export const hasAdminRole = (roles: Role[]): boolean => {
    return roles.includes(Roles.ADMIN);
};

export const hasModeratorRole = (roles: Role[]): boolean => {
    return roles.includes(Roles.MODERATOR);
};

export const hasAdminOrModeratorRole = (roles: Role[] | undefined): boolean => {
    if (!roles) return false;
    return hasAdminRole(roles) || hasModeratorRole(roles);
};