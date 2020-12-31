const fs = require('fs')
const path = require('path')
const yargs = require('yargs/yargs');


const argv = yargs(process.argv.slice(2))
  .command('inputDirectory', 'specify the path to the exported slack data', {
    inputDirectory: {
      description: 'the input directory',
      alias: 'i',
      type: 'string',
      demandOption: true,
    }
  }).demandOption(['inputDirectory']).argv

console.log(argv)


const channels = JSON.parse(fs.readFileSync(path.join(argv.inputDirectory, 'channels.json')))

console.log(channels)

channels.forEach(channel => {
  const name = channel.name
  const channelLogs = fs.readdirSync(path.join(argv.inputDirectory, name))
  console.log(channelLogs)
  const channelMessages = []
  channelLogs.forEach(date => {
    const dateMessages = JSON.parse(fs.readFileSync(path.join(argv.inputDirectory, name, date)))
    channelMessages.push(...dateMessages)
  })
  fs.writeFileSync(path.join(argv.inputDirectory, `combined-${name}.json`), JSON.stringify(channelMessages))
})