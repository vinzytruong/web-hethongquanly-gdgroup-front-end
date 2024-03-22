export interface Navigation {
  label: string
  path: string
}
export interface NavigationHasChildren {
  label: string
  path: string,
  children: any
}