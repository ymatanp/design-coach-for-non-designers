import { reviewLibrary, type TaskId, type ReviewResult } from '../data/designCoachData'

export const generateReviewInsights = (taskId: TaskId): ReviewResult => {
  return structuredClone(reviewLibrary[taskId])
}

export const analyzeWork = (taskId: TaskId, pastedText?: string, prompt?: string) => {
  const review = generateReviewInsights(taskId)

  if (pastedText) {
    review.whatIsWorking = [
      ...review.whatIsWorking,
      'The provided content is clear enough to support a focused review.',
      `Text review input was included for ${taskId}.`,
    ]
  }

  if (prompt) {
    review.improveTheseFirst = review.improveTheseFirst.map((item, index) =>
      index === 0
        ? { ...item, observed: `${item.observed} The generation prompt suggests specific design intent that should be aligned more closely with the intended user task.` }
        : item,
    )
  }

  return review
}
