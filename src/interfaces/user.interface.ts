export interface IUser {
    id: number;
    account_type: string;
    email: string;
    company_name: string;
    users: number;
    products: number;
    percentage: string;
    image: string | null;
    created_at: string;
    updated_at: string;
}