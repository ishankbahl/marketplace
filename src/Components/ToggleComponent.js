import { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import { Switch } from '@headlessui/react'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Toggle(props) {
  const [enabled, setEnabled] = useState();
  const setEnabledWrapper = (flag) => {
    setEnabled(flag);
    props.setEnabled(flag);
  }

  useEffect(() => {
    setEnabled(props.default);
  }, [props.default]);

  return (
    <Switch.Group as="div" className="flex items-center">
      <Switch
        checked={enabled}
        onChange={setEnabledWrapper}
        className={classNames(
          enabled ? 'bg-indigo-600' : 'bg-gray-200',
          'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            enabled ? 'translate-x-5' : 'translate-x-0',
            'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-20'
          )}
        />
      </Switch>
      {props.text && <Switch.Label as="span" className="ml-3">
          <p className="text-xs font-medium text-gray-900">{props.text}</p>
      </Switch.Label>}
    </Switch.Group>
  )
}

Toggle.propTypes = {
    default: PropTypes.bool,
    setEnabled: PropTypes.func,
    text: PropTypes.string
};
