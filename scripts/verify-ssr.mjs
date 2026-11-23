import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { access } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const entry = fileURLToPath(new URL('../.output/server/index.mjs', import.meta.url))
await access(entry).catch(() => { throw new Error('Run pnpm build before pnpm test:ssr.') })
const server = spawn(process.execPath, [entry], {
  env: { ...process.env, NITRO_HOST: '127.0.0.1', NITRO_PORT: '0', NITRO_UNIX_SOCKET: '', TEST: '' },
  stdio: ['ignore', 'pipe', 'inherit'],
})
const closed = once(server, 'close')

try {
  let timer
  const origin = await new Promise((resolve, reject) => {
    let output = ''
    timer = setTimeout(() => reject(new Error('The built server did not bind a loopback port.')), 8000)
    server.stdout.setEncoding('utf8').on('data', (chunk) => {
      output = (output + chunk).slice(-2048)
      const address = output.match(/http:\/\/127\.0\.0\.1:\d+/)
      if (address) resolve(address[0])
    })
    void closed.then(([code]) => reject(new Error(`The built server exited (${code}).`)), reject)
  }).finally(() => clearTimeout(timer))

  const request = (path) => fetch(`${origin}${path}`, { redirect: 'manual', signal: AbortSignal.timeout(5000) })
  const count = (html, pattern) => (html.match(pattern) ?? []).length
  const detailCopy = {
    en: {
      cases: {
        note: 'Illustrative workflows using example data.',
        audiences: ['Procurement', 'Operations', 'Team enablement'],
        titles: ['Compare supplier quotes', 'Prepare the weekly brief', 'Find the rule with its source'],
        deliverables: ['Supplier comparison', 'Procurement brief'],
        brief: 'Weekly operations brief',
        briefPoints: ['What changed', 'What needs a decision', 'What happens next'],
        reference: 'Purchasing policy · example source',
        outputs: ['A comparison spreadsheet and a decision brief.', 'A report that shows changes, open issues and next steps.', 'An answer with references you can inspect.'],
        handoff: 'Give the next person a head start.',
        handoffBody: 'Package a proven approach as a Skill or App and share it with specific users or groups. Keep the right knowledge and tools available without passing credentials around.',
      },
      hosting: {
        source: 'View source on GitHub',
        core: 'The agent workspace',
        coreBody: 'For task execution, file deliverables, reusable capabilities, business connections and administration.',
        full: 'Workspace with knowledge processing',
        fullBody: 'Everything in Core, plus built-in document parsing, indexing and knowledge retrieval. Full needs additional resources and a configured retrieval model.',
        platform: 'Linux or macOS with Docker',
        compareBody: 'Core and Full are deployment profiles. Consult the deployment guides for host requirements and installation steps.',
        governance: 'Keep operations visible.',
        model: 'Choose your models',
        modelBody: 'Connect supported hosted model APIs or compatible self-hosted endpoints.',
        boundaries: 'Understand the boundaries',
        boundaryBody: 'Tasks are isolated by user Worker, so tasks from the same user can access that user’s shared files. External models and integrations receive the data sent to them.',
        deployment: 'Deployment',
        workers: 'User Workers',
        capabilities: 'Shared capabilities',
        models: 'Model endpoints',
      },
    },
    zh: {
      cases: {
        note: '以下流程使用示例数据展示。',
        audiences: ['采购', '运营', '团队知识'],
        titles: ['对比供应商报价', '准备每周工作简报', '找到规则，也找到出处'],
        deliverables: ['供应商比价表', '采购简报'],
        brief: '每周运营简报',
        briefPoints: ['本周有哪些变化', '哪些事项需要决策', '接下来怎么做'],
        reference: '采购制度 · 示例来源',
        outputs: ['一份比价表和一份决策简报。', '一份包含变动、待决事项和下一步行动的报告。', '一份带有可查阅引用的答复。'],
        handoff: '下一位同事，不必从头开始。',
        handoffBody: '把验证过的方法做成技能或应用，并共享给指定用户或用户组。让同事用到所需知识和工具，无需传递底层凭据。',
      },
      hosting: {
        source: '在 GitHub 查看源码',
        core: 'Agent 工作空间',
        coreBody: '支持执行任务、交付文件、复用能力、连接业务系统及日常管理。',
        full: '带知识处理的工作空间',
        fullBody: '包含 Core 的全部能力，增加内置的文档解析、索引与知识检索。Full 需要额外资源并配置检索模型。',
        platform: 'Linux 或 macOS，需 Docker',
        compareBody: 'Core 和 Full 是两种部署配置。主机要求与安装步骤见部署文档。',
        governance: '看清运行情况。',
        model: '选择模型',
        modelBody: '接入受支持的云端模型 API 或兼容的自托管端点。',
        boundaries: '了解运行边界',
        boundaryBody: '隔离边界为用户 Worker，同一用户的任务可以访问该用户的共享文件。外部模型及集成会接收发送给它们的数据。',
        deployment: '部署环境',
        workers: '用户 Worker',
        capabilities: '共享能力',
        models: '模型端点',
      },
    },
    es: {
      cases: {
        note: 'Procesos ilustrativos con datos de ejemplo.',
        audiences: ['Compras', 'Operaciones', 'Conocimiento del equipo'],
        titles: ['Compara ofertas de proveedores', 'Prepara el informe semanal', 'Encuentra la norma y su fuente'],
        deliverables: ['Comparativa de proveedores', 'Informe de compras'],
        brief: 'Informe semanal de operaciones',
        briefPoints: ['Qué ha cambiado', 'Qué queda por decidir', 'Próximos pasos'],
        reference: 'Política de compras · Fuente de ejemplo',
        outputs: ['Una hoja comparativa y un informe para tomar una decisión.', 'Un informe con cambios, cuestiones pendientes y próximos pasos.', 'Una respuesta con referencias que puedes consultar.'],
        handoff: 'Facilita el trabajo a quien venga después.',
        handoffBody: 'Convierte un método probado en una habilidad o aplicación y compártelo con usuarios o grupos concretos. Pon a su alcance el conocimiento y las herramientas sin entregarles las credenciales.',
      },
      hosting: {
        source: 'Ver el código en GitHub',
        core: 'El espacio de trabajo con agentes',
        coreBody: 'Ejecuta tareas, entrega archivos, reutiliza capacidades, conecta sistemas de negocio y administra el espacio.',
        full: 'Con procesamiento de conocimiento',
        fullBody: 'Todas las funciones de Core, más análisis de documentos, indexación y búsqueda integrados. Full requiere recursos adicionales y un modelo de búsqueda configurado.',
        platform: 'Linux o macOS con Docker',
        compareBody: 'Core y Full son perfiles de despliegue. Consulta los requisitos del equipo y los pasos de instalación en sus guías.',
        governance: 'Ten a la vista cómo se usa.',
        model: 'Elige tus modelos',
        modelBody: 'Conecta API de modelos alojados compatibles o tus propios puntos de acceso compatibles.',
        boundaries: 'Conoce los límites',
        boundaryBody: 'El aislamiento se aplica por Worker de usuario. Las tareas de un mismo usuario pueden acceder a sus archivos compartidos. Los modelos y las integraciones externas reciben los datos que se les envían.',
        deployment: 'Despliegue',
        workers: 'Workers de usuario',
        capabilities: 'Capacidades compartidas',
        models: 'Puntos de acceso a modelos',
      },
    },
    pt: {
      cases: {
        note: 'Processos ilustrativos com dados de exemplo.',
        audiences: ['Compras', 'Operações', 'Conhecimento da equipe'],
        titles: ['Compare cotações de fornecedores', 'Prepare o resumo semanal', 'Encontre a regra e sua fonte'],
        deliverables: ['Comparativo de fornecedores', 'Resumo de compras'],
        brief: 'Resumo semanal de operações',
        briefPoints: ['O que mudou', 'O que precisa de decisão', 'Próximos passos'],
        reference: 'Política de compras · Fonte de exemplo',
        outputs: ['Uma planilha comparativa e um resumo para a tomada de decisão.', 'Um relatório com mudanças, pendências e próximos passos.', 'Uma resposta com referências que podem ser consultadas.'],
        handoff: 'Deixe o caminho pronto para quem vem depois.',
        handoffBody: 'Transforme um método testado em uma habilidade ou aplicativo e compartilhe com usuários ou grupos específicos. Dê acesso ao conhecimento e às ferramentas sem repassar credenciais.',
      },
      hosting: {
        source: 'Ver o código no GitHub',
        core: 'O ambiente de trabalho com agentes',
        coreBody: 'Execute tarefas, produza arquivos, reutilize recursos, conecte sistemas de negócio e administre o ambiente.',
        full: 'Com processamento de conhecimento',
        fullBody: 'Tudo do Core, com análise de documentos, indexação e busca integradas. Full exige recursos adicionais e um modelo de busca configurado.',
        platform: 'Linux ou macOS com Docker',
        compareBody: 'Core e Full são perfis de implantação. Consulte os guias para ver os requisitos da máquina e as etapas de instalação.',
        governance: 'Acompanhe a operação.',
        model: 'Escolha os modelos',
        modelBody: 'Conecte APIs de modelos hospedados ou endpoints compatíveis na sua infraestrutura.',
        boundaries: 'Entenda os limites',
        boundaryBody: 'O isolamento é por Worker de usuário. As tarefas do mesmo usuário podem acessar os arquivos que ele compartilhou. Modelos e integrações externas recebem os dados enviados a eles.',
        deployment: 'Implantação',
        workers: 'Workers de usuário',
        capabilities: 'Recursos compartilhados',
        models: 'Endpoints de modelos',
      },
    },
    fr: {
      cases: {
        note: 'Méthodes présentées avec des données d’exemple.',
        audiences: ['Achats', 'Opérations', 'Connaissances de l’équipe'],
        titles: ['Comparez les devis fournisseurs', 'Préparez le point hebdomadaire', 'Retrouvez la règle et sa source'],
        deliverables: ['Comparatif fournisseurs', 'Note d’achat'],
        brief: 'Point opérationnel hebdomadaire',
        briefPoints: ['Ce qui a changé', 'Décisions à prendre', 'Prochaines étapes'],
        reference: 'Politique d’achat · Source d’exemple',
        outputs: ['Un tableau comparatif et une note d’aide à la décision.', 'Un rapport avec les changements, les décisions à prendre et les prochaines étapes.', 'Une réponse assortie de références vérifiables.'],
        handoff: 'Donnez une longueur d’avance à vos collègues.',
        handoffBody: 'Transformez une méthode éprouvée en compétence ou application, puis partagez-la avec des utilisateurs ou groupes précis. Rendez les connaissances et les outils accessibles sans transmettre les identifiants.',
      },
      hosting: {
        source: 'Voir le code sur GitHub',
        core: 'L’espace de travail avec agents',
        coreBody: 'Exécutez des tâches, livrez des fichiers, réutilisez des ressources, connectez vos systèmes métier et administrez l’ensemble.',
        full: 'Avec traitement des connaissances',
        fullBody: 'Toutes les fonctions de Core, avec analyse de documents, indexation et recherche intégrées. Full requiert davantage de ressources et un modèle de recherche configuré.',
        platform: 'Linux ou macOS avec Docker',
        compareBody: 'Core et Full sont des profils de déploiement. Les guides précisent la configuration requise et les étapes d’installation.',
        governance: 'Gardez une vue sur l’activité.',
        model: 'Choisissez vos modèles',
        modelBody: 'Connectez les API de modèles hébergés prises en charge ou des points d’accès compatibles que vous hébergez.',
        boundaries: 'Connaissez les limites',
        boundaryBody: 'L’isolation s’applique au Worker de chaque utilisateur. Les tâches d’un même utilisateur accèdent à ses fichiers partagés. Les modèles et intégrations externes reçoivent les données qui leur sont transmises.',
        deployment: 'Déploiement',
        workers: 'Workers utilisateurs',
        capabilities: 'Ressources partagées',
        models: 'Points d’accès aux modèles',
      },
    },
    ja: {
      cases: {
        note: 'サンプルデータを用いた活用のイメージです。',
        audiences: ['調達', '業務運営', 'チームのナレッジ'],
        titles: ['仕入先の見積を比較する', '週次レポートを作る', 'ルールを根拠とともに確認する'],
        deliverables: ['仕入先見積比較表', '調達要約書'],
        brief: '週次業務レポート',
        briefPoints: ['今週の変化', '判断が必要な事項', '次の対応'],
        reference: '購買規程・参照元の例',
        outputs: ['見積比較の表と判断材料をまとめた要約書。', '変更点、未決事項、次の対応をまとめたレポート。', '参照元を確認できる回答。'],
        handoff: '次の担当者が、ゼロから始めずに済むように。',
        handoffBody: '確かめた手順をスキルやアプリにして、指定したユーザーやグループと共有します。認証情報を渡すことなく、必要な知識とツールを使えるようにします。',
      },
      hosting: {
        source: 'GitHub でソースを見る',
        core: 'エージェント作業環境',
        coreBody: 'タスク実行、ファイルの作成、共有リソースの活用、業務システムとの連携、管理機能を備えます。',
        full: 'ナレッジ処理を備えた作業環境',
        fullBody: 'Core の機能に、組み込みの文書解析、索引作成、検索を追加します。追加のリソースと検索用モデルの設定が必要です。',
        platform: 'Docker が使える Linux または macOS',
        compareBody: 'Core と Full は導入構成の違いです。ホストの要件やインストール手順は導入ガイドをご覧ください。',
        governance: '運用状況を把握する。',
        model: 'モデルを選ぶ',
        modelBody: '対応するクラウドモデル API や互換性のある自前のモデルエンドポイントを接続できます。',
        boundaries: '分離とデータ連携の範囲',
        boundaryBody: '分離の単位はユーザーごとの Worker です。同じユーザーのタスクは、そのユーザーの共有ファイルにアクセスできます。外部モデルや連携先には、送信したデータが渡ります。',
        deployment: '導入環境',
        workers: 'ユーザー別 Worker',
        capabilities: '共有リソース',
        models: 'モデルエンドポイント',
      },
    },
  }
  const locales = [
    ['', 'en-US', 'On your infrastructure.', 'a real task.', 'on your terms.', detailCopy.en],
    ['/zh', 'zh-CN', '部署和权限，你做主', '具体的事开始。', '由你决定。', detailCopy.zh],
    ['/es', 'es-ES', 'En tu infraestructura.', 'una tarea real.', 'a tu manera.', detailCopy.es],
    ['/pt', 'pt-BR', 'Na sua infraestrutura.', 'uma tarefa real.', 'seu jeito.', detailCopy.pt],
    ['/fr', 'fr-FR', 'Sur votre infrastructure.', 'une tâche réelle.', 'à votre façon.', detailCopy.fr],
    ['/ja', 'ja-JP', '自社の環境で運用。', '始めよう。', '自分たちで決める。', detailCopy.ja],
  ]
  for (const [prefix, locale, home, cases, hosting, detail] of locales) {
    const docs = locale === 'en-US' ? 'https://linksense.org/doc/' : `https://linksense.org/doc/${locale}/`
    for (const [suffix, heading] of [['', home], ['/use-cases', cases], ['/self-hosted', hosting]]) {
      const path = (prefix + suffix) || '/'
      const response = await request(path)
      assert.equal(response.status, 200, path)
      const html = await response.text()
      const title = html.match(/<h1\b[^>]*>(.*?)<\/h1>/s)?.[1] ?? ''
      assert.ok(html.includes(`<html lang="${locale}"`), path)
      assert.ok(title.includes(heading), `SSR heading missing on ${path}`)
      assert.ok(html.includes(`href="${docs}"`), `Documentation link missing on ${path}`)
      assert.ok(html.includes('name="description"'), path)
      assert.ok(html.includes('name="color-scheme" content="light dark"'), `System theme default missing on ${path}`)
      if (!process.env.VITE_SITE_URL) assert.ok(html.includes('noindex, nofollow'), path)
      if (!suffix) {
        assert.ok(html.includes('WorkBuddy') && html.includes('ChatGPT Enterprise'), `Product positioning missing on ${path}`)
        assert.match(html, /class="bit-stage [^"]*"[\s\S]+?<img\b(?=[^>]*src="\/media\/workspace-result\.webp")(?=[^>]*fetchPriority="high")[^>]*>/i, `Workspace still isn't prioritized in the stage on ${path}`)
        assert.match(html, /href="\/media\/product-demo\.mp4"/, `Workspace recording fallback missing on ${path}`)
        assert.ok(!html.includes('src="/media/workspace-teaser.mp4"'), `Workspace recording shouldn't autoplay on ${path}`)
        assert.match(html, /<p\b[^>]* id="deliverables-title"[^>]*>.*?<\/p>\s*<ul\b[^>]* aria-labelledby="deliverables-title"/s, `Deliverables list name missing on ${path}`)
        for (const anchor of ['procurement', 'reporting', 'knowledge']) {
          assert.ok(html.includes(`href="${prefix}/use-cases#${anchor}"`), `Localized use case missing on ${path}`)
        }
        const story = ['id="workspace"', 'id="scenarios-title"', 'id="team-title"', 'id="ownership-title"'].map((name) => html.indexOf(name))
        assert.ok(story.every((position, index) => position >= 0 && (!index || position > story[index - 1])), `Homepage story order is wrong on ${path}`)
      }
      if (suffix === '/use-cases') {
        const expected = detail.cases
        for (const anchor of ['examples', 'procurement', 'reporting', 'knowledge', 'capability-sharing']) {
          assert.ok(html.includes(`id="${anchor}"`), `Linked example is missing on ${path}`)
        }
        assert.ok(html.includes('class="bit-hero detail-hero detail-hero--cases"'), `Split use-case lead missing on ${path}`)
        assert.ok(html.includes('class="bit-source detail-source-chip"'), `Use-case source chip missing on ${path}`)
        assert.ok(html.includes(expected.note), `Example-data note missing on ${path}`)
        assert.equal(count(html, /class="chip detail-audience"/g), 3, `Audience labels missing on ${path}`)
        for (const audience of expected.audiences) assert.ok(html.includes(audience), `Audience ${audience} missing on ${path}`)
        assert.equal(count(html, /class="bit-stage detail-case detail-case--/g), 3, `Use-case stages missing on ${path}`)
        for (const heading of expected.titles) assert.ok(html.includes(heading), `Use-case title ${heading} missing on ${path}`)
        for (const deliverable of expected.deliverables) assert.ok(html.includes(deliverable), `Deliverable ${deliverable} missing on ${path}`)
        assert.ok(html.includes(expected.brief), `Brief panel missing on ${path}`)
        for (const point of expected.briefPoints) assert.ok(html.includes(point), `Brief point ${point} missing on ${path}`)
        assert.ok(html.includes(expected.reference), `Reference panel missing on ${path}`)
        for (const output of expected.outputs) assert.ok(html.includes(output), `Use-case output missing on ${path}`)
        assert.ok(html.includes(expected.handoff) && html.includes(expected.handoffBody), `Capability-sharing copy missing on ${path}`)
        for (const kind of ['procurement', 'reporting', 'knowledge']) {
          assert.ok(html.includes(`detail-inspector--${kind}`), `Distinct ${kind} inspector missing on ${path}`)
        }
        assert.ok(html.includes('class="detail-inspector-body detail-brief"'), `Brief layout missing on ${path}`)
        assert.ok(html.includes('class="detail-inspector-body detail-reference"'), `Reference layout missing on ${path}`)
        assert.ok(html.includes('class="bit-stage detail-sharing-stage"'), `Framed sharing stage missing on ${path}`)
        assert.ok(html.includes('src="/media/team-app.webp"'), `Sharing product media missing on ${path}`)
        assert.ok(html.includes('href="https://explore.linksense.org/"'), `Demo target missing on ${path}`)
        assert.ok(!html.includes('detail-compare'), `Use-case layout contains the hosting comparison on ${path}`)
      }
      if (suffix === '/self-hosted') {
        const expected = detail.hosting
        for (const anchor of ['profiles', 'governance']) {
          assert.ok(html.includes(`id="${anchor}"`), `Hosting anchor ${anchor} missing on ${path}`)
        }
        assert.ok(html.includes('id="profiles-title"') && html.includes('id="governance-title"'), `Hosting title IDs missing on ${path}`)
        assert.ok(html.includes('class="bit-hero detail-hero detail-hero--hosting"'), `Split hosting lead missing on ${path}`)
        assert.ok(html.includes('class="bit-source detail-source-chip"'), `Hosting source chip missing on ${path}`)
        assert.ok(html.includes(expected.source), `GitHub source label missing on ${path}`)
        assert.ok(html.includes('class="bit-stage detail-compare"'), `Core and Full panels missing on ${path}`)
        assert.equal(count(html, /class="bit-stage-panel detail-profile/g), 2, `Hosting profiles incomplete on ${path}`)
        for (const item of [expected.core, expected.coreBody, expected.full, expected.fullBody, expected.platform, expected.compareBody]) {
          assert.ok(html.includes(item), `Hosting profile content missing on ${path}: ${item}`)
        }
        assert.ok(html.includes('class="bit-stage detail-governance"'), `Governance stage missing on ${path}`)
        for (const item of [expected.governance, expected.model, expected.modelBody, expected.boundaries, expected.boundaryBody, expected.deployment, expected.workers, expected.capabilities, expected.models]) {
          assert.ok(html.includes(item), `Governance content missing on ${path}: ${item}`)
        }
        assert.ok(html.includes(`href="${docs}deploy/core/"`), `Core deployment path missing on ${path}`)
        assert.ok(html.includes(`href="${docs}deploy/full/"`), `Full deployment path missing on ${path}`)
        assert.ok(html.includes('href="https://github.com/LingX-AI/LinkSense"'), `GitHub target missing on ${path}`)
        assert.ok(html.includes('href="https://github.com/LingX-AI/LinkSense/security/policy"'), `Security policy target missing on ${path}`)
        assert.ok(html.includes('class="boundary detail-boundary"'), `Data-boundary panel missing on ${path}`)
        assert.ok(!html.includes('detail-case'), `Hosting layout contains the use-case inspector on ${path}`)
      }
    }
  }
  const alias = await request('/en/use-cases')
  assert.equal(alias.status, 308)
  assert.equal(alias.headers.get('location'), '/use-cases')
  const invalid = await request('/unavailable/use-cases')
  assert.equal(invalid.status, 404)
  assert.ok((await invalid.text()).includes('Page not found'))
  assert.equal((await request('/doc/deploy/core')).status, 404)

  const brandArt = await request('/media/social.jpg')
  assert.equal(brandArt.status, 200)
  assert.equal(brandArt.headers.get('content-type'), 'image/jpeg')
  const film = await fetch(`${origin}/media/linksense-intro-v6.mp4`, {
    headers: { Range: 'bytes=0-255' }, signal: AbortSignal.timeout(5000),
  })
  assert.equal(film.status, 206)
  assert.equal((await film.arrayBuffer()).byteLength, 256)
  console.log('18 localized pages verified in SSR HTML; homepage story, both detail bodies and anchors, split detail leads, redirect, 404, social image, and video range request passed.')
} finally {
  server.kill()
  await closed
}
