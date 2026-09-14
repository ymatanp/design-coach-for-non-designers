export type TaskId =
  | 'presentation'
  | 'ai-image'
  | 'sharepoint'
  | 'figma-make'
  | 'document'
  | 'figma-design'

export type PrincipleId =
  | 'layout-grids'
  | 'visual-hierarchy'
  | 'spacing-whitespace'
  | 'typography'
  | 'color'
  | 'interaction-design'
  | 'accessibility'
  | 'ux-thinking'
  | 'ux-research'

export type ReviewType = 'Design principle check' | 'Accessibility check' | 'Validate with users'

export type Task = {
  id: TaskId
  name: string
  description: string
  icon: string
}

export type Principle = {
  id: PrincipleId
  name: string
  why: string
  doThis: string
  example: string
  mistake: string
  category: 'start' | 'during' | 'before' | 'validate'
}

export type Recommendation = {
  title: string
  observed: string
  principle: PrincipleId
  why: string
  action: string
  priority: 'High' | 'Medium' | 'Low'
  type: ReviewType
}

export type ReviewResult = {
  whatIsWorking: string[]
  improveTheseFirst: Recommendation[]
  additionalChecks: Recommendation[]
  validateWithUsers: { assumption: string; test: string; signal: string }[]
  improvedPrompt: string
}

export type CoachState = {
  taskId: TaskId
  audience: string
  goal: string
  usage: string
  stage: string
  expanded: PrincipleId[]
  reviewText: string
  reviewPrompt: string
  fileName: string
}

export const tasks: Task[] = [
  {
    id: 'presentation',
    name: 'Presentation',
    description: 'Pitch decks and slide storytelling for meetings, updates, and training.',
    icon: 'presentation',
  },
  {
    id: 'ai-image',
    name: 'AI-generated image',
    description: 'Visuals that explain a concept, tell a story, or support a communication goal.',
    icon: 'image',
  },
  {
    id: 'sharepoint',
    name: 'SharePoint page or site',
    description: 'Internal landing pages, portals, and content hubs people need to navigate quickly.',
    icon: 'layout',
  },
  {
    id: 'figma-make',
    name: 'Figma Make product',
    description: 'Prototype experiences or app flows generated in a product-building workflow.',
    icon: 'figma',
  },
  {
    id: 'document',
    name: 'Document or job aid',
    description: 'Quick-reference guides, instructions, and task-focused documents for users to act on.',
    icon: 'document',
  },
  {
    id: 'figma-design',
    name: 'Figma product design',
    description: 'Product interfaces and interactions designed for clarity, flow, and usability.',
    icon: 'design',
  },
]

export const principles: Principle[] = [
  {
    id: 'layout-grids',
    name: 'Layout and grids',
    why: 'A consistent grid keeps content aligned and easier to scan, especially on busy pages and slides.',
    doThis: 'Align headings, body text, buttons, and imagery to a shared grid and keep spacing consistent across the page.',
    example: 'A SharePoint landing page uses a three-column grid for headlines, tasks, and supporting evidence so the page feels intentional.',
    mistake: 'Mixing floating cards, uneven margins, and random text blocks makes the page feel cluttered and less trustworthy.',
    category: 'start',
  },
  {
    id: 'visual-hierarchy',
    name: 'Visual hierarchy',
    why: 'People process information in order of visual weight, so one clear focus helps them know what matters most.',
    doThis: 'Choose a single primary message or action and make it visually strongest before you add supporting details.',
    example: 'A product mock-up uses a large headline, a bold primary CTA, and fewer supporting elements so the main action is obvious in one glance.',
    mistake: 'Giving every section equal emphasis makes it hard to tell what needs attention first.',
    category: 'start',
  },
  {
    id: 'spacing-whitespace',
    name: 'Spacing and whitespace',
    why: 'Generous white space helps content breathe and makes actions and information easier to consume.',
    doThis: 'Add space before adding more lines, boxes, or decorative elements; group related items closely and separate sections clearly.',
    example: 'In a job aid, the numbered steps sit in their own rhythm with clear gaps between the instructions and the screenshots.',
    mistake: 'Packing text and images together can make even simple instructions feel overwhelming.',
    category: 'during',
  },
  {
    id: 'typography',
    name: 'Typography',
    why: 'A concise, consistent type system makes content readable and more credible.',
    doThis: 'Limit your fonts and sizes to a small set and use them consistently for headings, labels, and body copy.',
    example: 'A presentation uses one sans-serif font for all headings and a second readable size scale for supporting detail.',
    mistake: 'Combining too many font weights and sizes creates visual noise and reduces trust.',
    category: 'during',
  },
  {
    id: 'color',
    name: 'Color',
    why: 'Color adds meaning, but it should never be the only way to communicate information.',
    doThis: 'Use color to signal state, emphasis, and relationships, while pairing it with shape, text, or icon cues.',
    example: 'A dashboard uses blue for primary actions and a warning icon alongside red text to signal risk.',
    mistake: 'Using red, green, or blue alone without labels creates confusion for people with color-vision differences.',
    category: 'before',
  },
  {
    id: 'interaction-design',
    name: 'Interaction design',
    why: 'Users need visible feedback so they know that an action was accepted, failed, or is still in progress.',
    doThis: 'Provide obvious states for hover, focus, selection, loading, success, and error conditions.',
    example: 'A SharePoint button changes color and shows a loading indicator before the action completes.',
    mistake: 'Silent state changes can make a user suspect the system did nothing.',
    category: 'during',
  },
  {
    id: 'accessibility',
    name: 'Accessibility',
    why: 'Accessibility is part of good design, not an extra pass at the end.',
    doThis: 'Check contrast, labels, keyboard flow, and focus states throughout the design, not just before launch.',
    example: 'A slide uses strong contrast, proper headings, and descriptive alt text for any key chart or diagram.',
    mistake: 'Relying only on color or missing keyboard focus can block people from reading or acting on the content.',
    category: 'before',
  },
  {
    id: 'ux-thinking',
    name: 'UX thinking',
    why: 'The design should serve the user’s goal rather than the feature list or internal preferences.',
    doThis: 'Start with the task, audience, and desired outcome, then shape the design around that need.',
    example: 'Before creating a document, decide whether the user needs to find a process quickly or complete a task in one session.',
    mistake: 'Designing around internal preferences or tool capabilities without user needs leads to confusing experiences.',
    category: 'start',
  },
  {
    id: 'ux-research',
    name: 'UX research',
    why: 'A design becomes stronger when assumptions are tested with real people early and often.',
    doThis: 'Check your assumptions with representative users and refine the design based on what they actually do.',
    example: 'Ask new employees where they would look for payroll support on a SharePoint page and revise the labels accordingly.',
    mistake: 'Assuming labels, layouts, and flows make sense without testing them leaves gaps in the experience.',
    category: 'validate',
  },
]

export const taskPrincipleMap: Record<TaskId, PrincipleId[]> = {
  presentation: ['visual-hierarchy', 'layout-grids', 'typography', 'spacing-whitespace', 'color', 'accessibility', 'ux-thinking'],
  'ai-image': ['ux-thinking', 'visual-hierarchy', 'layout-grids', 'color', 'accessibility', 'ux-research'],
  sharepoint: ['ux-thinking', 'visual-hierarchy', 'layout-grids', 'spacing-whitespace', 'typography', 'color', 'interaction-design', 'accessibility', 'ux-research'],
  'figma-make': ['ux-thinking', 'visual-hierarchy', 'layout-grids', 'interaction-design', 'color', 'accessibility', 'ux-research'],
  document: ['ux-thinking', 'visual-hierarchy', 'layout-grids', 'spacing-whitespace', 'typography', 'color', 'accessibility', 'ux-research'],
  'figma-design': ['ux-thinking', 'visual-hierarchy', 'layout-grids', 'interaction-design', 'accessibility', 'color', 'ux-research'],
}

export const sectionConfig = [
  { id: 'start', title: 'Start here', description: 'The three most important decisions' },
  { id: 'during', title: 'While creating', description: 'A practical checklist' },
  { id: 'before', title: 'Before sharing', description: 'Final checks' },
  { id: 'validate', title: 'Validate with users', description: 'Assumptions that need research' },
] as const

export const principleMap = new Map(principles.map((principle) => [principle.id, principle]))

export const defaultCoachState: CoachState = {
  taskId: 'sharepoint',
  audience: 'New employees joining the organization',
  goal: 'Help them find onboarding resources and key contacts quickly without confusion.',
  usage: 'On desktop at work and occasionally on a mobile device while they are traveling.',
  stage: 'reviewing existing work',
  expanded: [],
  reviewText: '',
  reviewPrompt: '',
  fileName: '',
}

export const findTaskById = (id: TaskId) => tasks.find((task) => task.id === id) ?? tasks[0]

export const getRelevantPrinciples = (taskId: TaskId) => {
  return taskPrincipleMap[taskId].map((id) => principleMap.get(id)!).filter(Boolean)
}

export const getPriorityPrinciples = (taskId: TaskId) => {
  const selected = getRelevantPrinciples(taskId)
  return selected.slice(0, 3)
}

export const getChecklistSections = (taskId: TaskId) => {
  const relevantPrinciples = getRelevantPrinciples(taskId)

  return sectionConfig.map((section) => ({
    ...section,
    principles: relevantPrinciples.filter((principle) => principle.category === section.id),
  }))
}

export const buildPromptForTask = (taskId: TaskId) => {
  const task = findTaskById(taskId)
  const topPrinciples = getPriorityPrinciples(taskId)
  const names = topPrinciples.map((principle) => principle.name).join(', ')

  return `Create a ${task.name.toLowerCase()} for ${task.name === 'AI-generated image' ? 'a clear communication purpose' : 'a specific user goal'}. Prioritize ${names}. Keep the experience grounded in user intent, use a clear hierarchy, and avoid clutter. Make the design readable, accessible, and easy to act on without extra explanation.`
}

export const reviewLibrary: Record<TaskId, ReviewResult> = {
  presentation: {
    whatIsWorking: ['The story arc is easy to follow from problem to recommendation.', 'The key callout text is strong and easy to scan.', 'The summary slide reinforces the message without adding clutter.'],
    improveTheseFirst: [
      {
        title: 'Improve slide consistency',
        observed: 'Several slides use different alignment patterns for titles and content.',
        principle: 'layout-grids',
        why: 'A consistent rhythm reduces visual noise and helps the audience follow the narrative.',
        action: 'Align each slide to a shared title-body grid and reuse one layout pattern for supporting comparison charts.',
        priority: 'High',
        type: 'Design principle check',
      },
      {
        title: 'Tighten the headline focus',
        observed: 'Two slides mix a primary message with secondary announcements in the same visual zone.',
        principle: 'visual-hierarchy',
        why: 'When every item competes for attention, the audience loses the main takeaway.',
        action: 'Choose one message per slide and create a single dominant headline plus two supporting points only.',
        priority: 'High',
        type: 'Design principle check',
      },
      {
        title: 'Increase readability for visible content',
        observed: 'Some body text sits below the recommended minimum size for a presentation viewed from the back of the room.',
        principle: 'typography',
        why: 'Readability decides whether the audience can absorb the content without strain.',
        action: 'Increase the body text size to at least 24-28px, reduce line length, and trim dense bullet blocks.',
        priority: 'Medium',
        type: 'Accessibility check',
      },
    ],
    additionalChecks: [
      {
        title: 'Check contrast on chart labels',
        observed: 'The chart labels are using a very light gray on a white background in one segment.',
        principle: 'color',
        why: 'Low contrast makes data harder to interpret, especially in mixed lighting.',
        action: 'Increase contrast for chart labels and add pattern or text emphasis in addition to color.',
        priority: 'Low',
        type: 'Accessibility check',
      },
    ],
    validateWithUsers: [
      {
        assumption: 'Executives will understand the chart labels without a verbal walk-through.',
        test: 'Show the final slide to three decision-makers and ask them to state the main takeaway in one sentence without narration.',
        signal: 'Participants describe the same message without prompting.',
      },
    ],
    improvedPrompt: 'Create a polished executive presentation for new employees joining the organization. Use a single clear message on each slide, a consistent title-body grid, and concise bullet points with generous spacing. Keep body text large and readable from the back of a room, use a restrained palette with strong contrast, and include one clear call to action per slide. The audience is employees who need quick onboarding guidance; make the story feel supportive and organized, not dense or technical.',
  },
  'ai-image': {
    whatIsWorking: ['The composition has a clear focal area and good use of negative space.', 'The color palette supports the topic without overwhelming the subject.', 'The image would work well with supporting text or a caption.'],
    improveTheseFirst: [
      {
        title: 'Clarify the communication purpose',
        observed: 'The image may be visually appealing but does not clearly communicate the intended takeaway without context.',
        principle: 'ux-thinking',
        why: 'An image needs a clear purpose so the audience knows what to notice and retain.',
        action: 'Redesign the image around a single message, such as “new employee onboarding overview” or “remote support and help desk.”',
        priority: 'High',
        type: 'Design principle check',
      },
      {
        title: 'Strengthen focal emphasis',
        observed: 'The subject elements compete with background graphics and extra objects.',
        principle: 'visual-hierarchy',
        why: 'A stronger focal point helps the audience interpret the content quickly.',
        action: 'Reduce background clutter, keep the main subject centered, and leave clear room beside it for descriptive captions or labels.',
        priority: 'High',
        type: 'Design principle check',
      },
      {
        title: 'Review fairness and inclusivity',
        observed: 'The scene includes a few visual stereotypes and lacks representation of different roles or backgrounds.',
        principle: 'accessibility',
        why: 'Inclusive imagery builds trust and reflects the real audience more accurately.',
        action: 'Replace stylized or stereotyped elements with more diverse and representative imagery and avoid text that requires assumptions about culture or context.',
        priority: 'Medium',
        type: 'Accessibility check',
      },
    ],
    additionalChecks: [
      {
        title: 'Keep alt-text thinking in the loop',
        observed: 'There is no obvious plan for a descriptive alt-text or caption to accompany the image.',
        principle: 'accessibility',
        why: 'Description matters when the image communicates instructions, facts, or details that are not visible elsewhere.',
        action: 'Add a concise alternative description that names the scene, purpose, and key action if the image will be used in a public or instructional context.',
        priority: 'Low',
        type: 'Accessibility check',
      },
    ],
    validateWithUsers: [
      {
        assumption: 'The visual will communicate the same intent across different audiences.',
        test: 'Ask five users to describe the image in a single sentence and compare whether they infer the same message.',
        signal: 'Participants describe the key message with similar words and no major misread.',
      },
    ],
    improvedPrompt: 'Create a welcoming and inclusive onboarding illustration for new employees. Show a diverse group of employees in a modern office or remote-work setting, with one clear subject or focal point and plenty of negative space for descriptive text. Avoid stereotypes, stay brand-safe, and choose a neutral, polished palette with high readability for supporting copy. The image should communicate that help and resources are easy to find, not busy or overly decorative.',
  },
  sharepoint: {
    whatIsWorking: ['The page has a clear purpose and the headline quickly explains the topic.', 'The content blocks are grouped logically and feel familiar to internal users.', 'There is a strong opportunity to build trust with concise support links and clearer actions.'],
    improveTheseFirst: [
      {
        title: 'Give the page one primary action',
        observed: 'Several links compete for attention at the top of the page and the most important task is not visually dominant.',
        principle: 'visual-hierarchy',
        why: 'Users need one obvious next step to know where to begin.',
        action: 'Promote a single “Start onboarding” or “Find support” action above the fold and reduce competing calls to action.',
        priority: 'High',
        type: 'Design principle check',
      },
      {
        title: 'Strengthen the information architecture',
        observed: 'The page contains several content cards but the grouping does not yet match the employee journey.',
        principle: 'layout-grids',
        why: 'A user should be able to scan the page and find the most relevant information by groups, not by guesswork.',
        action: 'Organize by employee need: get started, find tools, and get help, and align each grouping to a consistent card layout.',
        priority: 'High',
        type: 'Design principle check',
      },
      {
        title: 'Improve navigation clarity',
        observed: 'The links and section labels may be too vague for new employees who are unfamiliar with internal language.',
        principle: 'ux-thinking',
        why: 'Labels should reflect user goals, not internal team terminology.',
        action: 'Rename ambiguous items such as “My Services” or “Resources” to clearer labels like “Payroll support” or “Onboarding checklist.”',
        priority: 'High',
        type: 'Validate with users',
      },
    ],
    additionalChecks: [
      {
        title: 'Review contrast and keyboard focus',
        observed: 'A few secondary buttons and links may not meet contrast expectations for accessibility scanning.',
        principle: 'accessibility',
        why: 'Low-contrast links and focus states can be hard to recognize for many users.',
        action: 'Increase contrast on secondary links and verify visible keyboard focus on all interactive elements.',
        priority: 'Medium',
        type: 'Accessibility check',
      },
      {
        title: 'Check mobile behavior',
        observed: 'The card layout may compress vertically on smaller screens and hide some actions.',
        principle: 'interaction-design',
        why: 'Critical actions must remain visible without clicking through multiple layers on mobile.',
        action: 'Test the page at narrow widths and stack the most important cards first before interior links.',
        priority: 'Low',
        type: 'Design principle check',
      },
    ],
    validateWithUsers: [
      {
        assumption: 'Employees will understand the label “My Services.”',
        test: 'Ask five representative employees where they would go to find payroll support or onboarding resources.',
        signal: 'Participants find the correct destination without assistance or confusion.',
      },
      {
        assumption: 'The top navigation matches how employees think about support.',
        test: 'Ask employees to complete three quick tasks: find their first-day checklist, locate HR support, and locate an office map.',
        signal: 'Users can complete each task in under 30 seconds without backtracking.',
      },
    ],
    improvedPrompt: 'Design a welcoming SharePoint onboarding page for new employees. Use a clear purpose, prominent main action, scannable headings, and consistent cards for onboarding tasks, support contacts, and key resources. Keep the layout simple and approachable, use strong hierarchy, high-contrast links, and a mobile-friendly structure. The page should help employees find answers quickly without jargon or unclear labels.',
  },
  'figma-make': {
    whatIsWorking: ['The concept is grounded in a clear user need and the flow is easy to understand.', 'The idea has a compelling primary interaction path.', 'The generated experience uses a familiar shape for most users.'],
    improveTheseFirst: [
      {
        title: 'Define the primary task and success path',
        observed: 'The experience has several possible actions, but the key user flow is not yet distinctly guided.',
        principle: 'ux-thinking',
        why: 'Users need a clear task path instead of multiple ambiguous options.',
        action: 'Clarify the central user goal and reduce supporting actions until the main path is obvious.',
        priority: 'High',
        type: 'Design principle check',
      },
      {
        title: 'Add state handling without guesswork',
        observed: 'Empty, error, loading, and success states are not yet designed in a way users can easily interpret.',
        principle: 'interaction-design',
        why: 'Users need to understand what is happening, what failed, and what to do next.',
        action: 'Build specific states for missing information, loading progress, validation errors, and successful completion messages.',
        priority: 'High',
        type: 'Design principle check',
      },
      {
        title: 'Check accessibility in generated actions',
        observed: 'Buttons and feedback states may rely too heavily on color and motion cues to communicate status.',
        principle: 'accessibility',
        why: 'Users with vision differences or cognitive overload need text and structure as well as color.',
        action: 'Ensure each action has a clear label and visible focus state, and add text or icons that explain status changes.',
        priority: 'Medium',
        type: 'Accessibility check',
      },
    ],
    additionalChecks: [
      {
        title: 'Review responsive inputs',
        observed: 'The layout may work well on desktop but compress critical flows on smaller screens.',
        principle: 'layout-grids',
        why: 'Responsive behavior determines whether the experience remains usable across devices.',
        action: 'Continue testing how forms, actions, and content stack on tablet and mobile widths.',
        priority: 'Low',
        type: 'Design principle check',
      },
    ],
    validateWithUsers: [
      {
        assumption: 'The generated experience honors the intended workflow without extra training.',
        test: 'Ask a few representative users to complete the main task and note where they hesitate or choose a different path.',
        signal: 'Users can complete the task in the expected flow with minimal confusion.',
      },
    ],
    improvedPrompt: 'Create a clean, user-focused product experience for employees to quickly complete an onboarding task. Prioritize one key workflow, use clear labels and visible states for every action, keep the layout responsive, and include accessible contrast, visible focus states, and distinct empty, loading, error, and success states. Make the experience feel confident and calm, with a clear path from goal to completion.',
  },
  document: {
    whatIsWorking: ['The document has a clear subject and a helpful structure for readers who need quick steps.', 'The task sequence flows naturally from beginning to end.', 'The content uses familiar language and supports practical action.'],
    improveTheseFirst: [
      {
        title: 'Improve scannability',
        observed: 'The page currently reads as a long block of instructions rather than clearly separated tasks.',
        principle: 'visual-hierarchy',
        why: 'Users need to find the task they are doing without reading everything first.',
        action: 'Add section headings, step labels, and brief callouts so the user knows which task is next.',
        priority: 'High',
        type: 'Design principle check',
      },
      {
        title: 'Tighten the layout rhythm',
        observed: 'Instruction text sits too close to screenshots in some sections, making it harder to pair the guidance with the correct step.',
        principle: 'spacing-whitespace',
        why: 'Readers need breathing room to match instructions with visual evidence.',
        action: 'Place screenshots adjacent to their relevant steps with clear spacing and keep each step focused on one action only.',
        priority: 'High',
        type: 'Design principle check',
      },
      {
        title: 'Strengthen accessibility in the PDF structure',
        observed: 'Some headings and reading order may not be obvious in a document designed for print or export.',
        principle: 'accessibility',
        why: 'Accessible document structure helps screen readers and makes the page more usable for everyone.',
        action: 'Use clear headings, logical reading order, and meaningful alt text or captions for screenshots before exporting to PDF.',
        priority: 'Medium',
        type: 'Accessibility check',
      },
    ],
    additionalChecks: [
      {
        title: 'Check terminology consistency',
        observed: 'The same action is named slightly differently in multiple places.',
        principle: 'typography',
        why: 'Consistent naming reduces confusion when someone is trying to complete the task quickly.',
        action: 'Use one term for each action throughout the guide and match it to the interface labels.',
        priority: 'Low',
        type: 'Design principle check',
      },
    ],
    validateWithUsers: [
      {
        assumption: 'Users can complete the task correctly without extra verbal support.',
        test: 'Ask a new employee to follow the instructions without prompting and note where they hesitate or get lost.',
        signal: 'Participants finish the task with minimal confusion and no missed steps.',
      },
    ],
    improvedPrompt: 'Create a clear job aid for new employees who need to complete an onboarding task quickly. Use a descriptive title, scannable sections, numbered steps, one action per step, and screenshots placed directly beside the relevant instructions. Keep the language plain and consistent, use accessible structure and contrast, and make the process easy to follow without extra explanation or jargon.',
  },
  'figma-design': {
    whatIsWorking: ['The core user need is clearly defined and the initial flow has strong direction.', 'The visual hierarchy is clear enough to guide attention across the main screens.', 'The design uses repeated patterns that help establish consistency.'],
    improveTheseFirst: [
      {
        title: 'Define the success path more clearly',
        observed: 'The interface includes several candidate actions, but the most important workflow is not yet strongly differentiated.',
        principle: 'ux-thinking',
        why: 'A design should support the user journey before it supports every possible feature.',
        action: 'Define the main user flow first and trim extraneous elements until the expected path stands out.',
        priority: 'High',
        type: 'Design principle check',
      },
      {
        title: 'Align patterns and states',
        observed: 'The design uses a few component styles inconsistently across screens and states.',
        principle: 'layout-grids',
        why: 'Consistency builds confidence and reduces the need for users to relearn interface behavior.',
        action: 'Standardize components, spacing, and interactive states across the full flow and align them to a shared grid.',
        priority: 'High',
        type: 'Design principle check',
      },
      {
        title: 'Check interaction feedback and accessibility',
        observed: 'Some interactive states may not communicate their status clearly enough without relying on color alone.',
        principle: 'interaction-design',
        why: 'Feedback is crucial when users act, get errors, or commit to a task.',
        action: 'Add visible hover, focus, disabled, success, and error states with visible labels and state text so the intent is clear.',
        priority: 'High',
        type: 'Accessibility check',
      },
    ],
    additionalChecks: [
      {
        title: 'Review responsive layouts',
        observed: 'A few cards and controls may become cramped on narrower screens.',
        principle: 'accessibility',
        why: 'Responsive design keeps critical flows usable across desktops, tablets, and phones.',
        action: 'Test important flows at multiple widths and preserve clear spacing when content stacks.',
        priority: 'Medium',
        type: 'Accessibility check',
      },
    ],
    validateWithUsers: [
      {
        assumption: 'People can complete the main task without additional instructions or explanation.',
        test: 'Run a quick prototype test with representative users and ask them to complete the primary task in under one minute.',
        signal: 'Participants succeed without asking for clarification or wandering off the intended path.',
      },
    ],
    improvedPrompt: 'Create a polished product design that helps users complete a key task quickly and confidently. Focus on a clear primary flow, an intentional grid, consistent components, strong visual hierarchy, and distinct interaction states. Design for accessibility from the start, support responsive layouts, and use plain language and clear feedback so users understand what is happening at every step.',
  },
}
