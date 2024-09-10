export class DateFormatter {
  static getDDMMYYYY(dateString: string): string {
    const [year, month, day] = dateString.split('-').map(Number)
    const date = new Date(year, month - 1, day) // Create a date using local time (month is 0-based)

    const formatter = new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })

    return formatter.format(date)
  }
}
