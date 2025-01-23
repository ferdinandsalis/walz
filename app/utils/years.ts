type Options = {
  schoolStartMonth?: number // 0-based month, e.g., 8 for September
}

export function calculateCurrentYear(
  start: Date,
  current: Date = new Date(),
  options: Options = {},
) {
  const schoolStartMonth = options.schoolStartMonth ?? 7 // Default to August
  const startYear = start.getFullYear()
  const currentYear = current.getFullYear()

  // Determine if the current school year has started
  const hasCurrentSchoolYearStarted = current.getMonth() >= schoolStartMonth

  // Calculate the number of completed school years
  let completedYears = currentYear - startYear

  // Adjust for the current school year being in progress
  if (!hasCurrentSchoolYearStarted) {
    completedYears -= 1
  }

  // Ensure at least one year is counted if the current school year is ongoing
  completedYears = Math.max(0, completedYears) + 1

  return completedYears
}

export function determineCurrentSchoolYear(currentDate: Date = new Date()) {
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()
  const fromYear = currentMonth < 7 ? currentYear - 1 : currentYear
  const toYear = fromYear + 1
  return { from: new Date(fromYear, 7, 1), to: new Date(toYear, 6, 31) }
}
