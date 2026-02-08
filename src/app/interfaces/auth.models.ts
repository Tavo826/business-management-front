export interface LoginRequest {
    email: string
    password: string
}

export interface AuthTokenResponse {
    token: string
}