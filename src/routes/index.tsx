import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import HomePage from './HomePage'
import ProjectDetailPage from './ProjectDetailPage'
import NotFoundPage from './NotFoundPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <NotFoundPage />,
  },
  {
    path: '/:projectId',
    element: <ProjectDetailPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])

export default function AppRouter() {
  return <RouterProvider router={router} />
}
