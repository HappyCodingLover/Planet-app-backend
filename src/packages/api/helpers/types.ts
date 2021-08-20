export enum SIGN_UP_TYPES {
  WEBSITE = 'WEBSITE',
  GOOGLE = 'GOOGLE',
  DISCORD = 'DISCORD',
  STEAM = 'STEAM',
  EXISTING = 'EXISTING',
}

export const GAME_PLATFORM_TYPES = {
  Steam : 'Steam',
  Xbox : 'Xbox',
  PS : 'PS4',
  Epic : 'Epic',
  Switch : 'Switch',
  Discord : 'Discord',
}
export interface ICookie {
  name: string
  value: string
  path: string
  domain: string
  secure: boolean
  httpOnly: boolean
}
