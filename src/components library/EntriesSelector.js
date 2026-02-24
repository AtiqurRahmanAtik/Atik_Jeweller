* @param {object} props
 * @param {number} props.value - The current value of the selector.
 * @param {function} props.onChange - The function to call when the value changes.
 * @param {number[]} props.options - An array of numbers for the select options.
 */
const EntriesSelector = ({ value, onChange, options }) => {
  return (
    <div className="mb-4 flex items-center">
      <label htmlFor="entries" className="mr-2 text-gray-600">Show</label>
      <select
        id="entries"
        value={value}
        onChange={onChange}
        className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {options.map(optionValue => (
          <option key={optionValue} value={optionValue}>{optionValue}</option>
        ))}
      </select>
      <span className="ml-2 text-gray-600">entries</span>
    </div>
  );
};