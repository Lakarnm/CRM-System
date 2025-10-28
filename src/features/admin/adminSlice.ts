import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { User, UserFilters, UsersMetaResponse, UserRolesRequest, UserRequest, Roles } from "../../types/types";
import { fetchUsers, fetchUserById, updateUserRoles, updateUser, blockUser, unblockUser, deleteUser } from "../../api/adminApi";
import { logout } from "../auth/authSlice";

interface AdminState {
    users: User[];
    selectedUser: User | null;
    loading: boolean;
    error: string | null;
    filters: UserFilters;
    pagination: {
        current: number;
        pageSize: number;
        total: number;
    };
}

const initialState: AdminState = {
    users: [],
    selectedUser: null,
    loading: false,
    error: null,
    filters: {
        search: "",
        sortBy: "username",
        sortOrder: "asc",
        limit: 20,
        page: 0
    },
    pagination: {
        current: 1,
        pageSize: 20,
        total: 0
    }
};

/* ASYNC THUNKS */

export const getUsers = createAsyncThunk<
    UsersMetaResponse,
    void,
    { rejectValue: string }
>(
    "admin/getUsers",
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState() as { admin: AdminState };
            const filters = state.admin.filters;
            return await fetchUsers(filters);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Ошибка загрузки пользователей");
        }
    }
);

export const getUserById = createAsyncThunk<
    User,
    number,
    { rejectValue: string }
>(
    "admin/getUserById",
    async (id, { rejectWithValue }) => {
        try {
            return await fetchUserById(id);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Ошибка загрузки пользователя");
        }
    }
);

export const updateUserData = createAsyncThunk<
    User,
    { id: number; data: UserRequest },
    { rejectValue: string }
>(
    "admin/updateUserData",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            return await updateUser(id, data);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Ошибка обновления пользователя");
        }
    }
);

export const toggleBlockUser = createAsyncThunk<
    User,
    number,
    { rejectValue: string }
>(
    "admin/toggleBlockUser",
    async (id, { getState, rejectWithValue }) => {
        try {
            const state = getState() as { admin: AdminState };
            const user = state.admin.users.find(u => u.id === id);

            if (user?.isBlocked) {
                return await unblockUser(id);
            } else {
                return await blockUser(id);
            }
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Ошибка изменения статуса блокировки");
        }
    }
);

export const removeUser = createAsyncThunk<
    number,
    number,
    { rejectValue: string }
>(
    "admin/removeUser",
    async (id, { rejectWithValue }) => {
        try {
            await deleteUser(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Ошибка удаления пользователя");
        }
    }
);

export const updateUserRights = createAsyncThunk<
    User,
    { id: number; roles: Roles[] },
    { rejectValue: string }
>(
    "admin/updateUserRights",
    async ({ id, roles }, { rejectWithValue }) => {
        try {
            return await updateUserRoles(id, { roles });
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Ошибка обновления прав");
        }
    }
);

/* SLICE */

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        setFilters: (state, action: PayloadAction<Partial<UserFilters>>) => {
            const newFilters = { ...action.payload };

            if (Object.keys(newFilters).some(key => key !== 'page' && key !== 'limit')) {
                newFilters.page = 0;
            }

            state.filters = { ...state.filters, ...newFilters };
        },
        clearError: (state) => {
            state.error = null;
        },
        clearSelectedUser: (state) => {
            state.selectedUser = null;
        },
        setPagination: (state, action: PayloadAction<{ current: number; pageSize: number }>) => {
            state.pagination = { ...state.pagination, ...action.payload };
            state.filters.page = action.payload.current - 1; // Конвертируем 1-based в 0-based
            state.filters.limit = action.payload.pageSize;
        }
    },
    extraReducers: (builder) => {
        /* GET USERS */
        builder
            .addCase(getUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUsers.fulfilled, (state, action) => {
                state.loading = false;

                if (action.payload.data === null) {
                    state.users = [];
                    state.pagination.total = action.payload.meta?.totalAmount || 0;
                } else {
                    state.users = action.payload.data || [];
                    state.pagination.total = action.payload.meta?.totalAmount || 0;
                }
            })
            .addCase(getUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        /* GET USER BY ID */
        builder
            .addCase(getUserById.fulfilled, (state, action) => {
                state.selectedUser = action.payload;
            });

        /* UPDATE USER DATA */
        builder
            .addCase(updateUserData.fulfilled, (state, action) => {
                const index = state.users.findIndex(user => user.id === action.payload.id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
                if (state.selectedUser?.id === action.payload.id) {
                    state.selectedUser = action.payload;
                }
            });

        /* TOGGLE BLOCK USER */
        builder
            .addCase(toggleBlockUser.fulfilled, (state, action) => {
                const index = state.users.findIndex(user => user.id === action.payload.id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
            });

        /* REMOVE USER */
        builder
            .addCase(removeUser.fulfilled, (state, action) => {
                state.users = state.users.filter(user => user.id !== action.payload);
            });

        /* UPDATE USER RIGHTS */
        builder
            .addCase(updateUserRights.fulfilled, (state, action) => {
                const index = state.users.findIndex(user => user.id === action.payload.id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
            });

        /* LOGOUT */
        builder.addCase(logout.fulfilled, () => {
            return initialState;
        });
    }
});

export const { setFilters, clearError, clearSelectedUser, setPagination } = adminSlice.actions;
export default adminSlice.reducer;