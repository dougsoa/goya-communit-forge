// Security utilities for client-side validation and sanitization

/**
 * Sanitizes user input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .replace(/data:text\/html/gi, ''); // Remove data URI with HTML
}

/**
 * Validates post title
 */
export function validateTitle(title: string): { isValid: boolean; error?: string } {
  const sanitized = sanitizeInput(title);
  
  if (!sanitized || sanitized.length < 1) {
    return { isValid: false, error: 'Title is required' };
  }
  
  if (sanitized.length > 200) {
    return { isValid: false, error: 'Title must be 200 characters or less' };
  }
  
  return { isValid: true };
}

/**
 * Validates post content
 */
export function validateContent(content: string): { isValid: boolean; error?: string } {
  const sanitized = sanitizeInput(content);
  
  if (!sanitized || sanitized.length < 1) {
    return { isValid: false, error: 'Content is required' };
  }
  
  if (sanitized.length > 10000) {
    return { isValid: false, error: 'Content must be 10,000 characters or less' };
  }
  
  return { isValid: true };
}

/**
 * Validates comment content
 */
export function validateComment(content: string): { isValid: boolean; error?: string } {
  const sanitized = sanitizeInput(content);
  
  if (!sanitized || sanitized.length < 1) {
    return { isValid: false, error: 'Comment is required' };
  }
  
  if (sanitized.length > 2000) {
    return { isValid: false, error: 'Comment must be 2,000 characters or less' };
  }
  
  return { isValid: true };
}

/**
 * Rate limiting for posts - client-side check
 */
export class PostRateLimit {
  private static readonly STORAGE_KEY = 'post_rate_limit';
  private static readonly MAX_POSTS = 10;
  private static readonly TIME_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

  static canPost(): { allowed: boolean; timeUntilReset?: number } {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      const data = stored ? JSON.parse(stored) : { posts: [], lastReset: Date.now() };
      
      const now = Date.now();
      const timeWindow = now - this.TIME_WINDOW;
      
      // Filter out posts older than 1 hour
      data.posts = data.posts.filter((timestamp: number) => timestamp > timeWindow);
      
      if (data.posts.length >= this.MAX_POSTS) {
        const oldestPost = Math.min(...data.posts);
        const timeUntilReset = (oldestPost + this.TIME_WINDOW) - now;
        return { allowed: false, timeUntilReset };
      }
      
      return { allowed: true };
    } catch {
      return { allowed: true };
    }
  }

  static recordPost(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      const data = stored ? JSON.parse(stored) : { posts: [] };
      
      const now = Date.now();
      const timeWindow = now - this.TIME_WINDOW;
      
      // Filter out posts older than 1 hour and add new post
      data.posts = data.posts.filter((timestamp: number) => timestamp > timeWindow);
      data.posts.push(now);
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Silently fail if localStorage is not available
    }
  }
}

/**
 * Content Security Policy headers for enhanced security
 */
export const CSP_HEADERS = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://lbtuwxvrdspwvxjuhzfu.supabase.co",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https://lbtuwxvrdspwvxjuhzfu.supabase.co wss://lbtuwxvrdspwvxjuhzfu.supabase.co",
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ')
};

/**
 * Validates if a user can perform an action on a resource
 */
export function canUserModifyResource(userId: string, resourceUserId: string): boolean {
  return userId === resourceUserId;
}

/**
 * Escapes HTML to prevent XSS
 */
export function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Validates email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates password strength
 */
export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}