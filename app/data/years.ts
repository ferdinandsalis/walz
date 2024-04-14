export function calculateCurrentYear(start: Date, current: Date = new Date()) {
  let completedYears = current.getFullYear() - start.getFullYear()

  // school year not yet completed
  if (current.getMonth() > 8) {
    completedYears -= 1
  }

  return completedYears
}
