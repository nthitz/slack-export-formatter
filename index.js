const fs = require('fs')
const path = require('path')
const yargs = require('yargs/yargs');


const argv = yargs(process.argv.slice(2))
  .describe('inputDirectory', 'specify the path to the exported slack data')
  .describe('splitMonths', 'split output by months')
  .default('splitMonths', false)
  .demandOption(['inputDirectory']).argv

console.log(argv)


const { inputDirectory, splitMonths } = argv

const channels = JSON.parse(fs.readFileSync(path.join(inputDirectory, 'channels.json')))

console.log(channels)

channels.forEach(channel => {
  const name = channel.name
  const channelLogs = fs.readdirSync(path.join(inputDirectory, name))
  console.log(channelLogs)
  const channelMessages = []
  let writeOutData = false
  const groupedChannelMessages = {}
  let groupAccessor = date => 'all'
  if (splitMonths) {
    groupAccessor = date => date.substr(0, 7)
  }

  channelLogs.forEach(date => {
    const dateMessages = JSON.parse(fs.readFileSync(path.join(inputDirectory, name, date)))
    const group = groupAccessor(date)
    // channelMessages.push(...dateMessages)
    if (!groupedChannelMessages[group]) {
      groupedChannelMessages[group] = []
    }
    groupedChannelMessages[group].push(...dateMessages)
  })
  Object.keys(groupedChannelMessages).forEach(group => {
    const messages = groupedChannelMessages[group]
    fs.writeFileSync(path.join(inputDirectory, `combined-${name}-${group}.json`), JSON.stringify(messages))

  })
})