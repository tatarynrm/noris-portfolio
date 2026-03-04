import authApi from "@/shared/api/axios.instance";

export const usersService = {
    getAll: async () => {
        const response = await authApi.get("/users");
        return response.data;
    },

    update: async (userId: string, data: any) => {
        const response = await authApi.patch(`/users/${userId}`, data);
        return response.data;
    }
};
