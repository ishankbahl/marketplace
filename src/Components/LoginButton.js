export default function LoginButton(props) {

    return (
        <button
            onClick={props.click}
            className="inline-flex items-center px-6 py-2.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
            Login with BitClout
        </button>
    )
}