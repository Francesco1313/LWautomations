import { createBrowserRouter } from 'react-router-dom'
import AutomationsListPage from '../pages/AutomationsListPage'
import CanvasPage from '../pages/CanvasPage'
import DetailPage from '../pages/DetailPage'
import UserProfilePage from '../pages/UserProfilePage'

const base = import.meta.env.BASE_URL

export const router = createBrowserRouter([
  { path: '/', element: <AutomationsListPage /> },
  { path: '/canvas/:id', element: <CanvasPage /> },
  { path: '/detail/:id', element: <DetailPage /> },
  { path: '/user/:id', element: <UserProfilePage /> },
], { basename: base })
