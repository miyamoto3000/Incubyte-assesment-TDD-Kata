// Matches com.TDD.Kata.model.Role
export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

// Matches com.TDD.Kata.dto.AuthResponse
export interface AuthResponse {
  token: string;
}

// Matches decoded JWT Payload (Standard claims + your role)
export interface User {
  sub: string;       // Username (subject)
  role: Role;        // "USER" | "ADMIN"
  exp: number;       // Expiration timestamp
}

// Matches com.TDD.Kata.model.Sweet
export interface Sweet {
  id: string;
  name: string;
  category: string;
  price: number;     // BigDecimal becomes number in JS
  quantity: number;
}

// Matches com.TDD.Kata.dto.LoginRequest
export interface LoginRequest {
  username: string;
  password?: string; // Optional because we might handle state flexibly
}

// Matches com.TDD.Kata.dto.RegisterRequest
export interface RegisterRequest {
  username: string;
  password: string;
  role: Role;
}