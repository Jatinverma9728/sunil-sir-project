import { ApiClient } from "./client";

export const subscribeToNewsletter = async (email: string) => {
    const client = new ApiClient();
    return client.post<{ message: string }>("/newsletter/subscribe", { email });
};
