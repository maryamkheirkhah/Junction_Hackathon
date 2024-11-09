/* 
import users from 'assets/images/user_mng.svg';
import calendar from 'assets/images/calendar_icon.svg';
import event_calendar from 'assets/images/event_calendar.svg';
 */
// Lazy-loaded components

/*
const BrandManage = lazy(() => import('content/BrandManage'));
const BrandAddEdit = lazy(() => import('content/BrandAddEdit'));
const BrandEdit = lazy(() => import('content/BrandEdit'));
const AreasList = lazy(() => import('content/AreasList'));
const AreaAddEdit = lazy(() => import('content/AreaAddEdit'));
const AreaEdit = lazy(() => import('content/AreaEdit'));
const CalendarView = lazy(() => import('content/CalendarView'));
const EventsCalendar = lazy(() => import('content/EventsCalendar'));
const UserManagement = lazy(() => import('content/UserManagement'));
// Authorization HOCs
const UserManagementAccess = Authorization(['system_admin', 'user_management']);
const PrizeListCalendarAccess = Authorization(['analytics_access']);
const EventsCalendarAccess = Authorization(['events_calendar_access']);
const BrandAddEditAccess = Authorization(['brands_management']); */
import clients from '../assets/images/Brands_Icon.svg';
import React, { lazy } from 'react';
import Authorization from '../utils/hoc/Authorization';
const LoginPanel = lazy(() => import('../content/LoginPanel'));
const ResetPassword = lazy(() => import('../content/ResetPassword'));
const AuthenticationTimeout = lazy(() => import('../content/AuthenticationTimeout'));
const ClientsList = lazy(() => import('../content/ClientsList'));
const ClientsAccess = Authorization(['analytics_access']);
const AccessDeniedView=lazy(()=>import('../content/AccessDeniedView'));

// Updated routes array
const routes = [
  {
    path: '/login',
    element: <LoginPanel />,   // Use `element` here
    key: 'LoginPanelKey',
    noAuth: true
  },
  {
    path: '/password_reset',
    element: <ResetPassword />,
    key: 'ResetPasswordKey',
    noAuth: true
  },
  {
    path: '/authentication_timeout',
    element: <AuthenticationTimeout />,
    key: 'AuthenticationTimeoutKey',
    noAuth: true
  },
  {
    path: '/brands',
    element: <ClientsAccess><ClientsList /></ClientsAccess>,
    key: 'BrandsListKey',
    displayName: 'Brands',
    icon: clients,
    credentials: ['analytics_access']
  },
  {
    path: '/access_denied',
    element: <AccessDeniedView />,
    key: 'AccessDeniedViewKey',
    noAuth: true
  },
];

export default routes;
  /*
  {
    path: '/brands',
    element: <BrandsAccess><BrandsList /></BrandsAccess>,
    key: 'BrandsListKey',
    displayName: 'Brands',
    icon: brands,
    credentials: ['analytics_access']
  },
  {
    path: '/brands/manage/areas/add',
    element: <BrandsAccess><AreaAddEdit /></BrandsAccess>,
    key: 'BrandAddKey'
  },
  {
    path: '/brands/manage/areas/edit',
    element: <BrandsAccess><AreaAddEdit /></BrandsAccess>,
    key: 'BrandEditKey'
  },
  {
    path: '/brands/manage/areas',
    element: <BrandsAccess><AreasList /></BrandsAccess>,
    key: 'AreasListKey'
  },
  {
    path: '/brands/manage',
    element: <BrandsAccess><BrandManage /></BrandsAccess>,
    key: 'BrandManageKey'
  },
  {
    path: '/brands/edit',
    element: <BrandAddEditAccess><BrandAddEdit /></BrandAddEditAccess>,
    key: 'BrandEditKey'
  },
  {
    path: '/brands/add/',
    element: <BrandAddEditAccess><BrandAddEdit /></BrandAddEditAccess>,
    key: 'BrandAddKey'
  },
  {
    path: '/events_calendar',
    element: <EventsCalendarAccess><EventsCalendar /></EventsCalendarAccess>,
    key: 'EventsCalendarKey',
    displayName: 'Events Calendar',
    icon: event_calendar,
    credentials: ['events_calendar_access']
  },
  {
    path: '/calendar',
    element: <PrizeListCalendarAccess><CalendarView /></PrizeListCalendarAccess>,
    key: 'CalendarViewKey',
    displayName: 'Prize List Calendar',
    icon: calendar,
    credentials: ['brands_management', 'analytics_access']
  },
  {
    path: '/user_management',
    element: <UserManagementAccess><UserManagement /></UserManagementAccess>,
    key: 'UserManagementKey',
    displayName: 'User Management',
    icon: users,
    credentials: ['user_management', 'system_admin']
  },

 */

