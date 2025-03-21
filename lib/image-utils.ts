/**
 * Utility functions for handling images
 */

/**
 * Checks if a URL is valid
 * @param url The URL to check
 * @returns True if the URL is valid, false otherwise
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch (error) {
    return false
  }
}

/**
 * Gets a fallback image URL if the original URL is invalid
 * @param url The original URL
 * @param fallbackText Text to display in the fallback image
 * @returns A valid image URL
 */
export function getFallbackImageUrl(url: string | undefined, fallbackText = "Image Not Available"): string {
  if (!url || !isValidUrl(url)) {
    return `/placeholder.svg?height=400&width=400&text=${encodeURIComponent(fallbackText)}`
  }
  return url
}

/**
 * Preloads an image to check if it can be loaded
 * @param url The image URL to preload
 * @returns A promise that resolves to true if the image can be loaded, false otherwise
 */
export function preloadImage(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (!url || !isValidUrl(url)) {
      resolve(false)
      return
    }

    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = url
  })
}

