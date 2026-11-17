import { createFileRoute } from '@tanstack/react-router'
import { CasesPage } from '../../components/detail-pages'
import { pageHead } from '../../lib/head'
import { defaultLocale, isSiteLocale } from '../../lib/site'

export const Route = createFileRoute('/{-$lang}/use-cases')({
  head: ({ params }) => pageHead('cases', isSiteLocale(params.lang) ? params.lang : defaultLocale),
  component: CasesPage,
})
