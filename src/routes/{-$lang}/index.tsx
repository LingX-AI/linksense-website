import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '../../components/home-page'
import { pageHead } from '../../lib/head'
import { defaultLocale, isSiteLocale } from '../../lib/site'

export const Route = createFileRoute('/{-$lang}/')({
  head: ({ params }) => pageHead('home', isSiteLocale(params.lang) ? params.lang : defaultLocale),
  component: HomePage,
})
