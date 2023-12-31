import { ConfigType } from './components/ConfigProvider'

export const loadConfigFromFile = async () => {
  let defaultConfig: ConfigType
  try {
    const defaultPublicConfigFile = await fetch('/config.default.json')
    defaultConfig = await defaultPublicConfigFile.json()
  } catch {
    throw new Error('Default config does not exist in the public directory')
  }

  let overrideConfig: ConfigType
  try {
    const overrideConfigFile = await fetch('/env-config.json')
    overrideConfig = await overrideConfigFile.json()
  } catch {
    console.info('File env-config.json not specified or wrong format (requires json). Using default config...')
    return defaultConfig
  }

  console.info('Using merged (default with override) config...')
  return mergeConfig(defaultConfig, overrideConfig)
}

const mergeConfig = (defaultConfig: ConfigType, overrideConfig: ConfigType) => {
  const initialConfigKeys = Object.keys(defaultConfig)
  const overrideConfigMatchingKeys = Object.keys(overrideConfig).filter((key) =>
    initialConfigKeys.includes(key),
  ) as (keyof ConfigType)[]

  overrideConfigMatchingKeys.forEach((key) => {
    if (typeof defaultConfig[key] === typeof overrideConfig[key]) {
      defaultConfig[key] = overrideConfig[key]
    }
  })

  return defaultConfig
}
