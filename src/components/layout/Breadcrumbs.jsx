import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

export function Breadcrumbs() {
  const location = useLocation()
  const paths = location.pathname.split('/').filter(Boolean)

  return (
    <nav className="flex items-center text-sm text-muted-foreground mb-4">
      <Link to="/" className="hover:text-foreground transition-colors flex items-center">
        <Home size={14} />
      </Link>
      {paths.map((path, index) => {
        const routeTo = `/${paths.slice(0, index + 1).join('/')}`
        const isLast = index === paths.length - 1
        const title = path.charAt(0).toUpperCase() + path.slice(1).replace('-', ' ')

        return (
          <React.Fragment key={path}>
            <ChevronRight size={14} className="mx-1 opacity-50" />
            {isLast ? (
              <span className="font-medium text-foreground">{title}</span>
            ) : (
              <Link to={routeTo} className="hover:text-foreground transition-colors">
                {title}
              </Link>
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}
