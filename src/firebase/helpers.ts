/**
 * Assuming the Data is a firebase document, this function will extract the flowTime from the data
 *
 * @param data an object that is assumed to be a firebase document data
 * @returns the flowTime of the data, or -1 if it cannot be found
 */
export function extractFlowTime(data: any): number {
  if (!data) return -1
  if (data.flowTime && typeof data.flowTime === 'number')
    return data.flowTime as number
  if (data.updatedAt && data.updatedAt.toMillis())
    return Math.floor(data.updatedAt.toMillis()) as number
  if (data.createdAt && data.createdAt.toMillis())
    return Math.floor(data.createdAt.toMillis()) as number
  return -1
}
