// Parallel machined tracks are derived from the same control points so the
// engraved edges, faces, and cut lines follow the same continuous surface.
function track(offset, group) {
  const u = (x, strength) => Math.round(x + offset * strength)
  const v = (y, strength) => Math.round(y + offset * strength)
  if (group === 1) {
    return `M${u(1575,.79)} ${v(-130,.25)} C${u(1466,.7)} ${v(211,.32)} ${u(1108,.49)} ${v(141,-.64)} ${u(995,.5)} ${v(327,-.58)} C${u(846,.95)} ${v(555,-.04)} ${u(1227,.18)} ${v(565,-.7)} ${u(1330,.71)} ${v(703,-.38)} C${u(1421,.85)} ${v(839,-.35)} ${u(1278,.8)} ${v(974,.43)} ${u(1125,.48)} ${v(1130,.65)}`
  }
  return `M${u(1274,.63)} ${v(-164,.42)} C${u(1366,.57)} ${v(75,.73)} ${u(1230,.4)} ${v(160,.48)} ${u(1063,.62)} ${v(244,.63)} C${u(897,.51)} ${v(327,.58)} ${u(714,.98)} ${v(426,-.05)} ${u(798,.7)} ${v(554,-.68)} C${u(860,.57)} ${v(648,-.65)} ${u(1131,.44)} ${v(655,-.7)} ${u(1110,.71)} ${v(801,-.41)} C${u(1091,.68)} ${v(916,-.36)} ${u(898,.48)} ${v(980,.72)} ${u(857,.58)} ${v(1130,.65)}`
}

const dark = (id, stops) =>
  `<linearGradient id="${id}" x1="0" x2="1" y1="0" y2=".9">${stops.map(([at, color]) => `<stop offset="${at}" stop-color="${color}"/>`).join('')}</linearGradient>`

const lanes = [0, 1].map((group) => {
  const trim = group === 0 ? 17 : 23
  return `<g fill="none" stroke-linejoin="round">
    <path d="${track(trim, group)}" stroke="#010408" stroke-width="${trim * 7}" opacity=".6" filter="url(#shadow)" transform="translate(5 38)"/>
    ${Array.from({ length: trim }, (_, i) => {
      const offset = i * 8 + (i >= 6 ? 10 : 0) + (i >= 13 ? 15 : 0)
      const line = track(offset, group)
      return `<path d="${line}" stroke="#050b16" stroke-width="9"/>
      <path d="${line}" stroke="url(#${group ? 'silver' : 'cobalt'})" stroke-width="${i % 6 === 0 ? 6.2 : 7.6}" opacity="${.77 + (i % 4) * .068}"/>
      <path d="${line}" stroke="url(#edge)" stroke-width="1.1" transform="translate(1.65 -1.4)" opacity="${.62 + (i % 4) * .11}"/>`
    }).join('')}
  </g>`
}).reverse().join('')

process.stdout.write(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1620 1000" width="1620" height="1000">
  <defs>
    <radialGradient id="stage" cx=".76" cy=".45" r=".68">
      <stop stop-color="#1b344a"/><stop offset=".52" stop-color="#112131"/><stop offset="1" stop-color="#080e17"/>
    </radialGradient>
    ${dark('cobalt', [[0,'#101f38'],[.19,'#172b56'],[.32,'#3c71de'],[.48,'#8ba2da'],[.57,'#14294f'],[.68,'#193e81'],[.76,'#2f5baf'],[.88,'#3c6695'],[1,'#0a1329']])}
    ${dark('silver', [[0,'#10213f'],[.24,'#314773'],[.36,'#7496cf'],[.47,'#273e6e'],[.57,'#0b1227'],[.71,'#192c50'],[.87,'#3c4d74'],[1,'#172544']])}
    ${dark('edge', [[0,'#344873'],[.18,'#618cda'],[.35,'#adc5f3'],[.53,'#c6cce3'],[.62,'#294a7e'],[.76,'#8ea4c8'],[1,'#647ea4']])}
    <linearGradient id="darken"><stop stop-color="#070c14"/><stop offset=".32" stop-color="#070c14" stop-opacity=".84"/><stop offset=".68" stop-color="#070c14" stop-opacity=".14"/><stop offset="1" stop-color="#070c14" stop-opacity="0"/></linearGradient>
    <pattern id="ticks" width="64" height="64" patternUnits="userSpaceOnUse"><path d="M0 0h6M0 0v6" fill="none" stroke="#9aaec4" stroke-width=".6" opacity=".25"/></pattern>
    <filter id="shadow"><feGaussianBlur stdDeviation="27"/></filter>
    <filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence baseFrequency=".72" numOctaves="3" seed="11" stitchTiles="stitch"/></filter>
  </defs>
  <path fill="url(#stage)" d="M0 0h1620v1000H0z"/>
  <path fill="url(#ticks)" d="M0 0h1620v1000H0z"/>
  <g stroke="#8ba9c5" stroke-width=".7" opacity=".22" fill="none"><path d="M746 164h796M922 805h640M1180 102v785M1467 102v785"/><circle cx="1180" cy="510" r="309"/><circle cx="1180" cy="510" r="285" stroke-dasharray="1 8"/></g>
  ${lanes}
  <path fill="url(#darken)" d="M0 0h1620v1000H0z"/>
  <path d="M0 0h1620v1000H0z" filter="url(#grain)" opacity=".14" style="mix-blend-mode:soft-light"/>
</svg>`)
