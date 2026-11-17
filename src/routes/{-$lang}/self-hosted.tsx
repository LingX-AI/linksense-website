import { createFileRoute } from '@tanstack/react-router'
import { HostingPage } from '../../components/detail-pages'
import { pageHead } from '../../lib/head'
import { defaultLocale, isSiteLocale } from '../../lib/site'

export const Route = createFileRoute('/{-$lang}/self-hosted')({
  head: ({ params }) => pageHead('hosting', isSiteLocale(params.lang) ? params.lang : defaultLocale),
  component: HostingPage,
})
