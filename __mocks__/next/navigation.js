// __mocks__/next/navigation.ts
import { jest } from '@jest/globals';

export const useRouter = jest.fn(() => ({
  push: jest.fn(),
  replace: jest.fn(),
  refresh: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  pathname: '/',
  query: {},
  asPath: '/',
}));

export const usePathname = jest.fn(() => '/');