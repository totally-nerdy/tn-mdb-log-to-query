function replaceOperations (input) {
  if (input.match(/(?<="\$regularExpression":)(.*?)(?<=})/gm)) {
    // {"$regularExpression":{"pattern":"^wildcard_7$","options":""}}
    const matches = input.match(/(?<="\$regularExpression":)(.*?)(?<=})/gm)
    for (const match of matches) {
      try {
        const matchJson = JSON.parse(match)
        console.debug('$regularExpression', match, matchJson)
        input = input.replace(`{"$regularExpression":${match}}`, `/${matchJson.pattern}/${matchJson.options}`)
      } catch (e) {
        console.error('Couldn\'t parse $regularExpression', match)
      }
    }
  }
  if (input.match(/(?<="\$date":)(.*?)(?=})/gm)) {
    // {"$date":"2024-08-05T00:00:00.000Z"}
    const matches = input.match(/(?<="\$date":)(.*?)(?=})/gm)
    for (const match of matches) {
      try {
        const matchJson = JSON.parse(match)
        console.debug('$date', match, matchJson)
        input = input.replace(`{"$date":${match}}`, `ISODate(${match})`)
      } catch (e) {
        console.error('Couldn\'t parse $date', match)
      }
    }
  }
  return input
}

export function parse (input) {
  console.debug('Input:', input)
  let output = ''
  try {
    const jsonInput = JSON.parse(input)
    console.debug('JSON:', jsonInput)
    if (jsonInput.attr && jsonInput.attr.command) {
      const command = jsonInput.attr.command
      let collection

      if (command.aggregate) {
        // Aggregation
        const pipeline = command.pipeline
        let pipelineString = JSON.stringify(pipeline)
        collection = command.aggregate

        pipelineString = replaceOperations(pipelineString)

        // output = `db.${collection}.aggregate(${JSON.stringify(pipeline)});`
        output = `db.${collection}.aggregate(${pipelineString});`
      } else if (command.find) {
        const filter = command.filter
        const sort = command.sort
        let filterString = JSON.stringify(filter)
        collection = command.find

        filterString = replaceOperations(filterString)

        // output = `db.${collection}.find(${JSON.stringify(filter)})`
        output = `db.${collection}.find(${filterString})`
        if (sort) {
          output += `.sort(${JSON.stringify(sort)})`
        }
        output += ';'
      }
    }
  } catch (e) {
    alert('The given input doesn\'t look like a JSON string. Are you on a MongoDB version < 4.4? Please paste only one log message at a time.')
  }
  return output
}
