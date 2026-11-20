import {
  ArrowUp, BookOpen, Check, ChevronDown, ChevronRight, ChevronsLeft,
  Eye, FileSpreadsheet, FileText, Folder, List, MoreHorizontal, Plus, RotateCcw,
  Search, Sparkles, X, Zap,
} from 'lucide-react'
import { useEffect, useId, useImperativeHandle, useReducer, useRef, useState } from 'react'
import type { CSSProperties, Ref } from 'react'
import { useSite } from '../lib/use-site'
import './workspace-demo.css'

export type WorkspaceDemoFile = 'sheet' | 'brief'
export type WorkspaceDemoHandle = {
  openFile(file: WorkspaceDemoFile): void
  replay(): void
}
export type WorkspaceDemoPhase = 'request' | 'working' | 'files'

type Phase = 'typing' | 'draft' | 'working' | 'responding' | 'files'
type State = {
  phase: Phase
  elapsed: number
  draft: string
  request: string
  drawer: boolean
  preview: WorkspaceDemoFile | null
  processOpen: boolean
  attached: boolean
  knowledge: boolean
  projectOpen: boolean
  sidebarCollapsed: boolean
  modelOpen: boolean
  reasoning: 'Medium' | 'High'
  activeEntry: 'project' | 'recent' | null
}
type Action =
  | { type: 'tick'; prompt: string }
  | { type: 'edit'; value: string }
  | { type: 'send'; prompt: string; reduced: boolean }
  | { type: 'finish'; prompt: string }
  | { type: 'replay' }
  | { type: 'new' }
  | { type: 'drawer' }
  | { type: 'open'; file: WorkspaceDemoFile }
  | { type: 'close' }
  | { type: 'toggle'; key: 'processOpen' | 'attached' | 'knowledge' | 'projectOpen' | 'sidebarCollapsed' | 'modelOpen' }
  | { type: 'reasoning'; value: 'Medium' | 'High' }
  | { type: 'select-entry'; entry: 'project' | 'recent' }

const initialState: State = {
  phase: 'typing', elapsed: 0, draft: '', request: '', drawer: false, preview: null,
  processOpen: false, attached: true, knowledge: true, projectOpen: true,
  sidebarCollapsed: false, modelOpen: false, reasoning: 'Medium', activeEntry: 'project',
}

function demoReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'tick': {
      const elapsed = state.elapsed + 60
      if (state.phase === 'typing' && elapsed >= 2400) return { ...state, phase: 'working', elapsed: 0, request: action.prompt, draft: '' }
      if (state.phase === 'working' && elapsed >= 3300) return { ...state, phase: 'responding', elapsed: 0 }
      if (state.phase === 'responding' && elapsed >= 1900) return { ...state, phase: 'files', elapsed: 0, drawer: true }
      return { ...state, elapsed }
    }
    case 'edit': return { ...state, draft: action.value, phase: state.phase === 'typing' ? 'draft' : state.phase }
    case 'send': return { ...state, request: action.prompt, draft: '', phase: action.reduced ? 'files' : 'working', elapsed: 0, drawer: action.reduced, preview: null, processOpen: false }
    case 'finish': return { ...state, phase: 'files', elapsed: 0, request: state.request || action.prompt, drawer: true, preview: null }
    case 'replay': return { ...initialState }
    case 'new': return { ...initialState, phase: 'draft', attached: false, knowledge: false, activeEntry: null }
    case 'drawer': return { ...state, drawer: !state.drawer, phase: state.phase === 'typing' ? 'draft' : state.phase }
    case 'open': return { ...state, phase: 'files', drawer: true, preview: action.file, elapsed: 0 }
    case 'close': return { ...state, preview: null }
    case 'toggle': return { ...state, [action.key]: !state[action.key], phase: state.phase === 'typing' ? 'draft' : state.phase }
    case 'reasoning': return { ...state, reasoning: action.value, modelOpen: false }
    case 'select-entry': return { ...state, activeEntry: action.entry }
  }
}

const copy = {
  en: {
    label: 'Interactive product demo', demo: 'Interactive demo', hint: 'Illustrative task · no data is uploaded',
    task: 'Q3 enrollment data', today: 'Today', newTask: 'New task', workspace: 'Workspace',
    automations: 'Automations', plugins: 'Plugin Center', resources: 'Resource library', pinned: 'Pinned', projects: 'Projects', recent: 'Recent tasks',
    enrollment: 'Enrollment', leadership: 'Leadership briefing', curriculum: 'Curriculum', syllabus: 'Grade 10 syllabus',
    lesson: 'Lesson planning', parents: 'Parent meeting notes', faculty: 'Faculty resources',
    prompt: 'Can you help me prepare a concise Q3 enrollment briefing for the leadership team?',
    placeholder: 'Describe what you want LinkSense to do…', send: 'Run example task', attach: 'Attach sample CSV', knowledge: 'Knowledge', public: 'Public workspace',
    typing: 'Preparing your example task…', working: 'Working through the sample files', done: 'Example completed',
    process: 'Execution details', read: 'Read the enrollment data', analyze: 'Compare grades and enrollment targets', create: 'Prepare the briefing and workbook',
    intro: 'I’ve prepared the Q3 enrollment briefing and analysis workbook. Both deliverables are available in Task overview.',
    structure: 'Deliverables at a glance', one: 'Leadership briefing', oneBody: 'Enrollment summary, key changes, and follow-up questions',
    two: 'Analysis workbook', twoBody: 'Tables and comparisons for further review', three: 'Sources reviewed', threeBody: 'Uploaded enrollment data and internal enrollment targets',
    ending: 'Open Task overview to preview the deliverables or inspect the original sources.', overview: 'Task overview', outputs: 'Output files', sources: 'Sources',
    brief: 'Q3 enrollment briefing.pdf', sheet: 'Enrollment analysis.xlsx', csv: 'Q3 enrollment.csv', targets: 'Enrollment targets 2026',
    sourceCSV: 'Uploaded file · CSV', sourceKnowledge: 'Knowledge base · Enrollment plan', sample: 'Sample data',
    replay: 'Replay example', close: 'Close preview', preview: 'Preview', completedFirst: 'Run the example to create the two deliverables.',
    tableTitle: 'Enrollment analysis', reportTitle: 'Q3 enrollment briefing', reportSubtitle: 'A concise example for the leadership team',
    summary: 'Enrollment at a glance', summaryBody: 'The sample cohort contains 892 students across three grades. The workbook keeps the figures and changes together for review.',
    findings: 'What changed', findingsBody: 'Grades 6 and 7 grew from the previous quarter. Grade 8 needs a closer look before setting the next intake target.',
    next: 'Recommended follow-ups', nextBody: 'Confirm the source figures, review the Grade 8 trend, and agree on the next intake plan with the enrollment team.',
    grade: 'Grade', students: 'Students', change: 'Quarterly change', total: 'Total', sampleNote: 'Illustrative figures for this local demo. This is not a live task or a generated business report.',
    editNote: 'This demo runs the enrollment example locally, using the sample files below.', inputLabel: 'Example task instructions', sidebar: 'Toggle sidebar',
  },
  zh: {
    label: '可交互产品演示', demo: '交互演示', hint: '示例任务 · 不上传数据',
    task: '第三季度招生数据', today: '今天', newTask: '新建任务', workspace: '工作空间',
    automations: '自动化', plugins: '插件中心', resources: '资料库', pinned: '已置顶', projects: '项目', recent: '最近任务',
    enrollment: '招生', leadership: '管理层简报', curriculum: '课程', syllabus: '十年级课程大纲',
    lesson: '课程规划', parents: '家长会记录', faculty: '教师资源',
    prompt: '请根据招生数据，为管理团队准备一份简洁的第三季度招生简报。',
    placeholder: '描述你想让 LinkSense 完成的工作…', send: '运行示例任务', attach: '添加示例 CSV', knowledge: '知识库', public: '公共工作空间',
    typing: '正在准备示例任务…', working: '正在处理示例资料', done: '示例已完成',
    process: '查看执行过程', read: '读取招生数据', analyze: '对比年级数据与招生目标', create: '整理简报与分析表格',
    intro: '已准备好第三季度招生简报与分析表格。两份成果都可以在任务概览中查看。',
    structure: '成果一览', one: '管理层简报', oneBody: '招生概况、关键变化和待跟进事项',
    two: '分析工作簿', twoBody: '供进一步审核的明细表格与对比', three: '已查阅来源', threeBody: '上传的招生数据与内部招生目标',
    ending: '打开任务概览，预览成果文件或查看原始来源。', overview: '任务概览', outputs: '成果文件', sources: '来源',
    brief: '第三季度招生简报.pdf', sheet: '招生数据分析.xlsx', csv: '第三季度招生.csv', targets: '2026 年招生目标',
    sourceCSV: '上传文件 · CSV', sourceKnowledge: '知识库 · 招生计划', sample: '示例数据',
    replay: '重新演示', close: '关闭预览', preview: '预览', completedFirst: '运行示例后，这里会生成两份成果。',
    tableTitle: '招生数据分析', reportTitle: '第三季度招生简报', reportSubtitle: '面向管理团队的简洁示例',
    summary: '招生概况', summaryBody: '示例中三个年级共计 892 名学生。分析表保留了各年级数据与季度变化，便于进一步核对。',
    findings: '主要变化', findingsBody: '六年级和七年级较上季度增长。制定下一阶段招生目标前，需要进一步了解八年级的变化。',
    next: '建议跟进', nextBody: '核对原始数据，复核八年级趋势，并与招生团队确认下一阶段计划。',
    grade: '年级', students: '学生人数', change: '季度变化', total: '合计', sampleNote: '仅用于本地演示的示例数据，并非真实任务或业务报告。',
    editNote: '此处使用下方示例资料，在本地演示招生简报流程。', inputLabel: '示例任务要求', sidebar: '展开或收起侧栏',
  },
} as const

export function WorkspaceDemo({ ref, playing, reducedMotion, loop = false, onPhaseChange }: {
  ref?: Ref<WorkspaceDemoHandle>
  playing: boolean
  reducedMotion: boolean
  loop?: boolean
  onPhaseChange?: (phase: WorkspaceDemoPhase) => void
}) {
  const { locale } = useSite()
  const text = copy[locale === 'zh' ? 'zh' : 'en']
  const [state, dispatch] = useReducer(demoReducer, initialState)
  const [scale, setScale] = useState(.3)
  const [userControlled, setUserControlled] = useState(false)
  const viewport = useRef<HTMLDivElement>(null)
  const editor = useRef<HTMLTextAreaElement>(null)
  const previewClose = useRef<HTMLButtonElement>(null)
  const previousFocus = useRef<HTMLElement | null>(null)
  const processId = useId()
  const inputId = useId()
  const ticking = state.phase === 'typing' || state.phase === 'working' || state.phase === 'responding'
  const complete = state.phase === 'files'
  const responding = state.phase === 'responding' || complete
  const request = state.request || text.prompt
  const visibleDraft = state.phase === 'typing' ? text.prompt.slice(0, Math.floor(state.elapsed / 1800 * text.prompt.length)) : state.draft
  const responseLength = complete ? text.intro.length : Math.floor(state.elapsed / 800 * text.intro.length)

  useEffect(() => {
    const element = viewport.current
    if (!element) return
    const observer = new ResizeObserver(([entry]) => {
      if (entry && entry.contentRect.width > 0) setScale(entry.contentRect.width / 1440)
    })
    observer.observe(element)
    const width = element.getBoundingClientRect().width
    if (width > 0) setScale(width / 1440)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!playing || reducedMotion || !ticking || state.preview) return
    const timer = window.setInterval(() => dispatch({ type: 'tick', prompt: text.prompt }), 60)
    return () => window.clearInterval(timer)
  }, [playing, reducedMotion, ticking, state.preview, text.prompt])

  useEffect(() => {
    if (!loop || !playing || reducedMotion || !complete || state.preview || userControlled) return
    // Leave enough time to read the deliverables, then start a fresh example.
    // Any visitor interaction takes ownership until they explicitly replay it.
    const timer = window.setTimeout(() => dispatch({ type: 'replay' }), 3600)
    return () => window.clearTimeout(timer)
  }, [loop, playing, reducedMotion, complete, state.preview, userControlled])

  useEffect(() => {
    if (reducedMotion && ticking) dispatch({ type: 'finish', prompt: text.prompt })
  }, [reducedMotion, ticking, text.prompt])

  useEffect(() => {
    const phase = state.phase === 'typing' || state.phase === 'draft' ? 'request' : complete ? 'files' : 'working'
    onPhaseChange?.(phase)
  }, [state.phase, complete, onPhaseChange])

  useEffect(() => {
    if (state.preview) {
      previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
      previewClose.current?.focus({ preventScroll: true })
    } else if (previousFocus.current?.isConnected) {
      previousFocus.current.focus({ preventScroll: true })
      previousFocus.current = null
    }
  }, [state.preview])

  useImperativeHandle(ref, () => ({
    openFile(file) { dispatch({ type: 'finish', prompt: text.prompt }); dispatch({ type: 'open', file }) },
    replay() { setUserControlled(false); dispatch({ type: 'replay' }); if (reducedMotion) dispatch({ type: 'finish', prompt: text.prompt }) },
  }), [reducedMotion, text.prompt])

  function submit() {
    const prompt = visibleDraft.trim()
    if (!prompt || state.phase === 'working' || state.phase === 'responding') return
    dispatch({ type: 'send', prompt, reduced: reducedMotion })
  }

  function openFile(file: WorkspaceDemoFile) {
    dispatch({ type: 'open', file })
  }

  return (
    <div ref={viewport} className="workspace-demo" role="region" aria-label={text.label}
      data-demo-phase={state.phase} data-demo-playing={playing ? 'true' : 'false'} data-demo-reduced={reducedMotion ? 'true' : 'false'}
      data-demo-loop={loop && !userControlled ? 'true' : 'false'}
      onPointerDownCapture={() => setUserControlled(true)} onFocusCapture={() => setUserControlled(true)}
      style={{ '--wd-scale': scale } as CSSProperties}>
      <div className={`wd-canvas${state.sidebarCollapsed ? ' wd-canvas--collapsed' : ''}`}>
        <aside className="wd-sidebar" aria-label={text.workspace}>
          <div className="wd-brand-row">
            <img src="/brand/figma-lockup-light.svg" alt="LinkSense" width="120" height="29" />
            <div className="wd-sidebar-tools"><Search size={17} aria-hidden="true" /><button type="button" onClick={() => dispatch({ type: 'toggle', key: 'sidebarCollapsed' })} aria-label={text.sidebar}><ChevronsLeft size={17} /></button></div>
          </div>
          <button type="button" className="wd-new-task" onClick={() => { dispatch({ type: 'new' }); editor.current?.focus() }}><Plus size={18} />{text.newTask}</button>
          <div className="wd-nav-group">
            <p>{text.workspace}</p>
            <span><Zap size={17} />{text.automations}</span><span><Sparkles size={17} />{text.plugins}</span><span><BookOpen size={17} />{text.resources}</span>
          </div>
          <div className="wd-nav-group wd-nav-group--pinned"><p>{text.pinned}</p><span>{text.syllabus}</span></div>
          <div className="wd-nav-group wd-projects">
            <p>{text.projects}</p>
            <button type="button" className="wd-project-row" onClick={() => dispatch({ type: 'toggle', key: 'projectOpen' })} aria-expanded={state.projectOpen}><Folder size={17} /><span>{text.enrollment}</span><MoreHorizontal size={16} /></button>
            {state.projectOpen && <div className="wd-project-children"><button type="button" className={state.activeEntry === 'project' ? 'wd-nav-selected' : undefined} aria-current={state.activeEntry === 'project' ? 'page' : undefined} onClick={() => { dispatch({ type: 'select-entry', entry: 'project' }); dispatch({ type: 'finish', prompt: text.prompt }) }}>{text.task}</button><span>{text.leadership}</span></div>}
            <span><Folder size={17} />{text.curriculum}</span>
          </div>
          <div className="wd-nav-group wd-recent"><p>{text.recent}</p><button type="button" className={state.activeEntry === 'recent' ? 'wd-nav-selected' : undefined} aria-current={state.activeEntry === 'recent' ? 'page' : undefined} onClick={() => { dispatch({ type: 'select-entry', entry: 'recent' }); dispatch({ type: 'finish', prompt: text.prompt }) }}>{text.task}</button><span>{text.lesson}</span><span>{text.parents}</span><span>{text.faculty}</span></div>
          <div className="wd-account"><span className="wd-avatar" aria-hidden="true">RQ</span><span>Rebecca Qi</span><span className="wd-demo-pill">{text.demo}</span></div>
        </aside>
        <div className="wd-main">
          <header className="wd-header">
            <div>{state.sidebarCollapsed && <button type="button" aria-label={text.sidebar} onClick={() => dispatch({ type: 'toggle', key: 'sidebarCollapsed' })}><ChevronsLeft className="wd-expand-icon" size={19} /></button>}<strong>{text.task}</strong><MoreHorizontal size={18} aria-hidden="true" /></div>
            <div><button type="button" className="wd-replay" onClick={() => { setUserControlled(false); dispatch({ type: 'replay' }); if (reducedMotion) dispatch({ type: 'finish', prompt: text.prompt }) }}><RotateCcw size={17} /><span>{text.replay}</span></button><button type="button" className={state.drawer ? 'wd-icon-active' : ''} onClick={() => dispatch({ type: 'drawer' })} aria-expanded={state.drawer} aria-label={text.overview}><List size={22} /></button></div>
          </header>
          <div className="wd-chat" aria-busy={state.phase === 'working' || state.phase === 'responding'}>
            <p className="wd-date">{text.today}</p>
            {state.phase === 'draft' && !state.request && <div className="wd-empty"><img src="/brand/figma-icon.svg" alt="" width="44" height="44" /><h2>{text.prompt}</h2><p>{text.editNote}</p><button type="button" onClick={() => dispatch({ type: 'edit', value: text.prompt })}>{text.task}<ArrowUp size={18} /></button></div>}
            {(state.phase === 'working' || responding) && <div className="wd-user-message"><p>{request}</p></div>}
            {(state.phase === 'working' || responding) && <div className="wd-response">
              <button type="button" className="wd-process-toggle" onClick={() => dispatch({ type: 'toggle', key: 'processOpen' })} aria-expanded={state.processOpen} aria-controls={processId}>
                {state.phase === 'working' ? <span className="wd-thinking" aria-hidden="true"><i /><i /><i /></span> : <Check size={17} />}
                <span>{complete ? text.done : text.working}</span><ChevronRight className={state.processOpen ? 'wd-open-chevron' : ''} size={16} />
              </button>
              {state.processOpen && <ol id={processId} className="wd-process-list">{[text.read, text.analyze, text.create].map((step, index) => <li key={step} data-complete={responding || state.elapsed > index * 1000 ? 'true' : 'false'}><Check size={14} />{step}</li>)}</ol>}
              {responding && <div className="wd-response-copy">
                <p className="wd-response-intro">{text.intro.slice(0, responseLength)}{!complete && responseLength < text.intro.length && <span className="wd-type-caret" aria-hidden="true" />}</p>
                <div className="wd-outline">
                  <h3>{text.structure}</h3>
                  {[[text.one, text.oneBody], [text.two, text.twoBody], [text.three, text.threeBody]].map(([heading, body], index) => (complete || state.elapsed > 500 + index * 380) && <div className="wd-outline-row" key={heading}><span>{String(index + 1).padStart(2, '0')}</span><div><strong>{heading}</strong><p>{body}</p></div></div>)}
                </div>
                {complete && <p className="wd-response-ending">{text.ending}</p>}
              </div>}
            </div>}
          </div>
          <form className="wd-composer" onSubmit={(event) => { event.preventDefault(); submit() }}>
            <label className="wd-sr-only" htmlFor={inputId}>{text.inputLabel}</label>
            <textarea id={inputId} ref={editor} value={visibleDraft} placeholder={text.placeholder} maxLength={300}
              onFocus={() => { if (state.phase === 'typing') dispatch({ type: 'edit', value: visibleDraft }) }}
              onChange={(event) => dispatch({ type: 'edit', value: event.target.value })}
              onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); submit() } }} aria-describedby={`${inputId}-note`} />
            {(state.attached || state.knowledge) && <div className="wd-input-sources">{state.attached && <button type="button" onClick={() => dispatch({ type: 'toggle', key: 'attached' })}><FileSpreadsheet size={14} />{text.csv}<X size={12} /></button>}{state.knowledge && <button type="button" onClick={() => dispatch({ type: 'toggle', key: 'knowledge' })}><BookOpen size={14} />{text.targets}<X size={12} /></button>}</div>}
            <div className="wd-composer-tools">
              <div><button type="button" onClick={() => dispatch({ type: 'toggle', key: 'attached' })} aria-pressed={state.attached}><Plus size={22} />{text.attach}</button><button type="button" onClick={() => dispatch({ type: 'toggle', key: 'knowledge' })} aria-pressed={state.knowledge}><BookOpen size={20} />{text.knowledge}</button><span className="wd-workspace-label"><Folder size={20} />{text.public}</span></div>
              <div className="wd-model-tools"><div className="wd-model-control"><button type="button" onClick={() => dispatch({ type: 'toggle', key: 'modelOpen' })} aria-expanded={state.modelOpen}>GPT-5.6 Terra <span>{state.reasoning}</span><ChevronDown size={15} /></button>{state.modelOpen && <div className="wd-model-menu">{(['Medium', 'High'] as const).map(value => <button type="button" key={value} onClick={() => dispatch({ type: 'reasoning', value })} aria-pressed={state.reasoning === value}>{value}{state.reasoning === value && <Check size={14} />}</button>)}</div>}</div><button type="submit" className="wd-send" aria-label={text.send} disabled={!visibleDraft.trim() || state.phase === 'working' || state.phase === 'responding'}><ArrowUp size={20} /></button></div>
            </div>
          </form>
          <p className="wd-local-note" id={`${inputId}-note`}>{text.hint}</p>
          {state.drawer && <section className="wd-overview" aria-label={text.overview}>
            <div className="wd-overview-heading"><h2>{text.overview}</h2><button type="button" onClick={() => dispatch({ type: 'drawer' })} aria-label={text.close}><X size={16} /></button></div>
            <div className="wd-files-group"><h3>{text.outputs}<span>{complete ? '2' : '0'}</span></h3>
              {complete ? <>{(['brief', 'sheet'] as const).map(file => <button type="button" className="wd-file-row" key={file} onClick={() => openFile(file)} data-demo-file={file} aria-label={`${text.preview}: ${file === 'brief' ? text.brief : text.sheet}`}>
                {file === 'brief' ? <FileText className="wd-pdf-icon" size={22} /> : <FileSpreadsheet className="wd-sheet-icon" size={22} />}<span><strong>{file === 'brief' ? text.brief : text.sheet}</strong><small>{file === 'brief' ? 'PDF · 248 KB' : 'XLSX · 96 KB'}</small></span><Eye size={16} aria-hidden="true" /></button>)}</> : <p className="wd-files-empty">{text.completedFirst}</p>}
            </div>
            <div className="wd-files-group"><h3>{text.sources}<span>2</span></h3><div className="wd-source-row"><FileSpreadsheet className="wd-sheet-icon" size={22} /><span><strong>{text.csv}</strong><small>{text.sourceCSV}</small></span></div><div className="wd-source-row"><BookOpen size={22} /><span><strong>{text.targets}</strong><small>{text.sourceKnowledge}</small></span></div></div>
          </section>}
        </div>
        {state.preview && <section className="wd-file-preview" role="dialog" aria-modal="false" aria-label={`${text.preview}: ${state.preview === 'sheet' ? text.sheet : text.brief}`}
          onKeyDown={event => { if (event.key === 'Escape') { event.stopPropagation(); dispatch({ type: 'close' }) } }}>
          <header><div>{state.preview === 'sheet' ? <FileSpreadsheet className="wd-sheet-icon" size={22} /> : <FileText className="wd-pdf-icon" size={22} />}<strong>{state.preview === 'sheet' ? text.sheet : text.brief}</strong><span>{text.sample}</span></div><button type="button" ref={previewClose} aria-label={text.close} onClick={() => dispatch({ type: 'close' })}><X size={22} /></button></header>
          <div className="wd-preview-content">{state.preview === 'sheet' ? <div className="wd-sheet-preview"><h2>{text.tableTitle}</h2><p>{text.sampleNote}</p><table><thead><tr><th aria-label="Row">#</th><th>{text.grade}</th><th>{text.students}</th><th>{text.change}</th></tr></thead><tbody>{[['6', '312', '+14'], ['7', '284', '+9'], ['8', '296', '−3']].map(([grade, count, change], index) => <tr key={grade}><th>{index + 1}</th><td>{grade}</td><td>{count}</td><td>{change}</td></tr>)}<tr className="wd-total-row"><th>4</th><td>{text.total}</td><td>892</td><td>+20</td></tr></tbody></table><div className="wd-sheet-tab">Q3 enrollment</div></div> : <article className="wd-paper"><p className="wd-paper-demo">{text.sample}</p><h1>{text.reportTitle}</h1><p className="wd-paper-subtitle">{text.reportSubtitle}</p>{[[text.summary, text.summaryBody], [text.findings, text.findingsBody], [text.next, text.nextBody]].map(([heading, body]) => <section key={heading}><h2>{heading}</h2><p>{body}</p></section>)}<footer>{text.sampleNote}</footer></article>}</div>
        </section>}
      </div>
    </div>
  )
}
