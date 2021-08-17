import { RadioGroup } from '@headlessui/react'
import PropTypes from 'prop-types';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function RadioList(props) {
    const setSelectedWrapper = (option) => {
        props.onChange?.(option);
    }

    return (
        <RadioGroup value={props.selected} onChange={setSelectedWrapper}>
            {props.label && <RadioGroup.Label><div className="py-1">{props.label}</div></RadioGroup.Label>}
            <div className="bg-white rounded-md -space-y-px">
                {props.options.map((option, optionIdx) => (
                <RadioGroup.Option
                    key={option.name}
                    value={option}
                    className={({ checked }) =>
                    classNames(
                        optionIdx === 0 ? 'rounded-tl-md rounded-tr-md' : '',
                        optionIdx === props.options.length - 1 ? 'rounded-bl-md rounded-br-md' : '',
                        checked ? 'bg-indigo-50 border-indigo-200 z-10' : 'border-gray-200',
                        'relative border p-4 flex cursor-pointer focus:outline-none'
                    )
                    }
                >
                    {({ active, checked }) => (
                    <>
                        <span
                        className={classNames(
                            checked ? 'bg-indigo-600 border-transparent' : 'bg-white border-gray-300',
                            active ? 'ring-2 ring-offset-2 ring-indigo-500' : '',
                            'h-4 w-4 mt-0.5 cursor-pointer rounded-full border flex items-center justify-center'
                        )}
                        aria-hidden="true"
                        >
                        <span className="rounded-full bg-white w-1.5 h-1.5" />
                        </span>
                        <div className="ml-3 flex flex-col">
                        <RadioGroup.Label
                            as="span"
                            className={classNames(checked ? 'text-indigo-900' : 'text-gray-900', 'block text-sm font-medium')}
                        >
                            {option.name}
                        </RadioGroup.Label>
                        <RadioGroup.Description
                            as="span"
                            className={classNames(checked ? 'text-indigo-700' : 'text-gray-500', 'block text-sm')}
                        >
                            {option.description}
                        </RadioGroup.Description>
                        </div>
                    </>
                    )}
                </RadioGroup.Option>
                ))}
            </div>
        </RadioGroup>
    );
}

RadioList.propTypes = {
    options: PropTypes.array.isRequired,
    label: PropTypes.string
}