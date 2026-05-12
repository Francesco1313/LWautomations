import { createBrowserRouter } from 'react-router-dom'
import AutomationsListPage from '../pages/AutomationsListPage'
import CanvasPage from '../pages/CanvasPage'
import DetailPage from '../pages/DetailPage'
import UserProfilePage from '../pages/UserProfilePage'
import UsersListPage from '../pages/UsersListPage'

const base = import.meta.env.BASE_URL

export const router = createBrowserRouter([
  { path: '/', element: <AutomationsListPage /> },
  { path: '/users', element: <UsersListPage /> },
  { path: '/canvas/:id', element: <CanvasPage /> },
  { path: '/detail/:id', element: <DetailPage /> },
  { path: '/user/:id', element: <UserProfilePage /> },
], { basename: base })
