import authApi from "@/shared/api/axios.instance";

export interface ProjectStatus {
    status_id: string;
    name: string;
    color: string;
}

export interface Project {
    project_id: string;
    title: string;
    description?: string;
    status_id?: string;
    status?: ProjectStatus;
    members?: { user: any, role: string }[];
    member_ids?: string[];
    created_at: string;
    updated_at: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export const projectsService = {
    getAll: async (params?: { page?: number; limit?: number; search?: string }): Promise<PaginatedResponse<Project>> => {
        const response = await authApi.get("/projects", { params });
        return response.data;
    },

    getStatuses: async (): Promise<ProjectStatus[]> => {
        const response = await authApi.get("/projects/statuses");
        return response.data;
    },

    getOne: async (id: string): Promise<Project> => {
        const response = await authApi.get(`/projects/${id}`);
        return response.data;
    },

    create: async (data: Partial<Project>): Promise<Project> => {
        const response = await authApi.post("/projects", data);
        return response.data;
    },

    update: async (id: string, data: Partial<Project>): Promise<Project> => {
        const response = await authApi.patch(`/projects/${id}`, data);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await authApi.delete(`/projects/${id}`);
    }
};
