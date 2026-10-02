import mongoose from 'mongoose'

const featuredStorySchema = new mongoose.Schema(
  {
    eyebrow: {
      type: String,
      default: 'Featured story · Cancer care',
    },
    title: {
      type: String,
      default: 'He Battled Cancer for 24 Years',
    },
    image: {
      type: String,
      default: '/src/assets/images/ccf-uci.jpg',
    },
    imageAlt: {
      type: String,
      default: 'Uganda Cancer Institute, where specialised cancer treatment is centred in Kampala',
    },
    leadParagraph: {
      type: String,
      default:
        'Salim Bwagu was a child when Hodgkin’s lymphoma entered his life. Nearly twenty years later, in 2006, support from Gilbert’s charity made it possible to finish treatment. In 2007 he was cleared. He went on to help other patients face the same two barriers: cost, and a lack of clear information.',
    },
    secondaryParagraph: {
      type: String,
      default:
        'The account is published in full on this site without added drama. What it insists on is ordinary and serious: stay with the treatment, and do not leave people to carry it alone.',
    },
    buttonText: {
      type: String,
      default: 'Read the Story',
    },
    buttonLink: {
      type: String,
      default: '/projects/he-battled-cancer-for-24-years',
    },
    sideNote: {
      type: String,
      default:
        'Told with Salim’s name, his family’s, and the dates in the original record — from Mulago in 1987 to the National Cancer Institute in 2007.',
    },
    sideLinkText: {
      type: String,
      default: 'The full story',
    },
    sideLinkUrl: {
      type: String,
      default: '/projects/he-battled-cancer-for-24-years',
    },
  },
  {
    timestamps: true,
  }
)

const FeaturedStory = mongoose.model('FeaturedStory', featuredStorySchema)

export default FeaturedStory
