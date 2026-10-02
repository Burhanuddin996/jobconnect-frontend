import { useState } from 'react'

function AutocompleteInput(props) {
  const [showList, setShowList] = useState(false)

  const query = props.value.toLowerCase()
  const matches = props.suggestions.filter(function (item) {
    return query.length > 0 && item.toLowerCase().indexOf(query) !== -1
  }).slice(0, 8)

  function handleFocus(e) {
    e.target.select()
    setShowList(true)
  }

  function handleBlur() {
    setTimeout(function () { setShowList(false) }, 150)
  }

  function handlePick(item) {
    props.onChange(item)
    setShowList(false)
  }

  return (
    <div className="autocomplete">
      <input
        placeholder={props.placeholder}
        value={props.value}
        onChange={function (e) { props.onChange(e.target.value) }}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {showList && matches.length > 0 ? (
        <ul className="autocomplete-list">
          {matches.map(function (item) {
            return (
              <li key={item} onMouseDown={function () { handlePick(item) }}>
                {item}
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}

export default AutocompleteInput