import { createFileRoute, notFound, redirect } from '@tanstack/react-router'
import { defaultLocale, isSiteLocale, pageFromPath, sitePath } from '../../lib/site'

export const Route = createFileRoute('/{-$lang}')({
  beforeLoad: ({ params, location }) => {
    if (params.lang === defaultLocale) {
      throw redirect({ href: sitePath(pageFromPath(location.pathname), defaultLocale), statusCode: 308 })
    }
    if (params.lang && !isSiteLocale(params.lang)) throw notFound()
  },
})
