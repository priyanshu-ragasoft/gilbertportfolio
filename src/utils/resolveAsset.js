import schoolyard from '../assets/images/Supporting-Education-Empowering-Futures.jpg'
import classroom from '../assets/images/Gilbert-Kwizera-Charity-Support-for-Uganda-Students-Drive.jpg'
import salim from '../assets/images/He-Battled-Cancer-for-24-Years.jpg'
import institute from '../assets/images/ccf-uci.jpg'
import ccfCare from '../assets/images/ccf-cancer-care-compassion.jpg'
import employmentInitiative from '../assets/images/kwizera-humanitarian-employment-initiative.jpg'
import hotelEntrance from '../assets/images/gilbert-kwizera-hotel-entrance.jpg'
import sanjayDutt from '../assets/images/gilbert-kwizera-sanjay-dutt.jpg'
import marinaYacht from '../assets/images/gilbert-kwizera-dubai-marina-yacht.jpg'
import jack1 from '../assets/images/jack1.jpg'
import jack2 from '../assets/images/jack2.jpg'
import paImage from '../assets/images/pa.jpeg'
import peImage from '../assets/images/pe.jpeg'
import havenWelfare from '../assets/images/havenwelfare.jpg'
import pioTech from '../assets/images/pio-ecosystem-technology.jpg'

import executive from '../assets/images/gilbert-kwizera-executive.jpg'
import loungeArmchair from '../assets/images/gilbert-kwizera-lounge-armchair.jpg'
import officeStanding from '../assets/images/gilbert-kwizera-office-standing.jpg'
import dubaiWalking from '../assets/images/gilbert-kwizera-dubai-walking.jpg'
import marbleLobby from '../assets/images/gilbert-kwizera-marble-lobby.jpg'
import ccfCareSanctuary from '../assets/images/ccf-care.jpg'
import blockchainBook from '../assets/images/Blockchain.jpg'
import cancerVideo from '../assets/images/Gilbert-Kwizera-Driving-Cancer-Support-and-Awareness-in-Uganda.jpg'
import hopePortrait from '../assets/images/Gilbert-Kevin-Jimmy-Kwizera-A-Life-Dedicated-to-Hope-and-Charity.jpg'
import dubaiBoardroom from '../assets/images/PIO-System-and-Gilbert-Kevin-Jimmy-Kwizeras-Innovation-Role.jpg'
import solutionKevin from '../assets/images/solution-kevin.jpg'
import aboutKevin from '../assets/images/about-kevin.jpg'

const ASSET_MAP = {
  'Supporting-Education-Empowering-Futures.jpg': schoolyard,
  'Gilbert-Kwizera-Charity-Support-for-Uganda-Students-Drive.jpg': classroom,
  'He-Battled-Cancer-for-24-Years.jpg': salim,
  'ccf-uci.jpg': institute,
  'ccf-cancer-care-compassion.jpg': ccfCare,
  'kwizera-humanitarian-employment-initiative.jpg': employmentInitiative,
  'gilbert-kwizera-hotel-entrance.jpg': hotelEntrance,
  'gilbert-kwizera-sanjay-dutt.jpg': sanjayDutt,
  'gilbert-kwizera-dubai-marina-yacht.jpg': marinaYacht,
  'jack1.jpg': jack1,
  'jack2.jpg': jack2,
  'pa.jpeg': paImage,
  'pe.jpeg': peImage,
  'havenwelfare.jpg': havenWelfare,
  'pio-ecosystem-technology.jpg': pioTech,
  'gilbert-kwizera-executive.jpg': executive,
  'gilbert-kwizera-lounge-armchair.jpg': loungeArmchair,
  'gilbert-kwizera-office-standing.jpg': officeStanding,
  'gilbert-kwizera-dubai-walking.jpg': dubaiWalking,
  'gilbert-kwizera-marble-lobby.jpg': marbleLobby,
  'ccf-care.jpg': ccfCareSanctuary,
  'Blockchain.jpg': blockchainBook,
  'Gilbert-Kwizera-Driving-Cancer-Support-and-Awareness-in-Uganda.jpg': cancerVideo,
  'Gilbert-Kevin-Jimmy-Kwizera-A-Life-Dedicated-to-Hope-and-Charity.jpg': hopePortrait,
  'PIO-System-and-Gilbert-Kevin-Jimmy-Kwizeras-Innovation-Role.jpg': dubaiBoardroom,
  'solution-kevin.jpg': solutionKevin,
  'about-kevin.jpg': aboutKevin,
}

export function resolveAsset(src) {
  if (!src) return schoolyard
  if (typeof src === 'object' && src?.src) return src.src
  if (typeof src !== 'string') return src

  // Extract filename
  const filename = src.split('/').pop().split('\\').pop()
  if (ASSET_MAP[filename]) {
    return ASSET_MAP[filename]
  }

  return src
}
