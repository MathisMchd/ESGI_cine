// Interface pour les utilisateurs
export interface User {
  id: string;
  email: string;
  role: UserRole;
  apiKey: string;
  createdAt: string;
}

// Enum pour les rôles d'utilisateur
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}