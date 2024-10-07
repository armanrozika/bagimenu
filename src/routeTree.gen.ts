/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as VerifyEmailImport } from './routes/verify-email'
import { Route as LoginImport } from './routes/login'
import { Route as PrivateImport } from './routes/_private'
import { Route as IndexImport } from './routes/index'
import { Route as PrivateDashboardIndexImport } from './routes/_private.dashboard/index'

// Create/Update Routes

const VerifyEmailRoute = VerifyEmailImport.update({
  path: '/verify-email',
  getParentRoute: () => rootRoute,
} as any)

const LoginRoute = LoginImport.update({
  path: '/login',
  getParentRoute: () => rootRoute,
} as any)

const PrivateRoute = PrivateImport.update({
  id: '/_private',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const PrivateDashboardIndexRoute = PrivateDashboardIndexImport.update({
  path: '/dashboard/',
  getParentRoute: () => PrivateRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/_private': {
      id: '/_private'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof PrivateImport
      parentRoute: typeof rootRoute
    }
    '/login': {
      id: '/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof LoginImport
      parentRoute: typeof rootRoute
    }
    '/verify-email': {
      id: '/verify-email'
      path: '/verify-email'
      fullPath: '/verify-email'
      preLoaderRoute: typeof VerifyEmailImport
      parentRoute: typeof rootRoute
    }
    '/_private/dashboard/': {
      id: '/_private/dashboard/'
      path: '/dashboard'
      fullPath: '/dashboard'
      preLoaderRoute: typeof PrivateDashboardIndexImport
      parentRoute: typeof PrivateImport
    }
  }
}

// Create and export the route tree

interface PrivateRouteChildren {
  PrivateDashboardIndexRoute: typeof PrivateDashboardIndexRoute
}

const PrivateRouteChildren: PrivateRouteChildren = {
  PrivateDashboardIndexRoute: PrivateDashboardIndexRoute,
}

const PrivateRouteWithChildren =
  PrivateRoute._addFileChildren(PrivateRouteChildren)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '': typeof PrivateRouteWithChildren
  '/login': typeof LoginRoute
  '/verify-email': typeof VerifyEmailRoute
  '/dashboard': typeof PrivateDashboardIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '': typeof PrivateRouteWithChildren
  '/login': typeof LoginRoute
  '/verify-email': typeof VerifyEmailRoute
  '/dashboard': typeof PrivateDashboardIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/_private': typeof PrivateRouteWithChildren
  '/login': typeof LoginRoute
  '/verify-email': typeof VerifyEmailRoute
  '/_private/dashboard/': typeof PrivateDashboardIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '' | '/login' | '/verify-email' | '/dashboard'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '' | '/login' | '/verify-email' | '/dashboard'
  id:
    | '__root__'
    | '/'
    | '/_private'
    | '/login'
    | '/verify-email'
    | '/_private/dashboard/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  PrivateRoute: typeof PrivateRouteWithChildren
  LoginRoute: typeof LoginRoute
  VerifyEmailRoute: typeof VerifyEmailRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  PrivateRoute: PrivateRouteWithChildren,
  LoginRoute: LoginRoute,
  VerifyEmailRoute: VerifyEmailRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/_private",
        "/login",
        "/verify-email"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/_private": {
      "filePath": "_private.tsx",
      "children": [
        "/_private/dashboard/"
      ]
    },
    "/login": {
      "filePath": "login.tsx"
    },
    "/verify-email": {
      "filePath": "verify-email.tsx"
    },
    "/_private/dashboard/": {
      "filePath": "_private.dashboard/index.tsx",
      "parent": "/_private"
    }
  }
}
ROUTE_MANIFEST_END */
