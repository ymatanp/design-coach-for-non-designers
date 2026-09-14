import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Copy,
  FileImage,
  FileText,
  Palette,
  ImageIcon,
  LayoutTemplate,
  MonitorSmartphone,
  Presentation,
  ShieldCheck,
  Sparkles,
  Target,
  Upload,
  Wand2,
} from 'lucide-react'
import './App.css'
import {
  buildPromptForTask,
  defaultCoachState,
  findTaskById,
  getChecklistSections,
  getRelevantPrinciples,
  principleMap,
  tasks,
  type CoachState,
  type PrincipleId,
  type ReviewResult,
  type TaskId,
} from './data/designCoachData'
import { analyzeWork } from './services/reviewService'

const STORAGE_KEY = 'design-coach-state'
const stepLabels = ['Choose task', 'Goals', 'Design principles', 'Review', 'Results', 'Prompt']

const taskIconMap = {
  presentation: Presentation,
  'ai-image': ImageIcon,
  sharepoint: LayoutTemplate,
  'figma-make': Palette,
  document: FileText,
  'figma-design': MonitorSmartphone,
} as const

function App() {
  const [state, setState] = useState<CoachState>(() => {
    if (typeof window === 'undefined') return defaultCoachState
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return defaultCoachState

    try {
      return { ...defaultCoachState, ...JSON.parse(saved), expanded: [] }
    } catch {
      return defaultCoachState
    }
  })

  const [currentStep, setCurrentStep] = useState<number>(() => {
    if (typeof window === 'undefined') return 0
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return 0

    try {
      return Number(JSON.parse(saved).currentStep ?? 0)
    } catch {
      return 0
    }
  })

  const [reviewResult, setReviewResult] = useState<ReviewResult | null>(null)
  const [copied, setCopied] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, currentStep }))
    }
  }, [state, currentStep])

  const selectedTask = useMemo(() => findTaskById(state.taskId), [state.taskId])
  const relevantPrinciples = useMemo(() => getRelevantPrinciples(state.taskId), [state.taskId])
  const checklistSections = useMemo(() => getChecklistSections(state.taskId), [state.taskId])
  const promptText = useMemo(() => buildPromptForTask(state.taskId), [state.taskId])

  const handleSelectTask = (taskId: TaskId) => {
    setState((previous) => ({
      ...previous,
      taskId,
      expanded: [],
    }))
    setCurrentStep(1)
  }

  const updateField = (field: keyof Pick<CoachState, 'audience' | 'goal' | 'usage' | 'stage'>, value: string) => {
    setState((previous) => ({ ...previous, [field]: value }))
  }

  const togglePrinciple = (id: PrincipleId) => {
    setState((previous) => ({
      ...previous,
      expanded: previous.expanded.includes(id)
        ? previous.expanded.filter((item) => item !== id)
        : [...previous.expanded, id],
    }))
  }

  const expandAll = () => {
    setState((previous) => ({ ...previous, expanded: relevantPrinciples.map((principle) => principle.id) }))
  }

  const collapseAll = () => {
    setState((previous) => ({ ...previous, expanded: [] }))
  }

  const handleReviewGenerate = () => {
    const generated = analyzeWork(state.taskId, state.reviewText, state.reviewPrompt)
    setReviewResult(generated)
    setCurrentStep(4)
  }

  const handleCopy = async () => {
    try {
      const value = reviewResult?.improvedPrompt ?? promptText
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="app-shell">
      <div className="page-wrap">
        <header className="panel-surface">
          <div className="topbar">
            <div>
              <p className="eyebrow">Design Coach for Non-Designers</p>
              <h1>Design guidance that fits the task, not the tech stack.</h1>
            </div>
            <div className="header-badge">
              <Sparkles className="header-icon" aria-hidden="true" />
              Friendly, practical, and grounded in UX/UI principles.
            </div>
          </div>

          <nav className="step-nav" aria-label="Progress">
            {stepLabels.map((label, index) => {
              const active = currentStep === index
              const done = currentStep > index
              return (
                <div key={label} className="step-item">
                  <button
                    type="button"
                    className={`step-button ${active ? 'active' : ''} ${done ? 'done' : ''}`}
                    onClick={() => setCurrentStep(index)}
                    aria-current={active ? 'step' : undefined}
                  >
                    <span>{index + 1}</span>
                    {label}
                  </button>
                  {index < stepLabels.length - 1 && <ChevronRight className="step-separator" aria-hidden="true" />}
                </div>
              )
            })}
          </nav>
        </header>

        <main className="content" aria-live="polite">
          {currentStep === 0 && (
            <section className="screen-wrapper">
              <div className="section-header">
                <div>
                  <p className="eyebrow muted">Step 1</p>
                  <h2>Choose what you are creating</h2>
                </div>
                <p className="helper-text">Select the deliverable you are creating so the coach gives the right guidance for your context.</p>
              </div>

              <div className="task-grid">
                {tasks.map((task) => {
                  const Icon = taskIconMap[task.id]
                  const isSelected = selectedTask.id === task.id

                  return (
                    <button
                      key={task.id}
                      type="button"
                      className={`task-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelectTask(task.id)}
                    >
                      <div className="task-card-top">
                        <span className="task-icon-wrap">
                          <Icon className="task-icon" aria-hidden="true" />
                        </span>
                        {isSelected && <CheckCircle2 className="checkmark" aria-hidden="true" />}
                      </div>
                      <h3>{task.name}</h3>
                      <p>{task.description}</p>
                    </button>
                  )
                })}
              </div>

              <div className="button-row justify-end">
                <button type="button" className="primary-button" onClick={() => setCurrentStep(1)}>
                  Continue
                  <ArrowRight className="button-icon" aria-hidden="true" />
                </button>
              </div>
            </section>
          )}

          {currentStep === 1 && (
            <section className="screen-wrapper">
              <div className="section-header block">
                <p className="eyebrow muted">Step 2</p>
                <h2>Understand the design goal</h2>
              </div>

              <div className="question-grid">
                <label className="field-group">
                  <span>Who is the intended audience?</span>
                  <textarea value={state.audience} onChange={(event) => updateField('audience', event.target.value)} placeholder="Example: New employees in a regional office." />
                </label>

                <label className="field-group">
                  <span>What should they understand, feel, or accomplish?</span>
                  <textarea value={state.goal} onChange={(event) => updateField('goal', event.target.value)} placeholder="Example: Find onboarding resources and support contacts without confusion." />
                </label>

                <label className="field-group">
                  <span>Where and how will they use this?</span>
                  <textarea value={state.usage} onChange={(event) => updateField('usage', event.target.value)} placeholder="Example: On desktop at work and on mobile while traveling." />
                </label>

                <label className="field-group">
                  <span>Are you starting something new or reviewing existing work?</span>
                  <select value={state.stage} onChange={(event) => updateField('stage', event.target.value)}>
                    <option value="starting fresh">Starting something new</option>
                    <option value="reviewing existing work">Reviewing existing work</option>
                    <option value="improving an existing concept">Improving an existing concept</option>
                    <option value="reworking for accessibility">Reworking for accessibility</option>
                  </select>
                </label>
              </div>

              <div className="button-row">
                <button type="button" className="secondary-button" onClick={() => setCurrentStep(0)}>
                  <ArrowLeft className="button-icon" aria-hidden="true" />
                  Previous
                </button>
                <button type="button" className="primary-button" onClick={() => setCurrentStep(2)}>
                  View design principles
                  <ArrowRight className="button-icon" aria-hidden="true" />
                </button>
              </div>
            </section>
          )}

          {currentStep === 2 && (
            <section className="screen-wrapper">
              <div className="section-header">
                <div>
                  <p className="eyebrow muted">Step 3</p>
                  <h2>Design principles for this task</h2>
                </div>
                <div className="inline-actions">
                  <button type="button" className="secondary-button small" onClick={expandAll}>Open all principles</button>
                  <button type="button" className="secondary-button small" onClick={collapseAll}>Close all principles</button>
                </div>
              </div>

              <div className="summary-banner">
                <Target className="banner-icon" aria-hidden="true" />
                <p>
                  <strong>{selectedTask.name}</strong> for <strong>{state.audience}</strong> who need to <strong>{state.goal}</strong>.
                </p>
              </div>

              <div className="checklist-stack">
                {checklistSections.map((section) => (
                  <div key={section.id} className="section-card">
                    <div className="section-card-head">
                      <div>
                        <p className="eyebrow muted">{section.title}</p>
                        <h3>{section.description}</h3>
                      </div>
                    </div>

                    {section.principles.length === 0 ? (
                      <p className="empty-state">No principle shortcuts recommended for this task.</p>
                    ) : (
                      <div className="checklist-items">
                        {section.principles.map((principle) => {
                          const isOpen = state.expanded.includes(principle.id)

                          return (
                            <div key={principle.id} className="principle-card">
                              <button type="button" className="principle-toggle" onClick={() => togglePrinciple(principle.id)} aria-expanded={isOpen} aria-controls={`principle-${principle.id}`}>
                                <span className="principle-title-wrap">
                                  <span className="principle-icon-wrap">
                                    {principle.id === 'accessibility' ? <ShieldCheck className="small-icon" aria-hidden="true" /> : <BookOpen className="small-icon" aria-hidden="true" />}
                                  </span>
                                  <span className="principle-name">{principle.name}</span>
                                </span>
                                <span className="principle-action">
                                  {isOpen ? 'Close principle' : 'Open principle'}
                                  {isOpen ? <ChevronDown className="small-icon" aria-hidden="true" /> : <ChevronRight className="small-icon" aria-hidden="true" />}
                                </span>
                              </button>

                              {isOpen && (
                                <div id={`principle-${principle.id}`} className="principle-detail">
                                  <div>
                                    <p className="detail-label">The one rule</p>
                                    <p className="one-rule">{principle.doThis}</p>
                                  </div>
                                  <div className="video-placeholder" aria-label={`Video placeholder for ${principle.name}`}>
                                    <div className="video-placeholder-icon">▶</div>
                                    <div>
                                      <p className="detail-label">Video</p>
                                      <p>Video placeholder for {principle.name}. Add the short explainer when the source video is available.</p>
                                    </div>
                                  </div>
                                  <div>
                                    <p className="detail-label">Key principles and examples</p>
                                    <div className="principle-examples">
                                      <p><strong>Why it matters:</strong> {principle.why}</p>
                                      <p><strong>Example:</strong> {principle.example}</p>
                                      <p><strong>Common mistake:</strong> {principle.mistake}</p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="button-row">
                <button type="button" className="secondary-button" onClick={() => setCurrentStep(1)}>
                  <ArrowLeft className="button-icon" aria-hidden="true" />
                  Previous
                </button>
                <button type="button" className="primary-button" onClick={() => setCurrentStep(3)}>
                  Review existing work
                  <ArrowRight className="button-icon" aria-hidden="true" />
                </button>
              </div>
            </section>
          )}

          {currentStep === 3 && (
            <section className="screen-wrapper">
              <div className="section-header block">
                <p className="eyebrow muted">Step 4</p>
                <h2>Review existing work</h2>
              </div>

              <div className="review-grid">
                <div className="section-card inset">
                  <div className="upload-header">
                    <span className="task-icon-wrap blue">
                      <Upload className="task-icon" aria-hidden="true" />
                    </span>
                    <div>
                      <h3>Upload or paste your work</h3>
                      <p>For the MVP, this is a guided review flow with realistic sample feedback.</p>
                    </div>
                  </div>

                  <div className="upload-stack">
                    <button type="button" className="upload-button" onClick={() => fileInputRef.current?.click()}>
                      <FileImage className="button-icon" aria-hidden="true" />
                      Upload PNG, JPG, or PDF
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".png,.jpg,.jpeg,.pdf"
                      className="hidden-input"
                      onChange={(event) => setState((previous) => ({ ...previous, fileName: event.target.files?.[0]?.name ?? '' }))}
                    />
                    {state.fileName && <p className="file-name">Selected file: {state.fileName}</p>}

                    <label className="field-group compact">
                      <span>Paste text</span>
                      <textarea value={state.reviewText} onChange={(event) => setState((previous) => ({ ...previous, reviewText: event.target.value }))} placeholder="Paste the copy, instructions, or notes you want reviewed." />
                    </label>

                    <label className="field-group compact">
                      <span>Paste an AI-generation prompt</span>
                      <textarea value={state.reviewPrompt} onChange={(event) => setState((previous) => ({ ...previous, reviewPrompt: event.target.value }))} placeholder="Paste the prompt you used to generate the design or visual." />
                    </label>
                  </div>
                </div>

                <div className="section-card inset">
                  <h3>What the review can check</h3>
                  <ul className="checklist-list">
                    <li><CheckCircle2 className="list-icon" aria-hidden="true" /> Readability, hierarchy, and layout consistency.</li>
                    <li><CheckCircle2 className="list-icon" aria-hidden="true" /> Accessibility issues and missing states.</li>
                    <li><CheckCircle2 className="list-icon" aria-hidden="true" /> Research questions that need real user validation.</li>
                    <li><CheckCircle2 className="list-icon" aria-hidden="true" /> A revised prompt that incorporates the right design principles.</li>
                  </ul>

                  <div className="note-box">
                    AI can help identify potential issues and generate hypotheses. Only research with representative users can validate whether a design meets their needs.
                  </div>
                </div>
              </div>

              <div className="button-row">
                <button type="button" className="secondary-button" onClick={() => setCurrentStep(2)}>
                  <ArrowLeft className="button-icon" aria-hidden="true" />
                  Previous
                </button>
                <div className="inline-actions">
                  <button type="button" className="secondary-button" onClick={handleReviewGenerate}>Continue without uploading</button>
                  <button type="button" className="primary-button" onClick={handleReviewGenerate}>
                    Analyze work
                    <ArrowRight className="button-icon" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </section>
          )}

          {currentStep === 4 && reviewResult && (
            <section className="screen-wrapper">
              <div className="section-header block">
                <p className="eyebrow muted">Step 5</p>
                <h2>Review results</h2>
              </div>

              <div className="results-stack">
                <div className="section-card">
                  <h3>What is working</h3>
                  <ul className="checklist-list spacious">
                    {reviewResult.whatIsWorking.map((item) => (
                      <li key={item}><CheckCircle2 className="list-icon" aria-hidden="true" /> {item}</li>
                    ))}
                  </ul>
                </div>

                <div className="section-card">
                  <h3>Improve these first</h3>
                  <div className="recommendation-list">
                    {reviewResult.improveTheseFirst.map((item, index) => {
                      const principle = principleMap.get(item.principle)
                      return (
                        <div key={`${item.title}-${index}`} className="recommendation-item">
                          <div className="recommendation-head">
                            <h4>{item.title}</h4>
                            <span className={`priority-chip priority-${item.priority.toLowerCase()}`}>{item.priority}</span>
                          </div>
                          <p><strong>Observed:</strong> {item.observed}</p>
                          <p><strong>Principle:</strong> {principle?.name ?? item.principle}</p>
                          <p><strong>Why it matters:</strong> {item.why}</p>
                          <p><strong>Specific recommended change:</strong> {item.action}</p>
                          <p><strong>Type:</strong> {item.type}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="section-card">
                  <h3>Additional checks</h3>
                  <div className="additional-checks">
                    {reviewResult.additionalChecks.map((item, index) => (
                      <details key={`${item.title}-${index}`} className="details-box">
                        <summary>{item.title}</summary>
                        <div className="details-body">
                          <p><strong>Observed:</strong> {item.observed}</p>
                          <p><strong>Principle involved:</strong> {principleMap.get(item.principle)?.name ?? item.principle}</p>
                          <p><strong>Why it matters:</strong> {item.why}</p>
                          <p><strong>Recommended change:</strong> {item.action}</p>
                        </div>
                      </details>
                    ))}
                  </div>
                </div>

                <div className="section-card">
                  <h3>Validate with real users</h3>
                  <div className="research-list">
                    {reviewResult.validateWithUsers.map((item, index) => (
                      <div key={`${item.assumption}-${index}`} className="research-item">
                        <p><strong>Assumption:</strong> {item.assumption}</p>
                        <p><strong>Suggested test:</strong> {item.test}</p>
                        <p><strong>Success signal:</strong> {item.signal}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="button-row">
                <button type="button" className="secondary-button" onClick={() => setCurrentStep(3)}>
                  <ArrowLeft className="button-icon" aria-hidden="true" />
                  Previous
                </button>
                <button type="button" className="primary-button" onClick={() => setCurrentStep(5)}>
                  Improved prompt
                  <ArrowRight className="button-icon" aria-hidden="true" />
                </button>
              </div>
            </section>
          )}

          {currentStep === 5 && (
            <section className="screen-wrapper">
              <div className="section-header block">
                <p className="eyebrow muted">Step 6</p>
                <h2>Improved prompt</h2>
              </div>

              <div className="section-card prompt-card">
                <div className="prompt-topbar">
                  <div className="prompt-label">
                    <Wand2 className="header-icon" aria-hidden="true" />
                    <span>Prompt tuned for {selectedTask.name}</span>
                  </div>
                  <button type="button" className="secondary-button small" onClick={handleCopy}>
                    <Copy className="button-icon" aria-hidden="true" />
                    {copied ? 'Copied' : 'Copy prompt'}
                  </button>
                </div>

                <textarea readOnly value={reviewResult?.improvedPrompt ?? promptText} aria-label="Improved prompt for the selected design task" />
              </div>

              <div className="button-row">
                <button type="button" className="secondary-button" onClick={() => setCurrentStep(4)}>
                  <ArrowLeft className="button-icon" aria-hidden="true" />
                  Previous
                </button>
                <button type="button" className="primary-button" onClick={() => setCurrentStep(0)}>
                  Start over
                </button>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
